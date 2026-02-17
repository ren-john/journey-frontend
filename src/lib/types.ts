export interface JournalEntry {
  id: number;
  documentId: string;
  Title: string;
  Date: string | null;
  Age: number | null;
  Category: string | null;
  Story: StoryBlock[] | null;
  Location: string | null;
  Mood: string | null;
  Featured: boolean | null;
  Slug: string | null;
  Photos: Photo[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StoryBlock {
  type: string;
  children: Array<{
    type: string;
    text: string;
  }>;
}

export interface Photo {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    thumbnail?: PhotoFormat;
    small?: PhotoFormat;
    medium?: PhotoFormat;
    large?: PhotoFormat;
  };
  url: string;
}

export interface PhotoFormat {
  url: string;
  width: number;
  height: number;
  size: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface LifePhase {
  name: string;
  ageRange: string;
  color: string;
  bgColor: string;
}

