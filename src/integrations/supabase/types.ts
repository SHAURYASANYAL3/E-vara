export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      monitored_identities: {
        Row: {
          id: string;
          user_id: string;
          identity_type: string;
          identity_value_encrypted: string;
          identity_hash: string;
          full_name: string | null;
          is_active: boolean;
          created_at: string;
          last_scanned_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          identity_type: string;
          identity_value_encrypted: string;
          identity_hash: string;
          full_name?: string | null;
          is_active?: boolean;
          created_at?: string;
          last_scanned_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          identity_type?: string;
          identity_value_encrypted?: string;
          identity_hash?: string;
          full_name?: string | null;
          is_active?: boolean;
          created_at?: string;
          last_scanned_at?: string | null;
        };
      };
      identity_breaches: {
        Row: {
          id: string;
          user_id: string;
          identity_id: string;
          source_name: string;
          leak_date: string | null;
          severity: "low" | "medium" | "high" | "critical";
          data_types: Json | null;
          description: string | null;
          resolved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          identity_id: string;
          source_name: string;
          leak_date?: string | null;
          severity: "low" | "medium" | "high" | "critical";
          data_types?: Json | null;
          description?: string | null;
          resolved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          identity_id?: string;
          source_name?: string;
          leak_date?: string | null;
          severity?: "low" | "medium" | "high" | "critical";
          data_types?: Json | null;
          description?: string | null;
          resolved?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;
