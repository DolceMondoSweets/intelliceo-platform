// Hand-written to match intelliceo_schema.sql. Regenerate from the live
// project instead once the Supabase CLI is linked:
//   supabase gen types typescript --project-id wiizwguxbnpxhzjekzvm --schema public

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          name: string;
          industry: string | null;
          subscription_tier: string | null;
          price_point: number | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          subscription_status: string | null;
          trial_ends_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          industry?: string | null;
          subscription_tier?: string | null;
          price_point?: number | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          subscription_status?: string | null;
          trial_ends_at?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["businesses"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          business_id: string | null;
          full_name: string | null;
          role: string | null;
          is_platform_admin: boolean;
          last_login_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          business_id?: string | null;
          full_name?: string | null;
          role?: string | null;
          is_platform_admin?: boolean;
          last_login_at?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "profiles_business_id_fkey";
            columns: ["business_id"];
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      finance_data: {
        Row: {
          business_id: string;
          cash: number | null;
          burn: number | null;
          runway: number | null;
          revenue_mtd: number | null;
          monthly_cogs: number | null;
          monthly_labor_cost: number | null;
          cogs_updated_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          business_id: string;
          cash?: number | null;
          burn?: number | null;
          runway?: number | null;
          revenue_mtd?: number | null;
          monthly_cogs?: number | null;
          monthly_labor_cost?: number | null;
          cogs_updated_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["finance_data"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "finance_data_business_id_fkey";
            columns: ["business_id"];
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      decisions: {
        Row: {
          id: string;
          business_id: string | null;
          decision: string;
          why: string | null;
          who: string | null;
          expected_outcome: string | null;
          actual_outcome: string | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          business_id?: string | null;
          decision: string;
          why?: string | null;
          who?: string | null;
          expected_outcome?: string | null;
          actual_outcome?: string | null;
          status?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["decisions"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "decisions_business_id_fkey";
            columns: ["business_id"];
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      brief_history: {
        Row: {
          id: string;
          business_id: string | null;
          brief_date: string;
          overall_score: number | null;
          momentum: string | null;
          cash_runway_days: number | null;
          revenue_mtd: number | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          business_id?: string | null;
          brief_date: string;
          overall_score?: number | null;
          momentum?: string | null;
          cash_runway_days?: number | null;
          revenue_mtd?: number | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["brief_history"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "brief_history_business_id_fkey";
            columns: ["business_id"];
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      marketing_drafts: {
        Row: {
          id: string;
          business_id: string | null;
          content_type: string | null;
          topic: string | null;
          content: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          business_id?: string | null;
          content_type?: string | null;
          topic?: string | null;
          content?: string | null;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["marketing_drafts"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "marketing_drafts_business_id_fkey";
            columns: ["business_id"];
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      knowledge_base_entries: {
        Row: {
          id: string;
          business_id: string | null;
          category: string | null;
          content: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          business_id?: string | null;
          category?: string | null;
          content?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["knowledge_base_entries"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "knowledge_base_entries_business_id_fkey";
            columns: ["business_id"];
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      square_credentials: {
        Row: {
          business_id: string;
          access_token: string | null;
          location_id: string | null;
          last_synced_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          business_id: string;
          access_token?: string | null;
          location_id?: string | null;
          last_synced_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["square_credentials"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "square_credentials_business_id_fkey";
            columns: ["business_id"];
            referencedRelation: "businesses";
            referencedColumns: ["id"];
          },
        ];
      };
      stripe_webhook_events: {
        Row: {
          id: string;
          type: string;
          created_at: string | null;
        };
        Insert: {
          id: string;
          type: string;
          created_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["stripe_webhook_events"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      // See intelliceo_schema.sql for why this SECURITY DEFINER function
      // exists — root cause confirmed by Supabase support, this is the
      // permanent bootstrap pattern, not a workaround.
      create_business_and_profile: {
        Args: { business_name: string; business_industry?: string };
        Returns: string;
      };
      record_login: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      set_stripe_customer_id: {
        Args: { p_customer_id: string };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
