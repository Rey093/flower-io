import type { DataProvider } from "@refinedev/core";

const API_URL = "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}: ${body}`);
  }
  return res.json() as Promise<T>;
}

type ListEnvelope<T> = { shelves?: T[]; books?: T[] };

function unwrapList<T>(resource: string, payload: ListEnvelope<T>): T[] {
  if (resource === "shelves" && payload.shelves) return payload.shelves;
  if (resource === "books" && payload.books) return payload.books;
  throw new Error(`unexpected list response for resource ${resource}`);
}

export const dataProvider: DataProvider = {
  getApiUrl: () => API_URL,

  getList: async ({ resource, meta }) => {
    if (resource === "books" && meta?.shelfId) {
      const res = await request<{ shelf: unknown; books: unknown[] }>(
        `/shelves/${meta.shelfId}/books`,
      );
      return { data: res.books as never, total: res.books.length };
    }
    const data = await request<ListEnvelope<unknown>>(`/${resource}`);
    const list = unwrapList(resource, data);
    return { data: list as never, total: list.length };
  },

  getOne: async ({ resource, id }) => {
    const data = await request<unknown>(`/${resource}/${id}`);
    return { data: data as never };
  },

  getMany: async ({ resource, ids }) => {
    const results = await Promise.all(ids.map((id) => request<unknown>(`/${resource}/${id}`)));
    return { data: results as never };
  },

  custom: async ({ url, method, payload }) => {
    const data = await request<unknown>(url, {
      method: method.toUpperCase(),
      body: payload ? JSON.stringify(payload) : undefined,
    });
    return { data: data as never };
  },

  create: () => Promise.reject(new Error("create not supported")),
  update: () => Promise.reject(new Error("update not supported")),
  deleteOne: () => Promise.reject(new Error("deleteOne not supported")),
};
