# flower-io

Toy library-backend on [Encore.ts](https://encore.dev/docs/ts) with two services, mock in-memory data, and endpoints to borrow/return books.

## Services

- **books** — catalog and borrow/return actions
- **shelves** — shelves and listing books on a shelf

## Run

```bash
npm install
encore run
```

Requires the [Encore CLI](https://encore.dev/docs/install). App is exposed at `http://localhost:4000`.

## API

| Method | Path                    | Description                      |
| ------ | ----------------------- | -------------------------------- |
| GET    | `/books`                | List all books                   |
| GET    | `/books/:id`            | Get a book                       |
| POST   | `/books/:id/borrow`     | Borrow a book (body: `{user}`)   |
| POST   | `/books/:id/return`     | Return a book                    |
| GET    | `/shelves`              | List all shelves                 |
| GET    | `/shelves/:id`          | Get a shelf                      |
| GET    | `/shelves/:id/books`    | List books on a shelf            |

## Example

```bash
curl http://localhost:4000/shelves/s1/books
curl -X POST http://localhost:4000/books/b1/borrow -d '{"user":"alice"}'
curl -X POST http://localhost:4000/books/b1/return
```
