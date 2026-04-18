import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router-v6";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { dataProvider } from "@/providers/dataProvider";

import { BookList } from "@/pages/books/list";
import { ShelfList } from "@/pages/shelves/list";
import { ShelfShow } from "@/pages/shelves/show";

export default function App() {
  return (
    <BrowserRouter>
      <Refine
        dataProvider={dataProvider}
        routerProvider={routerProvider}
        resources={[
          {
            name: "shelves",
            list: "/shelves",
            show: "/shelves/:id",
            meta: { label: "Shelves" },
          },
          {
            name: "books",
            list: "/books",
            meta: { label: "Books" },
          },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
          useNewQueryKeys: true,
        }}
      >
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/shelves" replace />} />
            <Route path="/shelves" element={<ShelfList />} />
            <Route path="/shelves/:id" element={<ShelfShow />} />
            <Route path="/books" element={<BookList />} />
          </Route>
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}
