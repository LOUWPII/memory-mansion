import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, BookOpen, UserPlus } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string | null;
  room_type: string;
  professor_id: string;
}

export default function BrowseCourses() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, [user]);

  const fetchCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setCourses(data);
    setLoading(false);
  };

  const fetchEnrollments = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('student_id', user.id);
    
    if (data) {
      setEnrolledIds(new Set(data.map(e => e.course_id)));
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) return;
    
    setEnrolling(courseId);
    
    const { error } = await supabase
      .from('enrollments')
      .insert({
        student_id: user.id,
        course_id: courseId,
      });

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudo inscribir al curso',
        variant: 'destructive',
      });
    } else {
      toast({
        title: '¡Inscrito!',
        description: 'Te has inscrito al curso exitosamente',
      });
      setEnrolledIds(prev => new Set([...prev, courseId]));
      
      // Create mental palace for this course
      await supabase
        .from('mental_palaces')
        .insert({
          student_id: user.id,
          course_id: courseId,
          palace_config: {},
        });
    }
    
    setEnrolling(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-serif text-xl font-bold">Explorar Cursos</h1>
            <p className="text-sm text-muted-foreground">
              Encuentra cursos disponibles para ti
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Cargando cursos...
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay cursos disponibles en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              const isEnrolled = enrolledIds.has(course.id);
              
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-accent" />
                        </div>
                        <Badge variant="outline">{course.room_type}</Badge>
                      </div>
                      <CardTitle className="font-serif">{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {isEnrolled ? (
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => navigate(`/palace/${course.id}`)}
                        >
                          Ir al Palacio
                        </Button>
                      ) : (
                        <Button 
                          className="w-full"
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrolling === course.id}
                        >
                          {enrolling === course.id ? (
                            'Inscribiendo...'
                          ) : (
                            <>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Inscribirse
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
