import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Trash2, GripVertical, Upload, File, X } from 'lucide-react';

interface Module {
  title: string;
  description: string;
  content: string;
}

interface UploadedFile {
  name: string;
  url: string;
  type: string;
}

export default function CreateCourse() {
  const navigate = useNavigate();
  const { user, isProfessor } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const syllabusInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [roomType, setRoomType] = useState('bedroom');
  const [modules, setModules] = useState<Module[]>([
    { title: '', description: '', content: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [syllabusFile, setSyllabusFile] = useState<UploadedFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const addModule = () => {
    setModules([...modules, { title: '', description: '', content: '' }]);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const updateModule = (index: number, field: keyof Module, value: string) => {
    const updated = [...modules];
    updated[index][field] = value;
    setModules(updated);
  };

  const uploadFile = async (file: File, type: 'content' | 'syllabus') => {
    if (!user) return null;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('course-content')
      .upload(fileName, file);

    setIsUploading(false);

    if (error) {
      toast({
        title: 'Error al subir archivo',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('course-content')
      .getPublicUrl(data.path);

    return {
      name: file.name,
      url: urlData.publicUrl,
      type: file.type,
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'content' | 'syllabus') => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      const uploaded = await uploadFile(file, type);
      if (uploaded) {
        if (type === 'syllabus') {
          setSyllabusFile(uploaded);
        } else {
          setUploadedFiles(prev => [...prev, uploaded]);
        }
      }
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: 'Error',
        description: 'El título del curso es requerido',
        variant: 'destructive',
      });
      return;
    }

    if (modules.some(m => !m.title.trim())) {
      toast({
        title: 'Error',
        description: 'Todos los módulos deben tener un título',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Create course
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title,
        description,
        room_type: roomType,
        professor_id: user?.id,
        syllabus_url: syllabusFile?.url || null,
        content_urls: uploadedFiles.map(f => f.url),
      })
      .select()
      .single();

    if (courseError || !course) {
      toast({
        title: 'Error',
        description: 'No se pudo crear el curso',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    // Create modules
    const modulesData = modules.map((m, index) => ({
      course_id: course.id,
      title: m.title,
      description: m.description,
      content: m.content,
      order_index: index,
    }));

    const { error: modulesError } = await supabase
      .from('course_modules')
      .insert(modulesData);

    setIsSubmitting(false);

    if (modulesError) {
      toast({
        title: 'Advertencia',
        description: 'El curso se creó pero hubo un error al crear los módulos',
        variant: 'destructive',
      });
    } else {
      toast({
        title: '¡Curso creado!',
        description: 'El curso y sus módulos se crearon exitosamente',
      });
    }

    navigate('/');
  };

  if (!isProfessor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Solo los profesores pueden crear cursos.</p>
            <Button className="mt-4" onClick={() => navigate('/')}>
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-serif text-xl font-bold">Crear Nuevo Curso</h1>
            <p className="text-sm text-muted-foreground">
              Define el contenido y los módulos de tu curso
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Course Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Información del Curso</CardTitle>
                <CardDescription>
                  Datos básicos de tu curso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del curso *</Label>
                  <Input
                    id="title"
                    placeholder="Ej: Álgebra Lineal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe el contenido y objetivos del curso..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roomType">Tipo de habitación</Label>
                  <Select value={roomType} onValueChange={setRoomType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bedroom">Dormitorio</SelectItem>
                      <SelectItem value="study">Estudio</SelectItem>
                      <SelectItem value="library">Biblioteca</SelectItem>
                      <SelectItem value="lab">Laboratorio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Upload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Contenido del Curso</CardTitle>
                <CardDescription>
                  Sube el syllabus y materiales de estudio para la generación del plan de estudio con IA
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Syllabus Upload */}
                <div className="space-y-2">
                  <Label>Syllabus del curso</Label>
                  <input
                    ref={syllabusInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'syllabus')}
                  />
                  {syllabusFile ? (
                    <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                      <File className="w-5 h-5 text-primary" />
                      <span className="flex-1 text-sm truncate">{syllabusFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setSyllabusFile(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => syllabusInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? 'Subiendo...' : 'Subir Syllabus'}
                    </Button>
                  )}
                </div>

                {/* Additional Content Upload */}
                <div className="space-y-2">
                  <Label>Materiales adicionales</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'content')}
                  />
                  
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                          <File className="w-5 h-5 text-muted-foreground" />
                          <span className="flex-1 text-sm truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeUploadedFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {isUploading ? 'Subiendo...' : 'Agregar Materiales'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Modules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Módulos del Curso</CardTitle>
                <CardDescription>
                  Cada módulo se asociará a un elemento del palacio mental
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {modules.map((module, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 border border-border rounded-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Módulo {index + 1}</span>
                      </div>
                      {modules.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeModule(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Título del módulo *</Label>
                      <Input
                        placeholder="Ej: Vectores y espacios vectoriales"
                        value={module.title}
                        onChange={(e) => updateModule(index, 'title', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Descripción</Label>
                      <Input
                        placeholder="Breve descripción del módulo"
                        value={module.description}
                        onChange={(e) => updateModule(index, 'description', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Contenido</Label>
                      <Textarea
                        placeholder="Contenido detallado, conceptos clave, definiciones..."
                        value={module.content}
                        onChange={(e) => updateModule(index, 'content', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </motion.div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addModule}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Módulo
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creando...' : 'Crear Curso'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
