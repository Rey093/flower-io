export interface Book {
  id: string;
  title: string;
  author: string;
  shelfId: string;
  borrowedBy: string | null;
}

export const books = new Map<string, Book>([
  ["b1", { id: "b1", title: "The Hobbit", author: "J.R.R. Tolkien", shelfId: "s1", borrowedBy: null }],
  ["b2", { id: "b2", title: "1984", author: "George Orwell", shelfId: "s1", borrowedBy: null }],
  ["b3", { id: "b3", title: "Dune", author: "Frank Herbert", shelfId: "s2", borrowedBy: null }],
  ["b4", { id: "b4", title: "Neuromancer", author: "William Gibson", shelfId: "s2", borrowedBy: null }],
  ["b5", { id: "b5", title: "Clean Code", author: "Robert C. Martin", shelfId: "s3", borrowedBy: null }],
  ["b6", { id: "b6", title: "The Pragmatic Programmer", author: "Andy Hunt", shelfId: "s3", borrowedBy: null }],
]);
