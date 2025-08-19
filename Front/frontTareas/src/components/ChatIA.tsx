import React, { useMemo, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; text: string };

function extractTextFromResponse(resp: any): string {
  if (!resp) return "Sin respuesta";
  if (typeof resp === "string") return resp;
  if (resp.accion === "tareas_bloqueadas" && Array.isArray(resp.data)) {
    const count = resp.data.length;
    const lines = resp.data
      .slice(0, 20)
      .map(
        (t: any) =>
          `- [${t.id}] ${t.titulo} · ${
            t.responsable || "(sin responsable)"
          } · ${new Date(t.fechaCreacion).toLocaleString()}`
      )
      .join("\n");
    return `Bloqueadas: ${count}\n${lines}`;
  }
  if (resp.accion === "estadisticas" && resp.data) {
    const s = resp.data;
    return `Total: ${s.total}, CREADAS: ${s.creadas}, EN_PROGRESO: ${s.enProgreso}, BLOQUEADAS: ${s.bloqueadas}, FINALIZADAS: ${s.finalizadas}, CANCELADAS: ${s.canceladas}`;
  }
  if (resp.accion === "ranking_responsables" && resp.ranking) {
    const entries = Object.entries(resp.ranking as Record<string, number>);
    if (entries.length === 0) return "No hay tareas registradas";
    const [topName, topCount] = entries.reduce((a, b) =>
      a[1] >= (b[1] as number) ? a : (b as any)
    ) as [string, number];
    return `El responsable con más tareas es ${topName} con ${topCount} tareas.`;
  }
  if (resp.respuesta && typeof resp.respuesta === "string")
    return resp.respuesta;
  if (resp.echo?.body?.mensaje) {
    return `Recibido: ${resp.echo.body.mensaje}`;
  }
  return "No se pudo interpretar la respuesta";
}

const ChatIA: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(
    () => mensaje.trim().length > 0 && !loading,
    [mensaje, loading]
  );

  const enviar = async () => {
    if (!canSend) return;
    const userText = mensaje.trim();
    setMensaje("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensaje: userText }),
      });
      const data = await res
        .json()
        .catch(() => ({ respuesta: "Sin respuesta" }));
      const text = extractTextFromResponse(data);
      setMessages((prev) => [...prev, { role: "assistant", text }]);
    } catch (_e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "No se pudo obtener respuesta" },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (listRef.current)
          listRef.current.scrollTop = listRef.current.scrollHeight;
      }, 50);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center"
          title="Abrir Agente IA"
        >
          IA
        </button>
      )}
      {isOpen && (
        <div className="w-80 bg-white shadow-xl rounded-lg border flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b">
            <h3 className="font-semibold">Agente IA</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cerrar
            </button>
          </div>
          <div
            ref={listRef}
            className="p-3 space-y-2 max-h-64 overflow-auto bg-gray-50"
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`${
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border"
                  } rounded-lg px-3 py-2 max-w-[85%] text-sm whitespace-pre-wrap`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-gray-500">Escribiendo…</div>
            )}
          </div>
          <div className="p-2 border-t flex items-center space-x-2">
            <input
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") enviar();
              }}
              placeholder="Escribe tu mensaje…"
              className="flex-1 border rounded px-2 py-1 text-sm"
            />
            <button
              onClick={enviar}
              disabled={!canSend}
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatIA;
