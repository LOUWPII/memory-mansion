export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      course_modules: {
        Row: {
          content: string | null
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          order_index: number
          title: string
        }
        Insert: {
          content?: string | null
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index: number
          title: string
        }
        Update: {
          content?: string | null
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          content_urls: string[] | null
          created_at: string | null
          description: string | null
          id: string
          professor_id: string
          room_type: string | null
          syllabus_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content_urls?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          professor_id: string
          room_type?: string | null
          syllabus_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content_urls?: string[] | null
          created_at?: string | null
          description?: string | null
          id?: string
          professor_id?: string
          room_type?: string | null
          syllabus_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string
          enrolled_at: string | null
          id: string
          student_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string | null
          id?: string
          student_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string | null
          id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      mental_palaces: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          palace_config: Json | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          palace_config?: Json | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          palace_config?: Json | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mental_palaces_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      palace_elements: {
        Row: {
          config: Json | null
          created_at: string | null
          element_type: string
          id: string
          module_id: string
          palace_id: string
          position: Json | null
        }
        Insert: {
          config?: Json | null
          created_at?: string | null
          element_type: string
          id?: string
          module_id: string
          palace_id: string
          position?: Json | null
        }
        Update: {
          config?: Json | null
          created_at?: string | null
          element_type?: string
          id?: string
          module_id?: string
          palace_id?: string
          position?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "palace_elements_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "palace_elements_palace_id_fkey"
            columns: ["palace_id"]
            isOneToOne: false
            referencedRelation: "mental_palaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          learning_style: Database["public"]["Enums"]["learning_style"] | null
          test_completed: boolean | null
          updated_at: string | null
          user_id: string
          vark_auditory: number | null
          vark_kinesthetic: number | null
          vark_reading: number | null
          vark_visual: number | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          test_completed?: boolean | null
          updated_at?: string | null
          user_id: string
          vark_auditory?: number | null
          vark_kinesthetic?: number | null
          vark_reading?: number | null
          vark_visual?: number | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          test_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
          vark_auditory?: number | null
          vark_kinesthetic?: number | null
          vark_reading?: number | null
          vark_visual?: number | null
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          module_id: string
          notes: string | null
          student_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          module_id: string
          notes?: string | null
          student_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          module_id?: string
          notes?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      study_plans: {
        Row: {
          generated_at: string | null
          id: string
          learning_style: Database["public"]["Enums"]["learning_style"] | null
          module_id: string
          palace_id: string
          tasks: Json | null
          techniques: Json | null
        }
        Insert: {
          generated_at?: string | null
          id?: string
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          module_id: string
          palace_id: string
          tasks?: Json | null
          techniques?: Json | null
        }
        Update: {
          generated_at?: string | null
          id?: string
          learning_style?: Database["public"]["Enums"]["learning_style"] | null
          module_id?: string
          palace_id?: string
          tasks?: Json | null
          techniques?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "study_plans_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_plans_palace_id_fkey"
            columns: ["palace_id"]
            isOneToOne: false
            referencedRelation: "mental_palaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "professor"
      learning_style: "visual" | "auditory" | "reading" | "kinesthetic"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "professor"],
      learning_style: ["visual", "auditory", "reading", "kinesthetic"],
    },
  },
} as const
