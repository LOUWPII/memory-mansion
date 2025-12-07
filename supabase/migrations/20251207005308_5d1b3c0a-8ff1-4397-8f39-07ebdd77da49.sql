-- Roles de usuario
CREATE TYPE public.app_role AS ENUM ('student', 'professor');
CREATE TYPE public.learning_style AS ENUM ('visual', 'auditory', 'reading', 'kinesthetic');

-- Tabla de roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Función para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Perfiles de usuarios
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  learning_style learning_style,
  vark_visual INTEGER DEFAULT 0,
  vark_auditory INTEGER DEFAULT 0,
  vark_reading INTEGER DEFAULT 0,
  vark_kinesthetic INTEGER DEFAULT 0,
  test_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Trigger para crear perfil automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Cursos
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  syllabus_url TEXT,
  content_urls TEXT[],
  room_type TEXT DEFAULT 'bedroom',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Módulos del curso
CREATE TABLE public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

-- Inscripciones de estudiantes
CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, course_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- Palacios mentales de estudiantes
CREATE TABLE public.mental_palaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  palace_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (student_id, course_id)
);

ALTER TABLE public.mental_palaces ENABLE ROW LEVEL SECURITY;

-- Elementos del palacio (muebles) asociados a módulos
CREATE TABLE public.palace_elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  palace_id UUID REFERENCES public.mental_palaces(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  element_type TEXT NOT NULL,
  position JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.palace_elements ENABLE ROW LEVEL SECURITY;

-- Planes de estudio generados por IA
CREATE TABLE public.study_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  palace_id UUID REFERENCES public.mental_palaces(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  techniques JSONB DEFAULT '[]',
  tasks JSONB DEFAULT '[]',
  learning_style learning_style,
  generated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;

-- Progreso del estudiante
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  UNIQUE (student_id, module_id)
);

ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- User Roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Courses
CREATE POLICY "Anyone can view courses"
  ON public.courses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Professors can create courses"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'professor') AND auth.uid() = professor_id);

CREATE POLICY "Professors can update own courses"
  ON public.courses FOR UPDATE
  USING (auth.uid() = professor_id);

CREATE POLICY "Professors can delete own courses"
  ON public.courses FOR DELETE
  USING (auth.uid() = professor_id);

-- Course Modules
CREATE POLICY "Anyone can view modules"
  ON public.course_modules FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Professors can manage modules"
  ON public.course_modules FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_modules.course_id
      AND professor_id = auth.uid()
    )
  );

-- Enrollments
CREATE POLICY "Students can view own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can enroll"
  ON public.enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Professors can view course enrollments"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = enrollments.course_id
      AND professor_id = auth.uid()
    )
  );

-- Mental Palaces
CREATE POLICY "Students can view own palaces"
  ON public.mental_palaces FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can create own palaces"
  ON public.mental_palaces FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own palaces"
  ON public.mental_palaces FOR UPDATE
  USING (auth.uid() = student_id);

-- Palace Elements
CREATE POLICY "Students can manage own palace elements"
  ON public.palace_elements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.mental_palaces
      WHERE id = palace_elements.palace_id
      AND student_id = auth.uid()
    )
  );

-- Study Plans
CREATE POLICY "Students can view own study plans"
  ON public.study_plans FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.mental_palaces
      WHERE id = study_plans.palace_id
      AND student_id = auth.uid()
    )
  );

-- Student Progress
CREATE POLICY "Students can manage own progress"
  ON public.student_progress FOR ALL
  USING (auth.uid() = student_id);

CREATE POLICY "Professors can view student progress"
  ON public.student_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.course_modules cm
      JOIN public.courses c ON c.id = cm.course_id
      WHERE cm.id = student_progress.module_id
      AND c.professor_id = auth.uid()
    )
  );