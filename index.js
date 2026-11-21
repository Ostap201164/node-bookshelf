import * as bookService from "./books.js";
import { program } from "commander";
import path from "path";
import fs from "node:fs/promises";
import { json } from "stream/consumers";

program
  .option(
    "-a, --action <action>",
    "choose action: list, get, add, update, toggle, remove, search, stats",
  )
  .option("-i, --id <id>", "book id")
  .option("-t, --title <title>", "title book")
  .option("-d, --director <director>", "director book")
  .option("-y --year <year>", "year book", Number)
  .option("-q --query <text>", "query book")
  .option("-w --author <author> автор", "author book");

program.parse();
const options = program.opts();
console.log(options);

const invokeAction = async ({
  action,
  id,
  title,
  director,
  author,
  year,
  query,
}) => {
  switch (action) {
    case "list":
      const allBooks = await bookService.listOfBooks();
      return console.log(allBooks);
    case "get":
      const book = await bookService.getBookById(id);
      return console.log(book);
    case "add":
      const newBook = await bookService.addBook({title, author, year});
      return console.log(newBook);
    case "update":
      const updatedBook = await bookService.updateBookById(id, {
        title,
        director,
      });
      return console.log(updatedBook);
    case "remove":
      const removedBook = await bookService.removeBook(id);
      return console.log(removedBook);
    case "toggle":
      const toggle = await bookService.toggleRead(id);
      return console.log(toggle);

    case "search":
      const searchedBook = await bookService.searchBooks(query);
      return console.log(searchedBook);

    case "stats":
      const stats = await bookService.getStats();
      return console.log(stats);

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
};
invokeAction(options);
