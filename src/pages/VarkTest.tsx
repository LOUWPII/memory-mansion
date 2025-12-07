import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Brain, Eye, Ear, BookOpen, Hand, ChevronRight, ChevronLeft } from 'lucide-react';

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    type: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  }[];
}

const varkQuestions: Question[] = [
  {
    id: 1,
    text: "Cuando estás aprendiendo algo nuevo, prefieres:",
    options: [
      { text: "Ver diagramas, gráficos o videos", type: "visual" },
      { text: "Escuchar explicaciones o podcasts", type: "auditory" },
      { text: "Leer instrucciones escritas", type: "reading" },
      { text: "Practicar y experimentar directamente", type: "kinesthetic" },
    ]
  },
  {
    id: 2,
    text: "Para recordar un número de teléfono, tú:",
    options: [
      { text: "Visualizas los números en tu mente", type: "visual" },
      { text: "Lo repites en voz alta varias veces", type: "auditory" },
      { text: "Lo escribes varias veces", type: "reading" },
      { text: "Marcas el número en el aire con tu dedo", type: "kinesthetic" },
    ]
  },
  {
    id: 3,
    text: "En una clase, aprendes mejor cuando:",
    options: [
      { text: "El profesor usa presentaciones visuales", type: "visual" },
      { text: "El profesor explica verbalmente", type: "auditory" },
      { text: "Puedes tomar notas detalladas", type: "reading" },
      { text: "Hay actividades prácticas o laboratorios", type: "kinesthetic" },
    ]
  },
  {
    id: 4,
    text: "Cuando das direcciones a alguien, prefieres:",
    options: [
      { text: "Dibujar un mapa o usar gestos", type: "visual" },
      { text: "Explicar verbalmente paso a paso", type: "auditory" },
      { text: "Escribir las instrucciones", type: "reading" },
      { text: "Acompañar a la persona o simular el recorrido", type: "kinesthetic" },
    ]
  },
  {
    id: 5,
    text: "Cuando estudias para un examen, prefieres:",
    options: [
      { text: "Hacer mapas mentales o esquemas coloridos", type: "visual" },
      { text: "Grabarte explicando el tema y escucharlo", type: "auditory" },
      { text: "Releer tus notas y el libro de texto", type: "reading" },
      { text: "Hacer ejercicios prácticos y casos", type: "kinesthetic" },
    ]
  },
  {
    id: 6,
    text: "Tu forma favorita de entretenimiento es:",
    options: [
      { text: "Ver películas o fotografía", type: "visual" },
      { text: "Escuchar música o podcasts", type: "auditory" },
      { text: "Leer libros o artículos", type: "reading" },
      { text: "Hacer deportes o manualidades", type: "kinesthetic" },
    ]
  },
  {
    id: 7,
    text: "Cuando armas un mueble nuevo, tú:",
    options: [
      { text: "Miras las imágenes del manual", type: "visual" },
      { text: "Prefieres que alguien te explique cómo hacerlo", type: "auditory" },
      { text: "Lees las instrucciones paso a paso", type: "reading" },
      { text: "Empiezas a armarlo y vas probando", type: "kinesthetic" },
    ]
  },
  {
    id: 8,
    text: "Recuerdas mejor a las personas por:",
    options: [
      { text: "Su cara y apariencia", type: "visual" },
      { text: "Su voz y lo que dijeron", type: "auditory" },
      { text: "Su nombre escrito", type: "reading" },
      { text: "Lo que hicieron juntos", type: "kinesthetic" },
    ]
  },
  {
    id: 9,
    text: "En una reunión de trabajo, prefieres:",
    options: [
      { text: "Presentaciones con gráficos y diagramas", type: "visual" },
      { text: "Discusiones verbales abiertas", type: "auditory" },
      { text: "Documentos escritos para revisar", type: "reading" },
      { text: "Ejercicios de role-play o simulaciones", type: "kinesthetic" },
    ]
  },
  {
    id: 10,
    text: "Cuando tienes un problema, lo resuelves:",
    options: [
      { text: "Visualizando posibles soluciones", type: "visual" },
      { text: "Hablándolo con alguien", type: "auditory" },
      { text: "Escribiendo pros y contras", type: "reading" },
      { text: "Probando diferentes enfoques", type: "kinesthetic" },
    ]
  },
  {
    id: 11,
    text: "Tu espacio de estudio ideal tiene:",
    options: [
      { text: "Buena iluminación y organización visual", type: "visual" },
      { text: "Música de fondo o ambiente tranquilo", type: "auditory" },
      { text: "Muchos libros y materiales de lectura", type: "reading" },
      { text: "Espacio para moverte y materiales táctiles", type: "kinesthetic" },
    ]
  },
  {
    id: 12,
    text: "Cuando cocinas una receta nueva, prefieres:",
    options: [
      { text: "Ver un video de cómo prepararla", type: "visual" },
      { text: "Que alguien te guíe verbalmente", type: "auditory" },
      { text: "Seguir la receta escrita paso a paso", type: "reading" },
      { text: "Improvisar y probar mientras cocinas", type: "kinesthetic" },
    ]
  },
  {
    id: 13,
    text: "Para concentrarte mejor, necesitas:",
    options: [
      { text: "Un ambiente visualmente ordenado", type: "visual" },
      { text: "Silencio o música específica", type: "auditory" },
      { text: "Tener todo escrito y organizado", type: "reading" },
      { text: "Poder moverte o hacer pausas activas", type: "kinesthetic" },
    ]
  },
  {
    id: 14,
    text: "Aprendes un idioma nuevo mejor:",
    options: [
      { text: "Viendo películas con subtítulos", type: "visual" },
      { text: "Escuchando conversaciones y canciones", type: "auditory" },
      { text: "Leyendo textos y estudiando gramática", type: "reading" },
      { text: "Practicando conversaciones reales", type: "kinesthetic" },
    ]
  },
  {
    id: 15,
    text: "En tu tiempo libre, disfrutas más:",
    options: [
      { text: "Visitar museos o galerías", type: "visual" },
      { text: "Ir a conciertos o charlas", type: "auditory" },
      { text: "Leer o escribir", type: "reading" },
      { text: "Hacer actividades al aire libre", type: "kinesthetic" },
    ]
  },
  {
    id: 16,
    text: "Cuando explicas algo a otros, usas:",
    options: [
      { text: "Dibujos, esquemas o gestos descriptivos", type: "visual" },
      { text: "Explicaciones verbales detalladas", type: "auditory" },
      { text: "Ejemplos escritos o referencias", type: "reading" },
      { text: "Demostraciones prácticas", type: "kinesthetic" },
    ]
  },
];

