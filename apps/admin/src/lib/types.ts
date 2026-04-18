export interface Book {
  id: string;
  title: string;
  author: string;
  shelfId: string;
  borrowedBy: string | null;
}

export interface Shelf {
  id: string;
  name: string;
  location: string;
}
