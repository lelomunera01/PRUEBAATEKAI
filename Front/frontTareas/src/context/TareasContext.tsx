import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Tarea, EstadoTarea } from "../types";
import { tareasService } from "../services/tareasService";

interface TareasState {
  tareas: Tarea[];
  loading: boolean;
  error: string | null;
}

type TareasAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TAREAS"; payload: Tarea[] }
  | { type: "ADD_TAREA"; payload: Tarea }
  | { type: "UPDATE_TAREA"; payload: Tarea }
  | { type: "DELETE_TAREA"; payload: number }
  | { type: "SET_ERROR"; payload: string }
  | { type: "CLEAR_ERROR" };

const initialState: TareasState = {
  tareas: [],
  loading: false,
  error: null,
};

const tareasReducer = (
  state: TareasState,
  action: TareasAction
): TareasState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_TAREAS":
      return { ...state, tareas: action.payload, error: null };
    case "ADD_TAREA":
      return { ...state, tareas: [...state.tareas, action.payload] };
    case "UPDATE_TAREA":
      return {
        ...state,
        tareas: state.tareas.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case "DELETE_TAREA":
      return {
        ...state,
        tareas: state.tareas.filter((t) => t.id !== action.payload),
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

interface TareasContextType {
  state: TareasState;
  fetchTareas: () => Promise<void>;
  createTarea: (tarea: Omit<Tarea, "id" | "fechaCreacion">) => Promise<void>;
  updateTarea: (id: number, tarea: Partial<Tarea>) => Promise<void>;
  deleteTarea: (id: number) => Promise<void>;
  changeEstado: (id: number, nuevoEstado: EstadoTarea) => Promise<void>;
  getTareasByEstado: (estado: EstadoTarea) => Tarea[];
}

const TareasContext = createContext<TareasContextType | undefined>(undefined);

export const TareasProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(tareasReducer, initialState);

  const fetchTareas = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const tareas = await tareasService.getTareas();
      dispatch({ type: "SET_TAREAS", payload: tareas });
      dispatch({ type: "CLEAR_ERROR" });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Error al cargar las tareas" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createTarea = async (tarea: Omit<Tarea, "id" | "fechaCreacion">) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const nuevaTarea = await tareasService.createTarea(tarea);
      dispatch({ type: "ADD_TAREA", payload: nuevaTarea });
      dispatch({ type: "CLEAR_ERROR" });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Error al crear la tarea" });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const updateTarea = async (id: number, tarea: Partial<Tarea>) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const tareaActualizada = await tareasService.updateTarea(id, tarea);
      dispatch({ type: "UPDATE_TAREA", payload: tareaActualizada });
      dispatch({ type: "CLEAR_ERROR" });

      // Recargar tareas para asegurar sincronización
      setTimeout(() => {
        fetchTareas();
      }, 100);
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Error al actualizar la tarea" });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteTarea = async (id: number) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      await tareasService.deleteTarea(id);
      dispatch({ type: "DELETE_TAREA", payload: id });
      dispatch({ type: "CLEAR_ERROR" });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Error al eliminar la tarea" });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const changeEstado = async (id: number, nuevoEstado: EstadoTarea) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      const tareaActualizada = await tareasService.changeEstado(
        id,
        nuevoEstado
      );
      dispatch({ type: "UPDATE_TAREA", payload: tareaActualizada });
      dispatch({ type: "CLEAR_ERROR" });

      // Recargar tareas para asegurar sincronización
      setTimeout(() => {
        fetchTareas();
      }, 100);
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Error al cambiar el estado de la tarea",
      });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const getTareasByEstado = (estado: EstadoTarea): Tarea[] => {
    return state.tareas.filter((t) => t.estado === estado);
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  const value: TareasContextType = {
    state,
    fetchTareas,
    createTarea,
    updateTarea,
    deleteTarea,
    changeEstado,
    getTareasByEstado,
  };

  return (
    <TareasContext.Provider value={value}>{children}</TareasContext.Provider>
  );
};

export const useTareas = (): TareasContextType => {
  const context = useContext(TareasContext);
  if (context === undefined) {
    throw new Error("useTareas debe ser usado dentro de un TareasProvider");
  }
  return context;
};
