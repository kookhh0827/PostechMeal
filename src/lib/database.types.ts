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
      accounts: {
        Row: {
          account_id: number;
          nickname: string | null;
          users_id: string | null;
        };
        Insert: {
          account_id?: number;
          nickname?: string | null;
          users_id?: string | null;
        };
        Update: {
          account_id?: number;
          nickname?: string | null;
          users_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_accounts_users_id_fkey';
            columns: ['users_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          }
        ];
      };
      meals: {
        Row: {
          date: string | null;
          description: string | null;
          meal_id: number;
          meal_type: string | null;
          name: string;
          price: number | null;
          restaurant_id: number | null;
        };
        Insert: {
          date?: string | null;
          description?: string | null;
          meal_id?: number;
          meal_type?: string | null;
          name: string;
          price?: number | null;
          restaurant_id?: number | null;
        };
        Update: {
          date?: string | null;
          description?: string | null;
          meal_id?: number;
          meal_type?: string | null;
          name?: string;
          price?: number | null;
          restaurant_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'meals_restaurant_id_fkey';
            columns: ['restaurant_id'];
            isOneToOne: false;
            referencedRelation: 'restaurants';
            referencedColumns: ['restaurant_id'];
          }
        ];
      };
      menuitems: {
        Row: {
          description: string | null;
          meal_id: number | null;
          menu_item_id: number;
          name: string;
        };
        Insert: {
          description?: string | null;
          meal_id?: number | null;
          menu_item_id?: number;
          name: string;
        };
        Update: {
          description?: string | null;
          meal_id?: number | null;
          menu_item_id?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'menuitems_meal_id_fkey';
            columns: ['meal_id'];
            isOneToOne: false;
            referencedRelation: 'meals';
            referencedColumns: ['meal_id'];
          }
        ];
      };
      orders: {
        Row: {
          description: string | null;
          end_date: string | null;
          meal_type: string | null;
          name: string | null;
          order_id: number;
          price: number | null;
          restaurant_id: number | null;
          start_date: string | null;
        };
        Insert: {
          description?: string | null;
          end_date?: string | null;
          meal_type?: string | null;
          name?: string | null;
          order_id?: number;
          price?: number | null;
          restaurant_id?: number | null;
          start_date?: string | null;
        };
        Update: {
          description?: string | null;
          end_date?: string | null;
          meal_type?: string | null;
          name?: string | null;
          order_id?: number;
          price?: number | null;
          restaurant_id?: number | null;
          start_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'public_orders_restaurant_id_fkey';
            columns: ['restaurant_id'];
            isOneToOne: false;
            referencedRelation: 'restaurants';
            referencedColumns: ['restaurant_id'];
          }
        ];
      };
      restaurants: {
        Row: {
          breakfast_end_time: string | null;
          breakfast_start_time: string | null;
          dinner_end_time: string | null;
          dinner_start_time: string | null;
          location: string | null;
          lunch_end_time: string | null;
          lunch_start_time: string | null;
          name: string;
          restaurant_id: number;
          serving_breakfast: boolean | null;
          serving_dinner: boolean | null;
          serving_lunch: boolean | null;
          type: string | null;
        };
        Insert: {
          breakfast_end_time?: string | null;
          breakfast_start_time?: string | null;
          dinner_end_time?: string | null;
          dinner_start_time?: string | null;
          location?: string | null;
          lunch_end_time?: string | null;
          lunch_start_time?: string | null;
          name: string;
          restaurant_id?: number;
          serving_breakfast?: boolean | null;
          serving_dinner?: boolean | null;
          serving_lunch?: boolean | null;
          type?: string | null;
        };
        Update: {
          breakfast_end_time?: string | null;
          breakfast_start_time?: string | null;
          dinner_end_time?: string | null;
          dinner_start_time?: string | null;
          location?: string | null;
          lunch_end_time?: string | null;
          lunch_start_time?: string | null;
          name?: string;
          restaurant_id?: number;
          serving_breakfast?: boolean | null;
          serving_dinner?: boolean | null;
          serving_lunch?: boolean | null;
          type?: string | null;
        };
        Relationships: [];
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

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
      PublicSchema['Views'])
  ? (PublicSchema['Tables'] &
      PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
  ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
  ? PublicSchema['Enums'][PublicEnumNameOrOptions]
  : never;
