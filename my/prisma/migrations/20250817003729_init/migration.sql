-- CreateTable
CREATE TABLE "Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
