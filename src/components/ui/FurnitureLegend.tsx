import { motion } from 'framer-motion';
import { usePalaceStore, FurnitureType } from '@/store/palaceStore';

const legendItems: { id: FurnitureType; icon: string; label: string; color: string }[] = [
  { id: 'bed', icon: '🛏️', label: 'Fundamentos', color: 'bg-palace-bed' },
  { id: 'desk', icon: '📚', label: 'Práctica', color: 'bg-palace-desk' },
  { id: 'wardrobe', icon: '🧍', label: 'Módulos', color: 'bg-palace-wardrobe' },
  { id: 'nightstand', icon: '🌜', label: 'Pendientes', color: 'bg-palace-nightstand' },
  { id: 'shelf', icon: '🔖', label: 'Logros', color: 'bg-palace-shelf' },
  { id: 'chair', icon: '🪑', label: 'Evaluación', color: 'bg-palace-chair' },
];

export const FurnitureLegend = () => {
  const { selectedFurniture, setSelectedFurniture } = usePalaceStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20"
    >
      <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-1">
        {legendItems.map((item, i) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.05 }}
            onClick={() => setSelectedFurniture(selectedFurniture === item.id ? null : item.id)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all
              ${selectedFurniture === item.id 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted/50'
              }
            `}
          >
            <span>{item.icon}</span>
            <span className="hidden md:inline text-xs font-medium">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
