import { useCustomMutation, useList, useOne } from "@refinedev/core";
import { useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Book, Shelf } from "@/lib/types";

export function ShelfShow() {
  const { id = "" } = useParams<{ id: string }>();

  const shelf = useOne<Shelf>({ resource: "shelves", id });
  const books = useList<Book>({
    resource: "books",
    meta: { shelfId: id },
  });

  const { mutate: runAction, isPending } = useCustomMutation<Book>();

  const borrow = (bookId: string) =>
    runAction(
      { url: `/books/${bookId}/borrow`, method: "post", values: { user: "admin" } },
      { onSuccess: () => books.refetch() },
    );

  const returnBook = (bookId: string) =>
    runAction(
      { url: `/books/${bookId}/return`, method: "post", values: {} },
      { onSuccess: () => books.refetch() },
    );

  if (shelf.isLoading || books.isLoading) return <div className="text-muted-foreground">Loading…</div>;
  if (!shelf.data?.data) return <div>Shelf not found.</div>;

  const s = shelf.data.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{s.name}</h1>
        <p className="text-sm text-muted-foreground">{s.location}</p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.data?.data.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell className="text-muted-foreground">{book.author}</TableCell>
                <TableCell>
                  {book.borrowedBy ? (
                    <Badge variant="secondary">Borrowed by {book.borrowedBy}</Badge>
                  ) : (
                    <Badge variant="outline">Available</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {book.borrowedBy ? (
                    <Button size="sm" variant="outline" disabled={isPending} onClick={() => returnBook(String(book.id))}>
                      Return
                    </Button>
                  ) : (
                    <Button size="sm" disabled={isPending} onClick={() => borrow(String(book.id))}>
                      Borrow
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
