-- Create function to create demo course for first professor
CREATE OR REPLACE FUNCTION public.create_demo_course_for_professor()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  course_exists boolean;
BEGIN
  -- Check if user is a professor
  IF EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id AND role = 'professor'
  ) THEN
    -- Check if demo course already exists for any professor
    SELECT EXISTS (SELECT 1 FROM public.courses WHERE title = 'Introducción a la Programación') INTO course_exists;
    
    IF NOT course_exists THEN
      -- Create demo course
      INSERT INTO public.courses (id, title, description, room_type, professor_id)
      VALUES (
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        'Introducción a la Programación',
        'Aprende los fundamentos de la programación con Python. Desde variables hasta estructuras de datos.',
        'bedroom',
        NEW.user_id
      );
      
      -- Create demo modules
      INSERT INTO public.course_modules (id, course_id, title, description, content, order_index) VALUES
      ('m1111111-1111-1111-1111-111111111111', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Variables y Tipos de Datos', 'Comprende qué son las variables y los diferentes tipos de datos en Python', 'Las variables son contenedores para almacenar valores. En Python tenemos tipos como: int (números enteros), float (decimales), str (cadenas de texto), bool (verdadero/falso). Para declarar una variable simplemente escribimos: nombre = valor. Python es un lenguaje de tipado dinámico.', 1),
      ('m2222222-2222-2222-2222-222222222222', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Funciones', 'Aprende a crear y usar funciones para organizar tu código', 'Las funciones son bloques de código reutilizables. Se definen con la palabra clave def seguida del nombre y parámetros. Las funciones pueden retornar valores usando return.', 2),
      ('m3333333-3333-3333-3333-333333333333', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Bucles y Estructuras de Control', 'Domina los bucles for, while y las estructuras condicionales if/else', 'Los bucles permiten repetir acciones. for se usa para iterar sobre secuencias. while repite mientras una condición sea verdadera. Las estructuras condicionales if/elif/else permiten tomar decisiones.', 3),
      ('m4444444-4444-4444-4444-444444444444', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Listas y Diccionarios', 'Trabaja con estructuras de datos fundamentales en Python', 'Las listas son colecciones ordenadas: mi_lista = [1, 2, 3]. Los diccionarios son pares clave-valor: mi_dict = {"nombre": "Juan"}. Ambos son mutables y fundamentales.', 4);
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for professor demo course
DROP TRIGGER IF EXISTS on_professor_profile_created ON public.profiles;
CREATE TRIGGER on_professor_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_demo_course_for_professor();

-- Create function to auto-enroll student in demo course when they complete test
CREATE OR REPLACE FUNCTION public.auto_enroll_demo_student()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  demo_course_id uuid;
BEGIN
  -- If test was just completed and user is a student
  IF NEW.test_completed = true THEN
    -- Check if student role exists
    IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id AND role = 'student') THEN
      -- Get demo course if exists
      SELECT id INTO demo_course_id FROM public.courses WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      
      IF demo_course_id IS NOT NULL THEN
        -- Check if not already enrolled
        IF NOT EXISTS (SELECT 1 FROM public.enrollments WHERE student_id = NEW.user_id AND course_id = demo_course_id) THEN
          -- Enroll student
          INSERT INTO public.enrollments (student_id, course_id)
          VALUES (NEW.user_id, demo_course_id);
          
          -- Create mental palace
          INSERT INTO public.mental_palaces (student_id, course_id, palace_config)
          VALUES (NEW.user_id, demo_course_id, '{}'::jsonb);
        END IF;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for student auto-enrollment
DROP TRIGGER IF EXISTS on_student_test_completed ON public.profiles;
CREATE TRIGGER on_student_test_completed
  AFTER UPDATE OF test_completed ON public.profiles
  FOR EACH ROW
  WHEN (NEW.test_completed = true AND (OLD.test_completed = false OR OLD.test_completed IS NULL))
  EXECUTE FUNCTION public.auto_enroll_demo_student();