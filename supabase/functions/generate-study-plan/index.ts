import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { moduleContent, learningStyle, moduleTitle } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = `Eres un experto en pedagogía y técnicas de estudio personalizadas. 
Tu tarea es generar un plan de estudio adaptado al estilo de aprendizaje del estudiante.

Estilos de aprendizaje VARK:
- Visual: Aprende mejor con diagramas, mapas mentales, colores, videos
- Auditory: Aprende mejor escuchando, discutiendo, con podcasts
- Reading: Aprende mejor leyendo, escribiendo, tomando notas
- Kinesthetic: Aprende mejor practicando, con ejercicios hands-on

Genera un plan de estudio en formato JSON con esta estructura:
{
  "techniques": [
    {
      "name": "Nombre de la técnica",
      "description": "Descripción breve",
      "steps": ["Paso 1", "Paso 2", "Paso 3"],
      "estimatedTime": "30 minutos"
    }
  ],
  "tasks": [
    {
      "title": "Título de la tarea",
      "description": "Descripción de qué hacer",
      "priority": "high|medium|low",
      "type": "practice|review|create|memorize"
    }
  ],
  "mnemonicTips": ["Consejo 1 para memorizar", "Consejo 2"]
}`;

    const userPrompt = `Genera un plan de estudio para el módulo "${moduleTitle}" con el siguiente contenido:

${moduleContent}

El estudiante tiene un estilo de aprendizaje predominantemente ${learningStyle}.
Adapta las técnicas y tareas a este estilo. Responde SOLO con el JSON, sin texto adicional.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    // Parse JSON from response
    let studyPlan;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      studyPlan = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      studyPlan = { techniques: [], tasks: [], mnemonicTips: [] };
    }

    return new Response(JSON.stringify({ studyPlan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-study-plan:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
