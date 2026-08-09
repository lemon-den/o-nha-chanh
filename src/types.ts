export interface Character {
  id: string;
  name: string;
  tags: string[];
  traits: string[];
  biography: string;
  portrait?: string; // base64 encoded image
  ggaiLink?: string;
  googleAiLink2?: string;
  createdAt: number;
  updatedAt: number;
  isLocked?: boolean;     // Có khóa pass hay không?
  password?: string;      // Mật khẩu là gì?
}

export type ViewState = 
  | { type: 'landing' }
  | { type: 'list' }
  | { type: 'create' }
  | { type: 'edit'; characterId: string };
