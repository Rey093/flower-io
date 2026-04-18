import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type Book } from "@/lib/api";

export const Route = createFileRoute("/shelves/$shelfId")({
  component: ShelfPage,
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["shelf", params.shelfId],
      queryFn: () => api.getShelfWithBooks(params.shelfId),
    }),
});

function ShelfPage() {
  const { shelfId } = Route.useParams();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["shelf", shelfId],
    queryFn: () => api.getShelfWithBooks(shelfId),
  });

  const borrow = useMutation({
    mutationFn: ({ id, user }: { id: string; user: string }) => api.borrowBook(id, user),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shelf", shelfId] }),
  });

  const returnBook = useMutation({
    mutationFn: (id: string) => api.returnBook(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shelf", shelfId] }),
  });

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{data.shelf.name}</h1>
        <p className="text-muted-foreground">{data.shelf.location}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {data.books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onBorrow={(user) => borrow.mutate({ id: book.id, user })}
            onReturn={() => returnBook.mutate(book.id)}
            pending={borrow.isPending || returnBook.isPending}
          />
        ))}
      </div>
    </div>
  );
}

function BookCard({
  book,
  onBorrow,
  onReturn,
  pending,
}: {
  book: Book;
  onBorrow: (user: string) => void;
  onReturn: () => void;
  pending: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{book.title}</CardTitle>
        <CardDescription>{book.author}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        {book.borrowedBy ? (
          <>
            <span className="text-sm text-muted-foreground">
              Borrowed by <span className="font-medium text-foreground">{book.borrowedBy}</span>
            </span>
            <Button variant="outline" size="sm" disabled={pending} onClick={onReturn}>
              Return
            </Button>
          </>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">Available</span>
            <Button size="sm" disabled={pending} onClick={() => onBorrow("guest")}>
              Borrow
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
