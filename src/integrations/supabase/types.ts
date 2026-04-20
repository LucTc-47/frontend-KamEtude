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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          active: boolean | null
          created_at: string
          icon: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          icon?: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          order_id: string
          sender_id: string
          sender_name: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_id: string
          sender_id: string
          sender_name?: string
          type?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_id?: string
          sender_id?: string
          sender_name?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          active: boolean | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      disputes: {
        Row: {
          client_id: string
          client_name: string | null
          client_statement: string | null
          created_at: string
          gig_title: string | null
          id: string
          moderator_id: string | null
          moderator_note: string | null
          order_id: string
          resolved_at: string | null
          status: string
          student_id: string
          student_name: string | null
          student_statement: string | null
        }
        Insert: {
          client_id: string
          client_name?: string | null
          client_statement?: string | null
          created_at?: string
          gig_title?: string | null
          id?: string
          moderator_id?: string | null
          moderator_note?: string | null
          order_id: string
          resolved_at?: string | null
          status?: string
          student_id: string
          student_name?: string | null
          student_statement?: string | null
        }
        Update: {
          client_id?: string
          client_name?: string | null
          client_statement?: string | null
          created_at?: string
          gig_title?: string | null
          id?: string
          moderator_id?: string | null
          moderator_note?: string | null
          order_id?: string
          resolved_at?: string | null
          status?: string
          student_id?: string
          student_name?: string | null
          student_statement?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      gigs: {
        Row: {
          active: boolean | null
          badge: string | null
          category: string | null
          created_at: string
          description: string | null
          gps_lat: number | null
          gps_lng: number | null
          id: string
          images: string[] | null
          location: string | null
          order_count: number | null
          rating: number | null
          review_count: number | null
          student_id: string
          tier_basique: Json
          tier_premium: Json
          tier_standard: Json
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          badge?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          images?: string[] | null
          location?: string | null
          order_count?: number | null
          rating?: number | null
          review_count?: number | null
          student_id: string
          tier_basique?: Json
          tier_premium?: Json
          tier_standard?: Json
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          badge?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          images?: string[] | null
          location?: string | null
          order_count?: number | null
          rating?: number | null
          review_count?: number | null
          student_id?: string
          tier_basique?: Json
          tier_premium?: Json
          tier_standard?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          budget: number
          client_id: string
          client_name: string
          created_at: string
          deliverable_note: string | null
          deliverable_url: string | null
          delivery_date: string | null
          description: string | null
          escrow_amount: number | null
          gig_id: string
          gig_title: string
          id: string
          payment_method: string | null
          revisions_left: number | null
          status: string
          student_id: string
          student_name: string
          tier: string
          updated_at: string
        }
        Insert: {
          budget?: number
          client_id: string
          client_name?: string
          created_at?: string
          deliverable_note?: string | null
          deliverable_url?: string | null
          delivery_date?: string | null
          description?: string | null
          escrow_amount?: number | null
          gig_id: string
          gig_title: string
          id?: string
          payment_method?: string | null
          revisions_left?: number | null
          status?: string
          student_id: string
          student_name?: string
          tier?: string
          updated_at?: string
        }
        Update: {
          budget?: number
          client_id?: string
          client_name?: string
          created_at?: string
          deliverable_note?: string | null
          deliverable_url?: string | null
          delivery_date?: string | null
          description?: string | null
          escrow_amount?: number | null
          gig_id?: string
          gig_title?: string
          id?: string
          payment_method?: string | null
          revisions_left?: number | null
          status?: string
          student_id?: string
          student_name?: string
          tier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability: string[] | null
          avatar_url: string | null
          banned: boolean | null
          bio: string | null
          city: string | null
          completed_jobs: number | null
          created_at: string
          email: string
          faculty: string | null
          first_name: string
          gps_lat: number | null
          gps_lng: number | null
          id: string
          last_name: string
          level: string | null
          level_badge: string | null
          next_level_xp: number | null
          phone: string | null
          rating: number | null
          response_time: string | null
          review_count: number | null
          role: string
          skills: string[] | null
          university: string | null
          updated_at: string
          user_id: string
          verified: boolean | null
          xp: number | null
        }
        Insert: {
          availability?: string[] | null
          avatar_url?: string | null
          banned?: boolean | null
          bio?: string | null
          city?: string | null
          completed_jobs?: number | null
          created_at?: string
          email?: string
          faculty?: string | null
          first_name?: string
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          last_name?: string
          level?: string | null
          level_badge?: string | null
          next_level_xp?: number | null
          phone?: string | null
          rating?: number | null
          response_time?: string | null
          review_count?: number | null
          role?: string
          skills?: string[] | null
          university?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          xp?: number | null
        }
        Update: {
          availability?: string[] | null
          avatar_url?: string | null
          banned?: boolean | null
          bio?: string | null
          city?: string | null
          completed_jobs?: number | null
          created_at?: string
          email?: string
          faculty?: string | null
          first_name?: string
          gps_lat?: number | null
          gps_lng?: number | null
          id?: string
          last_name?: string
          level?: string | null
          level_badge?: string | null
          next_level_xp?: number | null
          phone?: string | null
          rating?: number | null
          response_time?: string | null
          review_count?: number | null
          role?: string
          skills?: string[] | null
          university?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          xp?: number | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          created_at: string
          gig_id: string
          id: string
          order_id: string
          rating: number
          reported: boolean | null
          reviewer_id: string
          reviewer_name: string
          student_id: string
          text: string | null
        }
        Insert: {
          created_at?: string
          gig_id: string
          id?: string
          order_id: string
          rating: number
          reported?: boolean | null
          reviewer_id: string
          reviewer_name?: string
          student_id: string
          text?: string | null
        }
        Update: {
          created_at?: string
          gig_id?: string
          id?: string
          order_id?: string
          rating?: number
          reported?: boolean | null
          reviewer_id?: string
          reviewer_name?: string
          student_id?: string
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_gig_id_fkey"
            columns: ["gig_id"]
            isOneToOne: false
            referencedRelation: "gigs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
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
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          email: string | null
          id: string
          id_file_url: string | null
          id_type: string | null
          selfie_url: string | null
          status: string
          student_card_url: string | null
          student_id: string
          student_name: string
          submitted_at: string
          university: string | null
        }
        Insert: {
          email?: string | null
          id?: string
          id_file_url?: string | null
          id_type?: string | null
          selfie_url?: string | null
          status?: string
          student_card_url?: string | null
          student_id: string
          student_name?: string
          submitted_at?: string
          university?: string | null
        }
        Update: {
          email?: string | null
          id?: string
          id_file_url?: string | null
          id_type?: string | null
          selfie_url?: string | null
          status?: string
          student_card_url?: string | null
          student_id?: string
          student_name?: string
          submitted_at?: string
          university?: string | null
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
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
