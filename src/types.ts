export interface Character {
  id: string;
  name: string;
  tags: string[];
  traits: string[];
  biography: string;
  portrait?: string; // base64 encoded image
  ggaiLink?: string;
  createdAt: number;
  updatedAt: number;
}

export type ViewState = 
  | { type: 'landing' }
  | { type: 'list' }
  | { type: 'create' }
  | { type: 'edit'; characterId: string };
