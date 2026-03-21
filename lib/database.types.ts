export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type OrderStatus = 'nouveau' | 'en_preparation' | 'pret' | 'en_route' | 'livre' | 'annule'
export type BrandStatus = 'active' | 'coming_soon' | 'maintenance'

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          name: string
          slug: string
          emoji: string
          status: BrandStatus
          accent_color: string
          operating_hours_open: string
          operating_hours_close: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['brands']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['brands']['Insert']>
      }
      customers: {
        Row: {
          id: string
          phone: string
          full_name: string | null
          loyalty_points: number
          total_orders: number
          total_spent: number
          whatsapp_opt_in: boolean
          created_at: string
          last_order_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      products: {
        Row: {
          id: string
          brand_id: string
          name: string
          description: string
          emoji: string
          price: number
          weight_grams: number | null
          category: string
          available: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: {
          id: string
          order_number: string
          brand_id: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          delivery_address: string
          items_summary: string
          total_amount: number
          status: OrderStatus
          payment_method: string
          platform: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          subtotal: number
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      order_tracking: {
        Row: {
          id: string
          order_id: string
          driver_id: string | null
          driver_lat: number | null
          driver_lng: number | null
          estimated_delivery_minutes: number | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_tracking']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['order_tracking']['Insert']>
      }
      order_status_log: {
        Row: {
          id: string
          order_id: string
          status: OrderStatus
          changed_at: string
          note: string | null
        }
        Insert: Omit<Database['public']['Tables']['order_status_log']['Row'], 'id' | 'changed_at'>
        Update: never
      }
      kitchen_queue: {
        Row: {
          id: string
          order_id: string
          brand_id: string
          priority: number
          added_at: string
          started_at: string | null
          completed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['kitchen_queue']['Row'], 'id' | 'added_at'>
        Update: Partial<Database['public']['Tables']['kitchen_queue']['Insert']>
      }
      loyalty_cards: {
        Row: {
          id: string
          customer_id: string
          brand_id: string
          stamps: number
          total_free_bowls_earned: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['loyalty_cards']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['loyalty_cards']['Insert']>
      }
      loyalty_rewards: {
        Row: {
          id: string
          customer_id: string
          brand_id: string
          order_id: string | null
          action: 'stamp_added' | 'reward_redeemed'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['loyalty_rewards']['Row'], 'id' | 'created_at'>
        Update: never
      }
      drivers: {
        Row: {
          id: string
          full_name: string
          phone: string
          active: boolean
          current_lat: number | null
          current_lng: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['drivers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['drivers']['Insert']>
      }
      promotions: {
        Row: {
          id: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order_amount: number | null
          max_uses: number | null
          uses_count: number
          active: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['promotions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['promotions']['Insert']>
      }
      order_payments: {
        Row: {
          id: string
          order_id: string
          method: 'cash' | 'card' | 'cmi' | 'marocpay'
          amount: number
          status: 'pending' | 'completed' | 'failed'
          transaction_ref: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['order_payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['order_payments']['Insert']>
      }
      push_tokens: {
        Row: {
          id: string
          customer_id: string
          token: string
          platform: 'ios' | 'android'
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['push_tokens']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['push_tokens']['Insert']>
      }
    }
  }
}
