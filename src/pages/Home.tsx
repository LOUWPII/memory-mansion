import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import HouseMap2D from '@/components/HouseMap2D';
import { Brain, BookOpen, Plus, Users, LogOut, Eye, Ear, Hand, Home as HomeIcon } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string | null;
  room_type: string;
  professor_id: string;
}

interface Enrollment {
  id: string;
  course_id: string;
  courses: Course;
}

const learningStyleIcons = {
  visual: Eye,
  auditory: Ear,
  reading: BookOpen,
  kinesthetic: Hand,
};

const learningStyleLabels = {
  visual: 'Visual',
  auditory: 'Auditivo',
  reading: 'Lectura',
  kinesthetic: 'Kinestésico',
};

export default function Home() {
  const navigate = useNavigate();
  const { user, profile, signOut, isProfessor, loading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (!loading && user && profile && !profile.test_completed && !isProfessor) {
      navigate('/vark-test');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, profile, loading, navigate, isProfessor]);

  const fetchData = async () => {
    setLoadingCourses(true);

    if (isProfessor) {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('professor_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (data) setCourses(data);
    } else {
      const { data } = await supabase
        .from('enrollments')
        .select(`
          id,
          course_id,
          courses (
            id,
            title,
            description,
            room_type,
            professor_id
          )
        `)
        .eq('student_id', user?.id);
      
      if (data) {
        setEnrollments(data as unknown as Enrollment[]);
      }
    }

    setLoadingCourses(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  const LearningStyleIcon = profile?.learning_style 
    ? learningStyleIcons[profile.learning_style]
    : Brain;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold">Palacio Mental</h1>
              <p className="text-sm text-muted-foreground">
                Hola, {profile?.full_name || 'Usuario'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="gap-2">
              {isProfessor ? (
                <>
                  <BookOpen className="w-3 h-3" />
                  Profesor
                </>
              ) : (
                profile?.learning_style && (
                  <>
                    <LearningStyleIcon className="w-3 h-3" />
                    {learningStyleLabels[profile.learning_style]}
                  </>
                )
              )}
            </Badge>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="font-serif text-3xl font-bold mb-2">
            {isProfessor ? 'Tus Cursos' : 'Tu Casa de Aprendizaje'}
          </h2>
          <p className="text-muted-foreground">
            {isProfessor 
              ? 'Gestiona tus cursos y contenido educativo'
              : 'Cada habitación representa un curso. Entra para explorar tu palacio mental.'
            }
          </p>
        </motion.div>

        {/* Student 2D House Map */}
        {!isProfessor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <HomeIcon className="w-5 h-5 text-primary" />
              <h3 className="font-serif text-xl font-semibold">Mapa de tu Casa</h3>
            </div>
            <HouseMap2D enrollments={enrollments} />
          </motion.div>
        )}

        {/* Actions & Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create Course / Browse Courses Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center p-6">
                {isProfessor ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Plus className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold mb-2">Crear Nuevo Curso</h3>
                    <p className="text-sm text-muted-foreground">
                      Agrega contenido y módulos para tus estudiantes
                    </p>
                    <Button className="mt-4" onClick={() => navigate('/create-course')}>
                      Crear Curso
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold mb-2">Explorar Cursos</h3>
                    <p className="text-sm text-muted-foreground">
                      Inscríbete en nuevos cursos disponibles
                    </p>
                    <Button className="mt-4" onClick={() => navigate('/browse-courses')}>
                      Ver Cursos
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Professor Course Cards */}
          {isProfessor && courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * (index + 2) }}
            >
              <Card 
                className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/course/${course.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <Badge variant="outline">{course.room_type}</Badge>
                  </div>
                  <CardTitle className="font-serif">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State for Professor */}
        {!loadingCourses && isProfessor && courses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground">
              Aún no has creado ningún curso. ¡Crea tu primer curso!
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
