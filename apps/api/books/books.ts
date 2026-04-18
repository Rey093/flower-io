import { api, APIError } from "encore.dev/api";
import { Book, books } from "./data";

interface ListResponse {
  books: Book[];
}

export const list = api(
  { expose: true, method: "GET", path: "/books" },
  async (): Promise<ListResponse> => {
    return { books: Array.from(books.values()) };
  },
);

export const get = api(
  { expose: true, method: "GET", path: "/books/:id" },
  async ({ id }: { id: string }): Promise<Book> => {
    const book = books.get(id);
    if (!book) throw APIError.notFound(`book ${id} not found`);
    return book;
  },
);

interface BorrowParams {
  id: string;
  user: string;
}

export const borrow = api(
  { expose: true, method: "POST", path: "/books/:id/borrow" },
  async ({ id, user }: BorrowParams): Promise<Book> => {
    const book = books.get(id);
    if (!book) throw APIError.notFound(`book ${id} not found`);
    if (book.borrowedBy) {
      throw APIError.failedPrecondition(`book ${id} is already borrowed by ${book.borrowedBy}`);
    }
    if (!user || user.trim() === "") {
      throw APIError.invalidArgument("user is required");
    }
    book.borrowedBy = user;
    return book;
  },
);

export const returnBook = api(
  { expose: true, method: "POST", path: "/books/:id/return" },
  async ({ id }: { id: string }): Promise<Book> => {
    const book = books.get(id);
    if (!book) throw APIError.notFound(`book ${id} not found`);
    if (!book.borrowedBy) {
      throw APIError.failedPrecondition(`book ${id} is not borrowed`);
    }
    book.borrowedBy = null;
    return book;
  },
);
