-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'CREADA',
    "responsable" TEXT NOT NULL,
    "fechaCreacion" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Tarea" ("descripcion", "estado", "fechaCreacion", "id", "responsable", "titulo") SELECT "descripcion", "estado", "fechaCreacion", "id", "responsable", "titulo" FROM "Tarea";
DROP TABLE "Tarea";
ALTER TABLE "new_Tarea" RENAME TO "Tarea";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
