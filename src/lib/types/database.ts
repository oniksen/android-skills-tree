export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      levels: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          min_score: number
          max_score: number
          level_order: number
          required_project_count: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string
          min_score?: number
          max_score?: number
          level_order: number
          required_project_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          min_score?: number
          max_score?: number
          level_order?: number
          required_project_count?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_level_id_fkey"
            columns: ["id"]
            referencedRelation: "categories"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "projects_level_id_fkey"
            columns: ["id"]
            referencedRelation: "projects"
            referencedColumns: ["level_id"]
          },
          {
            foreignKeyName: "user_progress_current_level_id_fkey"
            columns: ["id"]
            referencedRelation: "user_progress"
            referencedColumns: ["current_level_id"]
          },
        ]
      }
      categories: {
        Row: {
          id: string
          level_id: string
          name: string
          max_score: number
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          level_id: string
          name: string
          max_score?: number
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          level_id?: string
          name?: string
          max_score?: number
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_level_id_fkey"
            columns: ["level_id"]
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          id: string
          category_id: string
          name: string
          max_weight: number
          sort_order: number
          required_for_level_up: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          max_weight?: number
          sort_order?: number
          required_for_level_up?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          max_weight?: number
          sort_order?: number
          required_for_level_up?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          score: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          score?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_skill_id_fkey"
            columns: ["skill_id"]
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          id: string
          level_id: string
          name: string
          description: string
          required_technologies: Json
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          level_id: string
          name: string
          description?: string
          required_technologies?: Json
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          level_id?: string
          name?: string
          description?: string
          required_technologies?: Json
          sort_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_level_id_fkey"
            columns: ["level_id"]
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
        ]
      }
      project_progress: {
        Row: {
          id: string
          user_id: string
          project_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_progress_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_progress_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          current_level_id: string | null
          unlocked_level_ids: string[]
          total_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_level_id?: string | null
          unlocked_level_ids?: string[]
          total_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_level_id?: string | null
          unlocked_level_ids?: string[]
          total_score?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_current_level_id_fkey"
            columns: ["current_level_id"]
            referencedRelation: "levels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          type: string
          metadata: Json | null
          achieved_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          metadata?: Json | null
          achieved_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          metadata?: Json | null
          achieved_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
