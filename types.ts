
export enum AppView {
  LANDING = 'landing',
  LIBRARY = 'library',
  QURAN = 'quran',
  CHAT = 'chat',
  IMAGE_GEN = 'image_gen'
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverImage: string;
  year?: string;
  pdfUrl?: string;
  isRare?: boolean;
  isCustom?: boolean;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  translation: string;
  tafseer: {
    asSadi: string;
    ibnKathir: string;
  };
}
