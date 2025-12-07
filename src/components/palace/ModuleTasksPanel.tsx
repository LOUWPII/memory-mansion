import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Play, Clock, Lightbulb, BookOpen, Brain, PenTool } from 'lucide-react';

interface CourseModule {
  id: string;
  title: string;
  description: string | null;
}

interface Task {
  title: string;
  description: string;
  priority: string;
  type: string;
}

interface Technique {
  name: string;
  description: string;
  steps: string[];
  estimatedTime: string;
}

interface StudyPlan {
  id: string;
  module_id: string;
  techniques: Technique[];
  tasks: Task[];
}

interface ModuleTasksPanelProps {
  module: CourseModule;
  studyPlan: StudyPlan | null | undefined;
  onClose: () => void;
}

const taskTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  practice: PenTool,
  review: BookOpen,
  create: Lightbulb,
  memorize: Brain,
};

const priorityColors: Record<string, string> = {
  high: 'bg-destructive/10 text-destructive border-destructive/30',
  medium: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  low: 'bg-primary/10 text-primary border-primary/30',
};

export function ModuleTasksPanel({ module, studyPlan, onClose }: ModuleTasksPanelProps) {
  const techniques = studyPlan?.techniques || [];
  const tasks = studyPlan?.tasks || [];

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100, opacity: 0 }}
      className="absolute right-4 top-24 bottom-36 w-96 z-20 overflow-hidden"
    >
      <Card className="h-full bg-card/90 backdrop-blur-sm border-border/50 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-lg truncate pr-2">
              {module.title}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {module.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {module.description}
            </p>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 overflow-auto space-y-4">
          {!studyPlan ? (
            <div className="text-center py-8">
              <Brain className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">
                Genera el plan de estudio para ver las tareas de este módulo
              </p>
            </div>
          ) : (
            <>
              {/* Techniques Section */}
              {techniques.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    Técnicas Recomendadas
                  </h4>
                  <div className="space-y-2">
                    {techniques.map((technique, index) => (
                      <div 
                        key={index}
                        className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{technique.name}</span>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {technique.estimatedTime}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {technique.description}
                        </p>
                        {technique.steps && technique.steps.length > 0 && (
                          <ol className="text-xs text-muted-foreground space-y-1">
                            {technique.steps.slice(0, 3).map((step, i) => (
                              <li key={i} className="flex gap-2">
                                <span className="text-primary font-medium">{i + 1}.</span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks Section */}
              {tasks.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <PenTool className="w-4 h-4 text-primary" />
                    Tareas del Módulo
                  </h4>
                  <div className="space-y-2">
                    {tasks.map((task, index) => {
                      const TaskIcon = taskTypeIcons[task.type] || BookOpen;
                      const priorityClass = priorityColors[task.priority] || priorityColors.medium;
                      
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-3 rounded-lg border border-border hover:border-primary/50 transition-all group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <TaskIcon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm truncate">
                                  {task.title}
                                </span>
                                <Badge variant="outline" className={`text-xs ${priorityClass}`}>
                                  {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {task.description}
                              </p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Comenzar
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {techniques.length === 0 && tasks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No hay tareas para este módulo aún
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
