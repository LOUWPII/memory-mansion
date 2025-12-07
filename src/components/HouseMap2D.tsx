import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, BookOpen, Bed, FlaskConical, Library } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string | null;
  room_type: string;
}

interface Enrollment {
  id: string;
  course_id: string;
  courses: Course;
}

interface HouseMap2DProps {
  enrollments: Enrollment[];
}

const roomIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  bedroom: Bed,
  study: BookOpen,
  library: Library,
  lab: FlaskConical,
};

const roomColors: Record<string, string> = {
  bedroom: 'from-purple-500/20 to-purple-600/30',
  study: 'from-blue-500/20 to-blue-600/30',
  library: 'from-amber-500/20 to-amber-600/30',
  lab: 'from-green-500/20 to-green-600/30',
};

const roomPositions = [
  { top: '10%', left: '5%', width: '40%', height: '35%' },
  { top: '10%', left: '55%', width: '40%', height: '35%' },
  { top: '55%', left: '5%', width: '40%', height: '40%' },
  { top: '55%', left: '55%', width: '40%', height: '40%' },
  { top: '32%', left: '30%', width: '40%', height: '30%' },
  { top: '5%', left: '30%', width: '40%', height: '25%' },
];

export default function HouseMap2D({ enrollments }: HouseMap2DProps) {
  const navigate = useNavigate();

  if (enrollments.length === 0) {
    return (
      <div className="relative w-full aspect-[4/3] bg-card/50 rounded-2xl border border-border overflow-hidden flex items-center justify-center">
        <div className="text-center text-muted-foreground p-8">
          <Brain className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Tu casa está vacía</p>
          <p className="text-sm">Inscríbete en cursos para agregar habitaciones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[4/3] bg-card/50 rounded-2xl border border-border overflow-hidden">
      {/* House floor */}
      <div className="absolute inset-4 bg-secondary/20 rounded-xl border-2 border-dashed border-border/50">
        {/* House outline */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-transparent" />
        
        {/* Rooms */}
        {enrollments.slice(0, 6).map((enrollment, index) => {
          const position = roomPositions[index];
          const roomType = enrollment.courses.room_type || 'bedroom';
          const RoomIcon = roomIcons[roomType] || Bed;
          const colorClass = roomColors[roomType] || roomColors.bedroom;

          return (
            <motion.div
              key={enrollment.id}
              className={`absolute cursor-pointer group`}
              style={position}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/palace/${enrollment.course_id}`)}
            >
              <div 
                className={`
                  w-full h-full rounded-lg border-2 border-border
                  bg-gradient-to-br ${colorClass}
                  hover:border-primary hover:shadow-lg hover:shadow-primary/20
                  transition-all duration-300 group-hover:scale-[1.02]
                  flex flex-col items-center justify-center p-3
                  backdrop-blur-sm
                `}
              >
                <RoomIcon className="w-8 h-8 text-foreground/70 mb-2 group-hover:text-primary transition-colors" />
                <span className="text-xs sm:text-sm font-medium text-center text-foreground/80 line-clamp-2 group-hover:text-foreground transition-colors">
                  {enrollment.courses.title}
                </span>
                
                {/* Door indicator */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-primary/40 rounded-t-sm group-hover:bg-primary transition-colors" />
              </div>
            </motion.div>
          );
        })}

        {/* Center hallway */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
          <Brain className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        Click en una habitación para entrar
      </div>
    </div>
  );
}
