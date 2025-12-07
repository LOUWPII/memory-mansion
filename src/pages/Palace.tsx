import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { Room } from '@/components/palace/Room';
import { Lighting } from '@/components/palace/Lighting';
import { ModuleFurniture } from '@/components/palace/ModuleFurniture';
import { PalaceHeader } from '@/components/palace/PalaceHeader';
import { StudyPlanOverview } from '@/components/palace/StudyPlanOverview';
import { ModuleTasksPanel } from '@/components/palace/ModuleTasksPanel';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  techniques: any;
  tasks: any;
  learning_style: string | null;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
}

export default function Palace() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [studyPlans, setStudyPlans] = useState<any[]>([]);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [palaceId, setPalaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user && courseId) {
      fetchCourseData();
    }
  }, [user, courseId, authLoading]);

  const fetchCourseData = async () => {
    if (!courseId || !user) return;
    
    try {
      // Fetch course
      const { data: courseData } = await supabase
        .from('courses')
        .select('id, title, description')
        .eq('id', courseId)
        .single();
      
      if (courseData) setCourse(courseData);

      // Fetch modules
      const { data: modulesData } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index');
      
      if (modulesData) setModules(modulesData);

      // Fetch or create mental palace
      let { data: palace } = await supabase
        .from('mental_palaces')
        .select('id')
        .eq('course_id', courseId)
        .eq('student_id', user.id)
        .single();

      if (!palace) {
        const { data: newPalace } = await supabase
          .from('mental_palaces')
          .insert({ course_id: courseId, student_id: user.id, palace_config: {} })
          .select('id')
          .single();
        palace = newPalace;
      }

      if (palace) {
        setPalaceId(palace.id);
        
        // Fetch existing study plans
        const { data: plans } = await supabase
          .from('study_plans')
          .select('*')
          .eq('palace_id', palace.id);
        
        if (plans) setStudyPlans(plans);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateStudyPlan = async () => {
    if (!palaceId || !profile?.learning_style || modules.length === 0) {
      toast({
        title: "Error",
        description: "No se puede generar el plan de estudio. Verifica que hayas completado el test VARK.",
        variant: "destructive"
      });
      return;
    }

    setGeneratingPlan(true);
    
    try {
      const allPlans: StudyPlan[] = [];
      
      for (const module of modules) {
        // Check if plan already exists
        const existingPlan = studyPlans.find(p => p.module_id === module.id);
        if (existingPlan) {
          allPlans.push(existingPlan);
          continue;
        }

        // Generate plan via edge function
        const { data, error } = await supabase.functions.invoke('generate-study-plan', {
          body: {
            moduleContent: module.content || module.description || module.title,
            learningStyle: profile.learning_style,
            moduleTitle: module.title
          }
        });

        if (error) throw error;

        const studyPlan = data.studyPlan;
        
        // Save to database
        const { data: savedPlan, error: saveError } = await supabase
          .from('study_plans')
          .insert({
            palace_id: palaceId,
            module_id: module.id,
            learning_style: profile.learning_style,
            techniques: studyPlan.techniques || [],
            tasks: studyPlan.tasks || []
          })
          .select()
          .single();

        if (saveError) throw saveError;
        if (savedPlan) allPlans.push(savedPlan);
      }

      setStudyPlans(allPlans);
      toast({
        title: "Plan generado",
        description: "Tu plan de estudio personalizado ha sido creado."
      });
    } catch (error) {
      console.error('Error generating study plan:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el plan de estudio. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setGeneratingPlan(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const selectedModulePlan = selectedModule 
    ? studyPlans.find(p => p.module_id === selectedModule.id)
    : null;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background">
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas shadows>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
            <OrbitControls
              enablePan={false}
              minDistance={5}
              maxDistance={15}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.2}
              target={[0, 1.5, 0]}
            />
            <fog attach="fog" args={['#f5f0e8', 10, 25]} />
            <Lighting />
            <Room />
            <ModuleFurniture 
              modules={modules} 
              studyPlans={studyPlans}
              onSelectModule={(m) => setSelectedModule(m)}
              selectedModule={selectedModule}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlays */}
      <PalaceHeader 
        course={course} 
        onBack={() => navigate('/')} 
      />

      {/* Study Plan Overview - Left Side */}
      <StudyPlanOverview
        modules={modules}
        studyPlans={studyPlans}
        learningStyle={profile?.learning_style}
        onGeneratePlan={generateStudyPlan}
        generatingPlan={generatingPlan}
        onSelectModule={(m) => setSelectedModule(m)}
      />

      {/* Module Tasks Panel - Right Side */}
      {selectedModule && (
        <ModuleTasksPanel
          module={selectedModule}
          studyPlan={selectedModulePlan}
          onClose={() => setSelectedModule(null)}
        />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/60 to-transparent pointer-events-none z-10" />
    </div>
  );
}
