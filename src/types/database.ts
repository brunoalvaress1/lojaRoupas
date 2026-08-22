export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; name: string; created_at: string };
        Insert: { id: string; name: string; created_at?: string };
        Update: { id?: string; name?: string; created_at?: string };
        Relationships: [];
      };
      admin_users: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: { user_id?: string; created_at?: string };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          image: string | null;
          order: number;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          image?: string | null;
          order?: number;
          active?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          reference: string;
          category_id: string | null;
          price: number;
          promo_price: number | null;
          description: string | null;
          composition: string | null;
          is_new: boolean;
          is_featured: boolean;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          reference: string;
          category_id?: string | null;
          price: number;
          promo_price?: number | null;
          description?: string | null;
          composition?: string | null;
          is_new?: boolean;
          is_featured?: boolean;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
        ];
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt: string | null;
          position: number;
          color_id: string | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt?: string | null;
          position?: number;
          color_id?: string | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_images"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
          {
            foreignKeyName: "product_images_color_id_fkey";
            columns: ["color_id"];
            referencedRelation: "product_colors";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
        ];
      };
      product_colors: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          hex: string;
          position: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          hex: string;
          position?: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_colors"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "product_colors_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
        ];
      };
      product_sizes: {
        Row: { id: string; product_id: string; label: string; position: number };
        Insert: {
          id?: string;
          product_id: string;
          label: string;
          position?: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_sizes"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "product_sizes_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
        ];
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          color_id: string;
          size_id: string;
          available: boolean;
          stock: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          color_id: string;
          size_id: string;
          available?: boolean;
          stock?: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["product_variants"]["Insert"]
        >;
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
          {
            foreignKeyName: "product_variants_color_id_fkey";
            columns: ["color_id"];
            referencedRelation: "product_colors";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
          {
            foreignKeyName: "product_variants_size_id_fkey";
            columns: ["size_id"];
            referencedRelation: "product_sizes";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
        ];
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey";
            columns: ["product_id"];
            referencedRelation: "products";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
        ];
      };
      site_settings: {
        Row: {
          id: number;
          name: string;
          tagline: string;
          whatsapp_number: string;
          whatsapp_default_message: string;
          instagram: string;
          address: string;
          hours: string;
          hero_video_url: string | null;
          hero_fallback_image: string | null;
          hero_title: string;
          hero_subtitle: string;
          hero_button_label: string;
          updated_at: string;
        };
        Insert: Partial<
          Database["public"]["Tables"]["site_settings"]["Row"]
        > & { id?: 1 };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Row"]>;
        Relationships: [];
      };
      size_guides: {
        Row: {
          id: string;
          gender: "feminino" | "masculino";
          size: string;
          busto: string | null;
          cintura: string | null;
          quadril: string | null;
          position: number;
        };
        Insert: {
          id?: string;
          gender: "feminino" | "masculino";
          size: string;
          busto?: string | null;
          cintura?: string | null;
          quadril?: string | null;
          position?: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["size_guides"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}
