// src/types.ts or src/types/index.ts

export interface Investigation {
  id: string;
  title: string;
  name: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
}
