import { useList } from "@refinedev/core";
import { Link } from "react-router-dom";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Shelf } from "@/lib/types";

export function ShelfList() {
  const { data, isLoading } = useList<Shelf>({ resource: "shelves" });

  if (isLoading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Shelves</h1>
        <p className="text-sm text-muted-foreground">Physical locations in the library.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((shelf) => (
          <Link key={shelf.id} to={`/shelves/${shelf.id}`}>
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
