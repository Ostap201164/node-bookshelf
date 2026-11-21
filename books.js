import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";
const booksPath = path.resolve("db", "books.json");

const updateBooks = (books) => {
  fs.writeFile(booksPath, JSON.stringify(books, null, 2));
};

export async function listOfBooks() {
  try {
      const data = await fs.readFile(booksPath);
  return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      return []
    }
  }

}

export async function getBookById(bookId) {
  const books = await listOfBooks();
  const res = books.find((item) => item.id == bookId);
  return res || null;
}

export async function addBook({ title, author, year }) {
  const books = await listOfBooks();
  const newBook = {
    id: nanoid(),
    title: title,
    author: author,
    year: Number(year),
    isRead: false,
  };
console.log(newBook);


  books.push(newBook);

  updateBooks(books);

  return newBook;
}

export async function updateBookById(bookId, data) {
  const books = await listOfBooks();
  const index = books.findIndex((item) => item.id == bookId);
  if (index == -1) {
    return null;
  }
  books[index] = data;
  updateBooks(books);
  return books[index];
}

export async function toggleRead(bookId) {
  const books = await listOfBooks();
  const index = books.findIndex((item) => item.id == bookId);
  if (index == -1) {
    return null;
  }
  if (books[index].isRead) {
    books[index].isRead = false;
  } else {
    books[index].isRead = true;
  }
  return books[index];
}

export async function removeBook(bookId) {
  // Повертає об'єкт видаленої книжки або null.
  const books = await listOfBooks();
  const index = books.findIndex((item) => item.id == bookId);
  if (index == -1) {
    return null;
  }
  const deletedBook = books[index];
  books.splice(index, 1);
  return deletedBook;
}

export async function searchBooks(query) {
  const loverQuery = query.toLowerCase();
  const books = await listOfBooks();
  const searchedBooks = books.filter((item) => {
    if (
      item.title.toLowerCase().includes(loverQuery) ||
      item.author.toLowerCase().includes(loverQuery)
    ) {
      return true;
    } else {
      return false;
    }
  });
  return searchedBooks;
}

export async function getStats() {
  const books = await listOfBooks();
  let stats = {
    read: 0,
    unRead: 0,
    procentOfRead: "0%",
    theOldest: "",
    theNewest: "",
  };
  let oldestYear = 0;
  let newestYear = 0;
  books.forEach((item) => {
    if (item.isRead) {
      stats.read += 1;
    } else {
      stats.unRead += 1;
    }
    if (item.year < oldestYear || oldestYear == 0) {
      oldestYear = item.year;
      stats.theOldest = `${item.title} year:${item.year}`;
    } else if (item.year > newestYear) {
      newestYear = item.year;
      stats.theNewest = `${item.title} year:${item.year}`;
    }
  });

  stats.procentOfRead = `${(stats.read / (stats.read + stats.unRead)) * 100}%`;
  return stats;
}
