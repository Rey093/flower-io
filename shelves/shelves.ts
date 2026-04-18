import { api, APIError } from "encore.dev/api";
import { Shelf, shelves } from "./data";
import { Book, books } from "../books/data";

interface ListResponse {
  shelves: Shelf[];
}

export const list = api(
  { expose: true, method: "GET", path: "/shelves" },
  async (): Promise<ListResponse> => {
    return { shelves: Array.from(shelves.values()) };
  },
);

export const get = api(
  { expose: true, method: "GET", path: "/shelves/:id" },
  async ({ id }: { id: string }): Promise<Shelf> => {
    const shelf = shelves.get(id);
    if (!shelf) throw APIError.notFound(`shelf ${id} not found`);
    return shelf;
  },
);

interface ShelfBooksResponse {
  shelf: Shelf;
  books: Book[];
}

export const listBooks = api(
  { expose: true, method: "GET", path: "/shelves/:id/books" },
  async ({ id }: { id: string }): Promise<ShelfBooksResponse> => {
    const shelf = shelves.get(id);
    if (!shelf) throw APIError.notFound(`shelf ${id} not found`);
    const shelfBooks = Array.from(books.values()).filter((b) => b.shelfId === id);
    return { shelf, books: shelfBooks };
  },
);
