import { motion } from 'framer-motion';
import { usePalaceStore } from '@/store/palaceStore';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { Progress } from './progress';

export const ProgressSidebar = () => {
  const { 
    progress, 
    completedItems, 
    pendingTasks, 
    furnitureStats,
    learningItems
  } = usePalaceStore();
  
  const mostUsedFurniture = Object.entries(furnitureStats)
    .sort((a, b) => b[1].interactions - a[1].interactions)
    .slice(0, 3);
  
  const furnitureLabels: Record<string, string> = {
    bed: '🛏️ Cama',
    desk: '📚 Escritorio',
    wardrobe: '🧍 Armario',
    nightstand: '🌜 Mesa de noche',
    shelf: '🔖 Estantería',
    chair: '🪑 Silla',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="absolute left-4 top-4 w-64 glass-panel rounded-xl p-4 z-20"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-primary" />
        <h2 className="font-serif font-semibold text-foreground">Tu Progreso</h2>
      </div>
      
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-muted-foreground">Progreso general</span>
          <span className="font-medium text-foreground">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-2.5 rounded-lg bg-muted/50">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">Completado</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{completedItems.length}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-muted/50">
          <div className="flex items-center gap-1.5 mb-1">
            <AlertCircle className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-muted-foreground">Pendiente</span>
          </div>
          <p className="text-lg font-semibold text-foreground">{pendingTasks.length + learningItems.length}</p>
        </div>
      </div>
      
      {/* Most used areas */}
      <div className="pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Zonas más visitadas
          </span>
        </div>
        <ul className="space-y-1.5">
          {mostUsedFurniture.map(([key, stats], i) => (
            <li 
              key={key}
              className="flex items-center justify-between text-sm py-1"
            >
              <span className="text-foreground/80">
                {furnitureLabels[key] || key}
              </span>
              <span className="text-xs text-muted-foreground">
                {stats.interactions} visitas
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Quick pending tasks */}
      {pendingTasks.length > 0 && (
        <div className="pt-3 mt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Tareas urgentes
            </span>
          </div>
          <ul className="space-y-1">
            {pendingTasks.slice(0, 2).map((task) => (
              <li 
                key={task.id}
                className="text-sm text-foreground/80 py-1 px-2 rounded bg-accent/10"
              >
                {task.title}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};
