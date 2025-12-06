import { motion, AnimatePresence } from 'framer-motion';
import { usePalaceStore } from '@/store/palaceStore';
import { MessageCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const AssistantPanel = () => {
  const { isAssistantOpen, assistantMessage, toggleAssistant } = usePalaceStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-20"
    >
      <div className="glass-panel rounded-xl overflow-hidden">
        <button
          onClick={toggleAssistant}
          className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium text-sm">Asistente del Palacio</span>
          </div>
          {isAssistantOpen ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        
        <AnimatePresence>
          {isAssistantOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <div className="p-3 rounded-lg bg-muted/50 border border-border/30">
                  <div className="flex items-start gap-2">
                    <MessageCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {assistantMessage}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  {['¿Qué debo estudiar?', 'Ver progreso', 'Recomendaciones'].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
