import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: IndexPage,
  loader: ({ context }) =>
    context.queryClient.ensureQueryData({
      queryKey: ["shelves"],
      queryFn: api.listShelves,
    }),
});

function IndexPage() {
  const { data } = useQuery({
    queryKey: ["shelves"],
    queryFn: api.listShelves,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shelves</h1>
        <p className="text-muted-foreground">Browse the library.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.shelves.map((shelf) => (
          <Link
            key={shelf.id}
            to="/shelves/$shelfId"
            params={{ shelfId: shelf.id }}
            className="block"
          >
            <Card className="h-full transition-colors hover:bg-accent">
              <CardHeader>
                <CardTitle>{shelf.name}</CardTitle>
                <CardDescription>{shelf.location}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
