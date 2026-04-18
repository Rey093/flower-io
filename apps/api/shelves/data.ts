export interface Shelf {
  id: string;
  name: string;
  location: string;
}

export const shelves = new Map<string, Shelf>([
  ["s1", { id: "s1", name: "Fiction", location: "Aisle A" }],
  ["s2", { id: "s2", name: "Sci-Fi", location: "Aisle B" }],
  ["s3", { id: "s3", name: "Programming", location: "Aisle C" }],
]);
