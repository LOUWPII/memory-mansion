import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, BookOpen, Eye, Ear, Hand, Loader2, CheckCircle2 } from 'lucide-react';

interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  content?: string | null;
  order_index: number;
}

interface StudyPlan {
  id: string;
  module_id: string;
  techniques: any[];
  tasks: any[];
}

interface StudyPlanOverviewProps {
  modules: CourseModule[];
  studyPlans: StudyPlan[];
  learningStyle: string | null | undefined;
  onGeneratePlan: () => void;
  generatingPlan: boolean;
  onSelectModule: (module: CourseModule) => void;
}

const learningStyleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  visual: Eye,
  auditory: Ear,
  reading: BookOpen,
  kinesthetic: Hand,
};

const learningStyleLabels: Record<string, string> = {
  visual: 'Visual',
  auditory: 'Auditivo',
  reading: 'Lectura',
  kinesthetic: 'Kinestésico',
};

export function StudyPlanOverview({
  modules,
  studyPlans,
  learningStyle,
  onGeneratePlan,
  generatingPlan,
  onSelectModule
}: StudyPlanOverviewProps) {
  const hasPlans = studyPlans.length > 0;
  const LearningIcon = learningStyle ? learningStyleIcons[learningStyle] : BookOpen;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="absolute left-4 top-24 bottom-36 w-80 z-20 overflow-hidden"
    >
      <Card className="h-full bg-card/90 backdrop-blur-sm border-border/50 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Plan de Estudio
            </CardTitle>
            {learningStyle && (
              <Badge variant="outline" className="gap-1">
                <LearningIcon className="w-3 h-3" />
                {learningStyleLabels[learningStyle]}
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-auto space-y-3">
          {!hasPlans ? (
            <div className="text-center py-6">
              <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Genera tu plan de estudio personalizado basado en tu estilo de aprendizaje
              </p>
              <Button 
                onClick={onGeneratePlan} 
                disabled={generatingPlan}
                className="w-full"
              >
                {generatingPlan ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generar Plan con IA
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground mb-3">
                Haz clic en un módulo o en su mueble correspondiente para ver las tareas
              </p>
              
              {modules.map((module, index) => {
                const plan = studyPlans.find(p => p.module_id === module.id);
                const hasPlan = !!plan;
                const taskCount = plan?.tasks?.length || 0;
                
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => onSelectModule(module)}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                          ${hasPlan ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}
                        `}>
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {module.title}
                          </h4>
                          {module.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {module.description}
                            </p>
                          )}
                          {hasPlan && (
                            <div className="flex items-center gap-2 mt-1">
                              <CheckCircle2 className="w-3 h-3 text-primary" />
                              <span className="text-xs text-primary">
                                {taskCount} tareas
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
