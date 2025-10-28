export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAdmin?: boolean;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  keywords?: string[];
  image_url: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface AIGenerationResult {
  title: string;
  description: string;
  keywords?: string[];
}
