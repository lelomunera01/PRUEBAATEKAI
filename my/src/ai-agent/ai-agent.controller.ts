import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

interface AiAgentRequestBody {
  mensaje: string;
}

@Controller('ai-agent')
export class AiAgentController {
  @Post()
  @HttpCode(HttpStatus.OK)
  async proxyToN8n(@Body() body: AiAgentRequestBody) {
    const mensaje = (body?.mensaje ?? '').toString();

    const n8nUrl =
      process.env.N8N_WEBHOOK_URL ||
      'http://localhost:5678/webhook/ai-agent-cohere-activado';
    const basicUser = process.env.N8N_BASIC_USER || 'admin';
    const basicPass = process.env.N8N_BASIC_PASS || 'admin123';
    const basicToken = Buffer.from(`${basicUser}:${basicPass}`).toString(
      'base64',
    );

    // Intentar llamar n8n; si falla o responde con error/404, usamos fallback
    try {
      const res = await fetch(n8nUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${basicToken}`,
        },
        body: JSON.stringify({ mensaje }),
      });

      const text = await res.text();
      let parsed: any = null;
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = { respuesta: text };
      }

      const p: any = parsed;
      const hasUseful =
        p &&
        (typeof p.respuesta === 'string' ||
          typeof p.accion === 'string' ||
          p.cohereUsed === true);

      const shouldFallback =
        !res.ok ||
        (p && p.code && p.code !== 200) ||
        (typeof p?.message === 'string' &&
          p.message.toLowerCase().includes('not registered')) ||
        !hasUseful;

      if (!shouldFallback) {
        return parsed;
      }
    } catch (_) {
      // Ignorar y aplicar fallback
    }

    // Fallback local: resolver 3 intenciones básicas
    const msg = mensaje
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const base = 'http://localhost:3001';
    if (msg.includes('bloquead')) {
      const r = await fetch(base + '/tareas/bloqueadas');
      const arr = await r.json();
      return {
        respuesta: `Hay ${Array.isArray(arr) ? arr.length : 0} tareas bloqueadas.`,
        data: arr,
        accion: 'tareas_bloqueadas',
        via: 'fallback',
      };
    }
    if (msg.includes('estadistic')) {
      const r = await fetch(base + '/tareas/estadisticas');
      const s = await r.json();
      return {
        respuesta: `Total: ${s.total}, CREADAS: ${s.creadas}, EN_PROGRESO: ${s.enProgreso}, BLOQUEADAS: ${s.bloqueadas}, FINALIZADAS: ${s.finalizadas}, CANCELADAS: ${s.canceladas}`,
        data: s,
        accion: 'estadisticas',
        via: 'fallback',
      };
    }
    if (msg.includes('mas tareas') || msg.includes('ranking')) {
      const r = await fetch(base + '/tareas');
      const tareas = await r.json();
      const map: Record<string, number> = {};
      for (const t of Array.isArray(tareas) ? tareas : [])
        map[t.responsable || 'Desconocido'] =
          (map[t.responsable || 'Desconocido'] || 0) + 1;
      let top: [string, number] | null = null;
      for (const [k, v] of Object.entries(map))
        if (!top || (v as number) > top[1]) top = [k, v as number];
      if (!top)
        return {
          respuesta: 'No hay tareas registradas',
          accion: 'ranking_responsables',
          via: 'fallback',
        };
      return {
        respuesta: `El responsable con más tareas es ${top[0]} con ${top[1]} tareas.`,
        ranking: map,
        accion: 'ranking_responsables',
        via: 'fallback',
      };
    }

    return { respuesta: 'No entendí la intención', accion: 'fallback' };
  }
}
