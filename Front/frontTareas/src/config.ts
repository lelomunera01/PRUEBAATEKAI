// Configuración de la aplicación
export const config = {
  // URL de la API del backend
  API_URL: import.meta.env.VITE_API_URL || "http://localhost:3001",

  // Entorno de la aplicación
  NODE_ENV: import.meta.env.NODE_ENV || "development",

  // Configuración de la API
  API_TIMEOUT: 10000, // 10 segundos

  // Estados de tareas disponibles
  ESTADOS_TAREA: [
    "CREADA",
    "EN_PROGRESO",
    "BLOQUEADA",
    "FINALIZADA",
    "CANCELADA",
  ] as const,

  // Estados de tareas con nombres legibles
  ESTADOS_TAREA_LABELS: {
    CREADA: "Creada",
    EN_PROGRESO: "En progreso",
    BLOQUEADA: "Bloqueada",
    FINALIZADA: "Finalizada",
    CANCELADA: "Cancelada",
  } as const,
};
