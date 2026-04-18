const API_BASE = "/api";

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

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listShelves: () => request<{ shelves: Shelf[] }>("/shelves"),
  getShelfWithBooks: (id: string) =>
    request<{ shelf: Shelf; books: Book[] }>(`/shelves/${id}/books`),
  borrowBook: (id: string, user: string) =>
    request<Book>(`/books/${id}/borrow`, {
      method: "POST",
      body: JSON.stringify({ user }),
    }),
  returnBook: (id: string) =>
    request<Book>(`/books/${id}/return`, { method: "POST" }),
};
