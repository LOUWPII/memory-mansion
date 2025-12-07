import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string | null;
}

interface PalaceHeaderProps {
  course: Course | null;
  onBack: () => void;
}

export function PalaceHeader({ course, onBack }: PalaceHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="bg-card/80 backdrop-blur-sm hover:bg-card"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <div>
                <h1 className="font-serif font-bold text-lg">
                  {course?.title || 'Cargando...'}
                </h1>
                {course?.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {course.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
