import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, Upload, BookOpen, Users, Eye, Ear, Hand, 
  FileText, Loader2, CheckCircle2, Trash2 
} from 'lucide-react';

interface CourseModule {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
}

interface StudentEnrollment {
  id: string;
  student_id: string;
  enrolled_at: string;
  profiles: {
    full_name: string | null;
    learning_style: string | null;
  };
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  syllabus_url: string | null;
  content_urls: string[] | null;
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

export default function CourseManage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, isProfessor, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [students, setStudents] = useState<StudentEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isProfessor)) {
      navigate('/');
      return;
    }
    
    if (user && courseId) {
      fetchCourseData();
    }
  }, [user, courseId, authLoading, isProfessor]);

  const fetchCourseData = async () => {
    if (!courseId || !user) return;
    
    try {
      // Fetch course
      const { data: courseData } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .eq('professor_id', user.id)
        .single();
      
      if (!courseData) {
        navigate('/');
        return;
      }
      
      setCourse(courseData);

      // Fetch modules
      const { data: modulesData } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (modulesData) setModules(modulesData);

      // Fetch enrolled students with their profiles
      const { data: enrollmentsData } = await supabase
        .from('enrollments')
        .select(`
          id,
          student_id,
          enrolled_at,
          profiles!enrollments_student_id_fkey (
            full_name,
            learning_style
          )
        `)
        .eq('course_id', courseId);
      
      // Handle potential null profiles
      if (enrollmentsData) {
        const formattedStudents = enrollmentsData.map(e => ({
          ...e,
          profiles: e.profiles || { full_name: null, learning_style: null }
        })) as unknown as StudentEnrollment[];
        setStudents(formattedStudents);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'syllabus' | 'content') => {
    const files = e.target.files;
    if (!files || files.length === 0 || !courseId) return;

    setUploading(true);
    
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${courseId}/${type}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('course-content')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('course-content')
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
      }

      // Update course with new URLs
      if (type === 'syllabus') {
        await supabase
          .from('courses')
          .update({ syllabus_url: uploadedUrls[0] })
          .eq('id', courseId);
      } else {
        const currentUrls = course?.content_urls || [];
        await supabase
          .from('courses')
          .update({ content_urls: [...currentUrls, ...uploadedUrls] })
          .eq('id', courseId);
      }

      await fetchCourseData();
      
      toast({
        title: "Archivo subido",
        description: `${files.length} archivo(s) subido(s) correctamente.`
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el archivo.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-serif text-xl font-bold">{course?.title}</h1>
            <p className="text-sm text-muted-foreground">Gestión del curso</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Content Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Contenido del Curso
              </CardTitle>
              <CardDescription>
                Sube el syllabus y materiales adicionales para que la IA genere planes de estudio personalizados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Syllabus */}
              <div className="space-y-2">
                <Label>Syllabus</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => handleFileUpload(e, 'syllabus')}
                    disabled={uploading}
                    className="max-w-xs"
                  />
                  {course?.syllabus_url && (
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle2 className="w-3 h-3 text-primary" />
                      Syllabus cargado
                    </Badge>
                  )}
                </div>
              </div>

              {/* Additional Content */}
              <div className="space-y-2">
                <Label>Materiales Adicionales</Label>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                  multiple
                  onChange={(e) => handleFileUpload(e, 'content')}
                  disabled={uploading}
                  className="max-w-xs"
                />
                {uploading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Subiendo...
                  </div>
                )}
                {course?.content_urls && course.content_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.content_urls.map((url, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        <FileText className="w-3 h-3" />
                        Archivo {index + 1}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Modules Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Módulos del Curso
              </CardTitle>
              <CardDescription>
                {modules.length} módulos en este curso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{module.title}</h4>
                      {module.description && (
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Students Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Estudiantes Inscritos
              </CardTitle>
              <CardDescription>
                {students.length} estudiantes en este curso
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aún no hay estudiantes inscritos en este curso
                </p>
              ) : (
                <div className="space-y-3">
                  {students.map((student) => {
                    const learningStyle = student.profiles?.learning_style;
                    const StyleIcon = learningStyle ? learningStyleIcons[learningStyle] : null;
                    
                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {student.profiles?.full_name || 'Estudiante'}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              Inscrito el {new Date(student.enrolled_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {learningStyle && StyleIcon && (
                          <Badge variant="outline" className="gap-1">
                            <StyleIcon className="w-3 h-3" />
                            {learningStyleLabels[learningStyle]}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
