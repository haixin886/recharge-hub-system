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
      accounting_sessions: {
        Row: {
          closed_by: string | null
          created_at: string
          end_time: string | null
          group_id: string | null
          id: string
          opened_by: string | null
          start_time: string
          status: Database["public"]["Enums"]["session_status"] | null
          updated_at: string
        }
        Insert: {
          closed_by?: string | null
          created_at?: string
          end_time?: string | null
          group_id?: string | null
          id?: string
          opened_by?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["session_status"] | null
          updated_at?: string
        }
        Update: {
          closed_by?: string | null
          created_at?: string
          end_time?: string | null
          group_id?: string | null
          id?: string
          opened_by?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["session_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounting_sessions_closed_by_fkey"
            columns: ["closed_by"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "accounting_sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "telegram_groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "accounting_sessions_opened_by_fkey"
            columns: ["opened_by"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      admin_users: {
        Row: {
          admin_permissions: string[] | null
          created_at: string
          email: string
          id: string
          is_admin: boolean
          updated_at: string
        }
        Insert: {
          admin_permissions?: string[] | null
          created_at?: string
          email: string
          id?: string
          is_admin?: boolean
          updated_at?: string
        }
        Update: {
          admin_permissions?: string[] | null
          created_at?: string
          email?: string
          id?: string
          is_admin?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      business_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      call_records: {
        Row: {
          call_sid: string | null
          created_at: string
          direction: string
          duration: number | null
          id: string
          phone_number: string
          status: string
        }
        Insert: {
          call_sid?: string | null
          created_at?: string
          direction: string
          duration?: number | null
          id?: string
          phone_number: string
          status: string
        }
        Update: {
          call_sid?: string | null
          created_at?: string
          direction?: string
          duration?: number | null
          id?: string
          phone_number?: string
          status?: string
        }
        Relationships: []
      }
      custom_commands: {
        Row: {
          command_name: string
          created_at: string
          group_id: string | null
          id: string
          updated_at: string
        }
        Insert: {
          command_name: string
          created_at?: string
          group_id?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          command_name?: string
          created_at?: string
          group_id?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_commands_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "telegram_groups"
            referencedColumns: ["group_id"]
          },
        ]
      }
      customer_service_settings: {
        Row: {
          id: string
          telegram_link: string
          updated_at: string
          whatsapp_link: string
        }
        Insert: {
          id?: string
          telegram_link?: string
          updated_at?: string
          whatsapp_link?: string
        }
        Update: {
          id?: string
          telegram_link?: string
          updated_at?: string
          whatsapp_link?: string
        }
        Relationships: []
      }
      game_accounts: {
        Row: {
          created_at: string | null
          id: string
          last_login: string | null
          message: string | null
          password: string
          rank: string | null
          server: string
          status: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          message?: string | null
          password: string
          rank?: string | null
          server: string
          status?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_login?: string | null
          message?: string | null
          password?: string
          rank?: string | null
          server?: string
          status?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          location: string | null
          rich_description: Json | null
          salary: string
          title: string
          updated_at: string
          working_hours: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          location?: string | null
          rich_description?: Json | null
          salary: string
          title: string
          updated_at?: string
          working_hours: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string | null
          rich_description?: Json | null
          salary?: string
          title?: string
          updated_at?: string
          working_hours?: string
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          name: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          name: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          name?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          id: number
          message_type: string
          timestamp: string | null
          token: string | null
          user_id: string
        }
        Insert: {
          content: string
          id?: never
          message_type: string
          timestamp?: string | null
          token?: string | null
          user_id: string
        }
        Update: {
          content?: string
          id?: never
          message_type?: string
          timestamp?: string | null
          token?: string | null
          user_id?: string
        }
        Relationships: []
      }
      online_players: {
        Row: {
          avatar: string | null
          created_at: string | null
          id: string
          last_seen: string
          name: string
          rank: string
          status: string
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          last_seen: string
          name: string
          rank: string
          status: string
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          created_at?: string | null
          id?: string
          last_seen?: string
          name?: string
          rank?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_addresses: {
        Row: {
          active: boolean | null
          address: string
          created_at: string
          description: string | null
          id: string
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          address: string
          created_at?: string
          description?: string | null
          id?: string
          type: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          address?: string
          created_at?: string
          description?: string | null
          id?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      phone_contacts: {
        Row: {
          created_at: string
          id: string
          name: string | null
          notes: string | null
          phone_number: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string | null
          notes?: string | null
          phone_number: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          notes?: string | null
          phone_number?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_permissions: string[] | null
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          is_admin: boolean | null
          last_name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          admin_permissions?: string[] | null
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          is_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          admin_permissions?: string[] | null
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          last_name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recharge_orders: {
        Row: {
          amount: number
          balance: number | null
          batch_count: number | null
          carrier: string
          city: string | null
          completed_at: string | null
          created_at: string
          id: string
          is_batch: boolean | null
          name: string | null
          order_id: string
          original_carrier: string | null
          phone_number: string
          province: string | null
          status: string
        }
        Insert: {
          amount: number
          balance?: number | null
          batch_count?: number | null
          carrier: string
          city?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          is_batch?: boolean | null
          name?: string | null
          order_id: string
          original_carrier?: string | null
          phone_number: string
          province?: string | null
          status?: string
        }
        Update: {
          amount?: number
          balance?: number | null
          batch_count?: number | null
          carrier?: string
          city?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          is_batch?: boolean | null
          name?: string | null
          order_id?: string
          original_carrier?: string | null
          phone_number?: string
          province?: string | null
          status?: string
        }
        Relationships: []
      }
      recharge_products: {
        Row: {
          business_type_id: string | null
          created_at: string | null
          discount: number | null
          exchange_rate: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          value: number
        }
        Insert: {
          business_type_id?: string | null
          created_at?: string | null
          discount?: number | null
          exchange_rate?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          value: number
        }
        Update: {
          business_type_id?: string | null
          created_at?: string | null
          discount?: number | null
          exchange_rate?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "recharge_products_business_type_id_fkey"
            columns: ["business_type_id"]
            isOneToOne: false
            referencedRelation: "business_types"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          coverLetter: string
          created_at: string
          education: string
          email: string
          experience: string
          fullName: string
          id: string
          phone: string
          skills: string
          status: string
          submitted_at: string
          user_id: string | null
        }
        Insert: {
          coverLetter: string
          created_at?: string
          education: string
          email: string
          experience: string
          fullName: string
          id?: string
          phone: string
          skills: string
          status?: string
          submitted_at?: string
          user_id?: string | null
        }
        Update: {
          coverLetter?: string
          created_at?: string
          education?: string
          email?: string
          experience?: string
          fullName?: string
          id?: string
          phone?: string
          skills?: string
          status?: string
          submitted_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      scheduled_callbacks: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          phone_number: string
          scheduled_time: string
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          phone_number: string
          scheduled_time: string
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          phone_number?: string
          scheduled_time?: string
          status?: string
        }
        Relationships: []
      }
      sms_messages: {
        Row: {
          contact_id: string | null
          content: string
          created_at: string
          direction: string
          id: string
          phone_number: string
          status: string | null
        }
        Insert: {
          contact_id?: string | null
          content: string
          created_at?: string
          direction: string
          id?: string
          phone_number: string
          status?: string | null
        }
        Update: {
          contact_id?: string | null
          content?: string
          created_at?: string
          direction?: string
          id?: string
          phone_number?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_messages_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "phone_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      sub_accounts: {
        Row: {
          account_name: string
          created_at: string
          id: number
          parent_id: string
          updated_at: string
        }
        Insert: {
          account_name: string
          created_at?: string
          id?: never
          parent_id: string
          updated_at?: string
        }
        Update: {
          account_name?: string
          created_at?: string
          id?: never
          parent_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_stats: {
        Row: {
          active_time: string | null
          id: string
          messages_sent: number | null
          online_players: number | null
          success_rate: string | null
          updated_at: string | null
        }
        Insert: {
          active_time?: string | null
          id?: string
          messages_sent?: number | null
          online_players?: number | null
          success_rate?: string | null
          updated_at?: string | null
        }
        Update: {
          active_time?: string | null
          id?: string
          messages_sent?: number | null
          online_players?: number | null
          success_rate?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      telegram_groups: {
        Row: {
          allow_all_operators: boolean | null
          auto_double_tap: boolean | null
          balance_adjustment: number | null
          bill_buttons: string | null
          bill_format: number | null
          bill_summary: number | null
          created_at: string
          daily_split_hour: number | null
          decimal_precision: number | null
          deposit_fee_rate: number | null
          deposit_threshold: number | null
          display_mode: number | null
          end_session_message: string | null
          exchange_rate: number | null
          exchange_rate_source: string | null
          fee_rate: number | null
          global_operators: string[] | null
          group_category: number | null
          group_id: string
          group_name: string
          id: string
          operators: string[] | null
          start_session_message: string | null
          updated_at: string
          use_chinese_bill: boolean | null
          verification_message: string | null
          welcome_message: string | null
          withdrawal_fee_rate: number | null
        }
        Insert: {
          allow_all_operators?: boolean | null
          auto_double_tap?: boolean | null
          balance_adjustment?: number | null
          bill_buttons?: string | null
          bill_format?: number | null
          bill_summary?: number | null
          created_at?: string
          daily_split_hour?: number | null
          decimal_precision?: number | null
          deposit_fee_rate?: number | null
          deposit_threshold?: number | null
          display_mode?: number | null
          end_session_message?: string | null
          exchange_rate?: number | null
          exchange_rate_source?: string | null
          fee_rate?: number | null
          global_operators?: string[] | null
          group_category?: number | null
          group_id: string
          group_name: string
          id?: string
          operators?: string[] | null
          start_session_message?: string | null
          updated_at?: string
          use_chinese_bill?: boolean | null
          verification_message?: string | null
          welcome_message?: string | null
          withdrawal_fee_rate?: number | null
        }
        Update: {
          allow_all_operators?: boolean | null
          auto_double_tap?: boolean | null
          balance_adjustment?: number | null
          bill_buttons?: string | null
          bill_format?: number | null
          bill_summary?: number | null
          created_at?: string
          daily_split_hour?: number | null
          decimal_precision?: number | null
          deposit_fee_rate?: number | null
          deposit_threshold?: number | null
          display_mode?: number | null
          end_session_message?: string | null
          exchange_rate?: number | null
          exchange_rate_source?: string | null
          fee_rate?: number | null
          global_operators?: string[] | null
          group_category?: number | null
          group_id?: string
          group_name?: string
          id?: string
          operators?: string[] | null
          start_session_message?: string | null
          updated_at?: string
          use_chinese_bill?: boolean | null
          verification_message?: string | null
          welcome_message?: string | null
          withdrawal_fee_rate?: number | null
        }
        Relationships: []
      }
      telegram_users: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          is_admin: boolean | null
          is_customer_service: boolean | null
          last_name: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_customer_service?: boolean | null
          last_name?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          is_admin?: boolean | null
          is_customer_service?: boolean | null
          last_name?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          crypto_amount: number | null
          description: string | null
          exchange_rate: number | null
          fee_rate: number | null
          group_id: string | null
          id: string
          message_id: string | null
          record_type: Database["public"]["Enums"]["record_type"]
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          crypto_amount?: number | null
          description?: string | null
          exchange_rate?: number | null
          fee_rate?: number | null
          group_id?: string | null
          id?: string
          message_id?: string | null
          record_type: Database["public"]["Enums"]["record_type"]
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          crypto_amount?: number | null
          description?: string | null
          exchange_rate?: number | null
          fee_rate?: number | null
          group_id?: string | null
          id?: string
          message_id?: string | null
          record_type?: Database["public"]["Enums"]["record_type"]
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "telegram_groups"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "transactions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "accounting_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_recharge_requests: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          id: string
          status: string
          transaction_hash: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          status?: string
          transaction_hash?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          completed_at: string | null
          created_at: string
          id: string
          network: string | null
          note: string | null
          processed_by: string | null
          reference_id: string | null
          status: string
          transaction_hash: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          created_at?: string
          id?: string
          network?: string | null
          note?: string | null
          processed_by?: string | null
          reference_id?: string | null
          status?: string
          transaction_hash?: string | null
          type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          network?: string | null
          note?: string | null
          processed_by?: string | null
          reference_id?: string | null
          status?: string
          transaction_hash?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_access: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      check_and_send_scheduled_messages: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_mute_status: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_mute_status_v2: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      check_sms_inbox: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      account_status: "active" | "inactive"
      message_type: "text" | "image" | "url"
      record_type: "deposit" | "withdrawal"
      session_status: "open" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["active", "inactive"],
      message_type: ["text", "image", "url"],
      record_type: ["deposit", "withdrawal"],
      session_status: ["open", "closed"],
    },
  },
} as const