const typeIcons = {
  visual: Eye,
  auditory: Ear,
  reading: BookOpen,
  kinesthetic: Hand,
};

const typeLabels = {
  visual: 'Visual',
  auditory: 'Auditivo',
  reading: 'Lectura/Escritura',
  kinesthetic: 'Kinestésico',
};

const typeDescriptions = {
  visual: 'Aprendes mejor con imágenes, diagramas, mapas mentales y representaciones visuales.',
  auditory: 'Aprendes mejor escuchando explicaciones, discusiones y contenido de audio.',
  reading: 'Aprendes mejor leyendo textos, tomando notas y escribiendo resúmenes.',
  kinesthetic: 'Aprendes mejor practicando, experimentando y con actividades hands-on.',
};

export default function VarkTest() {
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, 'visual' | 'auditory' | 'reading' | 'kinesthetic'>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<{ visual: number; auditory: number; reading: number; kinesthetic: number } | null>(null);

  const progress = ((Object.keys(answers).length) / varkQuestions.length) * 100;

  const handleAnswer = (type: 'visual' | 'auditory' | 'reading' | 'kinesthetic') => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: type }));
    
    if (currentQuestion < varkQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    }
  };

  const calculateResults = () => {
    const scores = { visual: 0, auditory: 0, reading: 0, kinesthetic: 0 };
    
    Object.values(answers).forEach(type => {
      scores[type]++;
    });
    
    return scores;
  };

  const getDominantStyle = (scores: typeof results) => {
    if (!scores) return 'visual';
    
    return Object.entries(scores).reduce((a, b) => 
      scores[a[0] as keyof typeof scores] > scores[b[0] as keyof typeof scores] ? a : b
    )[0] as keyof typeof scores;
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < varkQuestions.length) {
      toast({
        title: 'Test incompleto',
        description: 'Por favor responde todas las preguntas',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const scores = calculateResults();
    setResults(scores);

    const dominantStyle = getDominantStyle(scores);

    const { error } = await supabase
      .from('profiles')
      .update({
        vark_visual: scores.visual,
        vark_auditory: scores.auditory,
        vark_reading: scores.reading,
        vark_kinesthetic: scores.kinesthetic,
        learning_style: dominantStyle,
        test_completed: true,
      })
      .eq('user_id', user?.id);

    setIsSubmitting(false);

    if (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar los resultados',
        variant: 'destructive',
      });
    } else {
      await refreshProfile();
      setShowResults(true);
    }
  };

  const question = varkQuestions[currentQuestion];

  if (showResults && results) {
    const dominantStyle = getDominantStyle(results);
    const DominantIcon = typeIcons[dominantStyle];
    const maxScore = Math.max(...Object.values(results));

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          <Card className="glass-panel">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mx-auto mb-4">
                <DominantIcon className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">¡Test Completado!</CardTitle>
              <CardDescription>
                Tu estilo de aprendizaje dominante es <strong>{typeLabels[dominantStyle]}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-muted-foreground">
                {typeDescriptions[dominantStyle]}
              </p>

              <div className="space-y-4">
                {(Object.entries(results) as [keyof typeof results, number][]).map(([type, score]) => {
                  const Icon = typeIcons[type];
                  const percentage = (score / varkQuestions.length) * 100;
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{typeLabels[type]}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{score}/{varkQuestions.length}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>

              <Button onClick={() => navigate('/')} className="w-full">
                Continuar a mi Palacio Mental
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Test VARK</h1>
          <p className="text-muted-foreground mt-2">Descubre tu estilo de aprendizaje</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Pregunta {currentQuestion + 1} de {varkQuestions.length}</span>
            <span>{Object.keys(answers).length} respondidas</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle className="font-serif text-xl">{question.text}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.options.map((option, index) => {
                  const Icon = typeIcons[option.type];
                  const isSelected = answers[currentQuestion] === option.type;
                  
                  return (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(option.type)}
                      className={`w-full p-4 rounded-lg border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-foreground'
                          : 'border-border bg-card hover:border-primary/50 text-foreground'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span>{option.text}</span>
                    </motion.button>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentQuestion === varkQuestions.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || Object.keys(answers).length < varkQuestions.length}
            >
              {isSubmitting ? 'Guardando...' : 'Ver Resultados'}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={!answers[currentQuestion]}
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
