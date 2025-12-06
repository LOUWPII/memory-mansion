import { create } from 'zustand';

export type FurnitureType = 'bed' | 'desk' | 'wardrobe' | 'nightstand' | 'shelf' | 'chair' | null;

export interface LearningItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: FurnitureType;
}

export interface FurnitureInteraction {
  furnitureId: FurnitureType;
  timeSpent: number;
  interactions: number;
  lastVisited: Date | null;
}

interface PalaceState {
  selectedFurniture: FurnitureType;
  isAssistantOpen: boolean;
  assistantMessage: string;
  progress: number;
  
  learningItems: LearningItem[];
  pendingTasks: LearningItem[];
  completedItems: LearningItem[];
  
  furnitureStats: Record<string, FurnitureInteraction>;
  
  setSelectedFurniture: (furniture: FurnitureType) => void;
  toggleAssistant: () => void;
  setAssistantMessage: (message: string) => void;
  completeItem: (id: string) => void;
  addPendingTask: (task: Omit<LearningItem, 'id' | 'completed'>) => void;
  updateFurnitureStats: (furniture: FurnitureType) => void;
}

const furnitureMessages: Record<string, string> = {
  bed: "🛏️ Estás en la Cama - el lugar de los conceptos fundacionales. Aquí reposas mientras absorbes los fundamentos de tu aprendizaje. Relájate y deja que la información fluya.",
  desk: "📚 Bienvenido al Escritorio - tu espacio de conocimiento aplicado. Aquí encontrarás tareas, ejercicios prácticos y casos reales para poner en práctica lo aprendido.",
  wardrobe: "🧍‍♂️ El Armario guarda tus listas clasificadas. Abre las puertas para explorar procesos paso a paso, módulos de aprendizaje y carpetas de memoria organizadas.",
  nightstand: "🌜 La Mesa de Noche contiene lo urgente. Aquí encontrarás tus tareas pendientes, notas rápidas y recordatorios importantes que requieren tu atención.",
  shelf: "🔖 La Estantería es tu biblioteca de logros. Cada libro representa un módulo dominado, conocimiento consolidado que ya forma parte de ti.",
  chair: "🪑 La Silla del Escritorio activa tu autoevaluación. Siéntate para reflexionar, responder quiz rápidos y medir tu comprensión.",
};

const initialLearningItems: LearningItem[] = [
  { id: '1', title: 'Filosofía del curso', description: 'Comprende los principios fundamentales', completed: false, category: 'bed' },
  { id: '2', title: 'Conceptos clave iniciales', description: 'Domina las bases teóricas', completed: false, category: 'bed' },
  { id: '3', title: 'Proceso de onboarding', description: 'Fases del programa de integración', completed: false, category: 'wardrobe' },
  { id: '4', title: 'Ejercicio práctico 1', description: 'Aplica los conceptos aprendidos', completed: false, category: 'desk' },
  { id: '5', title: 'Quiz de comprensión', description: 'Evalúa tu progreso', completed: false, category: 'chair' },
];

const initialPendingTasks: LearningItem[] = [
  { id: 'p1', title: 'Revisar fundamentos', description: 'Pendiente para hoy', completed: false, category: 'nightstand' },
  { id: 'p2', title: 'Completar módulo 2', description: 'Fecha límite: mañana', completed: false, category: 'nightstand' },
];

export const usePalaceStore = create<PalaceState>((set, get) => ({
  selectedFurniture: null,
  isAssistantOpen: true,
  assistantMessage: "¡Bienvenido a tu Palacio Mental! 🏰 Explora cada mueble para descubrir diferentes áreas de aprendizaje. Haz clic en cualquier objeto para comenzar.",
  progress: 25,
  
  learningItems: initialLearningItems,
  pendingTasks: initialPendingTasks,
  completedItems: [],
  
  furnitureStats: {
    bed: { furnitureId: 'bed', timeSpent: 0, interactions: 0, lastVisited: null },
    desk: { furnitureId: 'desk', timeSpent: 0, interactions: 0, lastVisited: null },
    wardrobe: { furnitureId: 'wardrobe', timeSpent: 0, interactions: 0, lastVisited: null },
    nightstand: { furnitureId: 'nightstand', timeSpent: 0, interactions: 0, lastVisited: null },
    shelf: { furnitureId: 'shelf', timeSpent: 0, interactions: 0, lastVisited: null },
    chair: { furnitureId: 'chair', timeSpent: 0, interactions: 0, lastVisited: null },
  },
  
  setSelectedFurniture: (furniture) => {
    const message = furniture ? furnitureMessages[furniture] : "Selecciona un mueble para explorar su contenido de aprendizaje.";
    set({ selectedFurniture: furniture, assistantMessage: message });
    if (furniture) {
      get().updateFurnitureStats(furniture);
    }
  },
  
  toggleAssistant: () => set((state) => ({ isAssistantOpen: !state.isAssistantOpen })),
  
  setAssistantMessage: (message) => set({ assistantMessage: message }),
  
  completeItem: (id) => set((state) => {
    const item = state.learningItems.find(i => i.id === id);
    if (item) {
      const completedItem = { ...item, completed: true };
      const newCompleted = [...state.completedItems, completedItem];
      const newProgress = Math.min(100, state.progress + 15);
      return {
        learningItems: state.learningItems.filter(i => i.id !== id),
        completedItems: newCompleted,
        progress: newProgress,
      };
    }
    return state;
  }),
  
  addPendingTask: (task) => set((state) => ({
    pendingTasks: [...state.pendingTasks, { ...task, id: Date.now().toString(), completed: false }],
  })),
  
  updateFurnitureStats: (furniture) => {
    if (!furniture) return;
    set((state) => ({
      furnitureStats: {
        ...state.furnitureStats,
        [furniture]: {
          ...state.furnitureStats[furniture],
          interactions: state.furnitureStats[furniture].interactions + 1,
          lastVisited: new Date(),
        },
      },
    }));
  },
}));
