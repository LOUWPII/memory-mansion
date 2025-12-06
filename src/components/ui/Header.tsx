import { motion } from 'framer-motion';
import { Brain, Settings, HelpCircle } from 'lucide-react';

export const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-0 left-0 right-0 z-30 p-4"
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 backdrop-blur-sm">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold text-foreground">
              Palacio Mental
            </h1>
            <p className="text-xs text-muted-foreground">
              Tu espacio de aprendizaje 3D
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-lg glass-panel hover:bg-muted/50 transition-colors">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2.5 rounded-lg glass-panel hover:bg-muted/50 transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </motion.header>
  );
};
