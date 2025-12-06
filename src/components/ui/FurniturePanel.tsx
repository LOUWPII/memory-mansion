import { motion, AnimatePresence } from 'framer-motion';
import { usePalaceStore, FurnitureType } from '@/store/palaceStore';
import { X, BookOpen, CheckCircle, Clock, Brain, Target, Lightbulb } from 'lucide-react';
import { Button } from './button';

const furnitureData: Record<string, {
  title: string;
  icon: React.ReactNode;
  purpose: string;
  items: string[];
  action: string;
}> = {
  bed: {
    title: 'Cama - Fundamentos',
    icon: <BookOpen className="w-5 h-5" />,
    purpose: 'Conceptos fundacionales y base del aprendizaje',
    items: ['Filosofía del curso', 'Conceptos clave iniciales', 'Fundamentos de la empresa'],
    action: 'Repasar teoría principal',
  },
  desk: {
    title: 'Escritorio - Práctica',
    icon: <Target className="w-5 h-5" />,
    purpose: 'Conocimiento aplicado y ejercicios prácticos',
    items: ['Tareas pendientes', 'Ejercicios prácticos', 'Casos reales', 'Guías de estudio'],
    action: 'Comenzar ejercicio',
  },
  wardrobe: {
    title: 'Armario - Módulos',
    icon: <Brain className="w-5 h-5" />,
    purpose: 'Listas clasificadas y procesos organizados',
    items: ['Módulo 1: Introducción', 'Módulo 2: Desarrollo', 'Módulo 3: Avanzado'],
    action: 'Abrir módulo',
  },
  nightstand: {
    title: 'Mesa de Noche - Pendientes',
    icon: <Clock className="w-5 h-5" />,
    purpose: 'Tareas urgentes y recordatorios',
    items: ['Revisar fundamentos', 'Completar módulo 2', 'Quiz de mañana'],
    action: 'Ver pendientes',
  },
  shelf: {
    title: 'Estantería - Logros',
    icon: <CheckCircle className="w-5 h-5" />,
    purpose: 'Conocimiento dominado y consolidado',
    items: ['Introducción ✓', 'Conceptos básicos ✓', 'Primera evaluación ✓'],
    action: 'Revisar logros',
  },
  chair: {
    title: 'Silla - Autoevaluación',
    icon: <Lightbulb className="w-5 h-5" />,
    purpose: 'Reflexión y evaluación del progreso',
    items: ['Quiz rápido', 'Preguntas de repaso', 'Test de comprensión'],
    action: 'Iniciar quiz',
  },
};

export const FurniturePanel = () => {
  const { selectedFurniture, setSelectedFurniture, completeItem, learningItems } = usePalaceStore();
  
  const data = selectedFurniture ? furnitureData[selectedFurniture] : null;
  const relatedItems = learningItems.filter(item => item.category === selectedFurniture);
  
  return (
    <AnimatePresence>
      {selectedFurniture && data && (
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-80 glass-panel rounded-xl p-5 z-20"
        >
          <button
            onClick={() => setSelectedFurniture(null)}
            className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              {data.icon}
            </div>
            <div>
              <h3 className="font-serif font-semibold text-foreground">{data.title}</h3>
              <p className="text-xs text-muted-foreground">{data.purpose}</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Contenido
            </p>
            <ul className="space-y-1.5">
              {data.items.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-foreground/80 py-1.5 px-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
          
          {relatedItems.length > 0 && (
            <div className="space-y-2 mb-4 pt-3 border-t border-border/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tareas activas
              </p>
              <ul className="space-y-1.5">
                {relatedItems.map((item) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-between gap-2 text-sm py-1.5 px-2 rounded-md bg-muted/30"
                  >
                    <span className="text-foreground/80">{item.title}</span>
                    <button
                      onClick={() => completeItem(item.id)}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      Completar
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
          
          <Button className="w-full" size="sm">
            {data.action}
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
