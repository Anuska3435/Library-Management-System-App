import React, { useEffect, useState } from "react";
import AdminPanel from "./AdminPanel";
import UserPanel from "./UserPanel";

const Dashboard = ({ user, logout }) => {
  const [books, setBooks] = useState([]);
  const [userBooks, setUserBooks] = useState([]);
  const [borrowLogs, setBorrowLogs] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("https://openlibrary.org/search.json?q=fiction&limit=100");
        const data = await res.json();

        const formatted = data.docs.map((item, index) => ({
          id: index + 1,
          title: item.title || "Untitled",
          description: item.author_name ? `by ${item.author_name.join(", ")}` : "No author",
          image: item.cover_i
            ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
            : "https://via.placeholder.com/150x200?text=No+Cover",
        }));

        setBooks(formatted);
      } catch (err) {
        console.error("Failed to load books:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const addToLibrary = (book) => {
    setBooks([...books, { ...book, id: Date.now() }]);
  };

  const deleteFromLibrary = (id) => {
    setBooks(books.filter((book) => book.id !== id));
    setUserBooks(userBooks.filter((book) => book.id !== id));
  };

  const addUserBook = (bookId) => {
    const selectedBook = books.find((b) => b.id === bookId);
    if (selectedBook && !userBooks.some((b) => b.id === bookId)) {
      const timestamp = new Date().toISOString();

      setUserBooks([
        ...userBooks,
        {
          ...selectedBook,
          borrowedAt: timestamp,
          returned: false,
          borrowedBy: user.name,
        },
      ]);

      setBorrowLogs([
        ...borrowLogs,
        {
          user: user.name,
          bookTitle: selectedBook.title,
          borrowedAt: timestamp,
          returnedAt: null,
        },
      ]);
    }
  };

  const removeUserBook = (bookId) => {
    setUserBooks(userBooks.filter((b) => b.id !== bookId));
  };

  const returnBook = (bookId) => {
    const now = new Date().toISOString();

    setUserBooks((prev) =>
      prev.map((book) =>
        book.id === bookId ? { ...book, returned: true } : book
      )
    );

    setBorrowLogs((prev) =>
      prev.map((log) =>
        log.bookTitle === books.find((b) => b.id === bookId)?.title &&
        log.user === user.name &&
        log.returnedAt === null
          ? { ...log, returnedAt: now }
          : log
      )
    );

    const returnedBook = userBooks.find((b) => b.id === bookId);
    if (returnedBook && returnedBook.borrowedAt) {
      const fine = calculateFine(returnedBook.borrowedAt);
      alert(
        fine > 0
          ? `Book returned late. Fine: $${fine}`
          : `Book returned on time. No fine.`
      );
    }
  };

  const calculateFine = (borrowedAt) => {
    const now = new Date();
    const borrowedDate = new Date(borrowedAt);
    const diffInDays = Math.floor((now - borrowedDate) / (1000 * 60 * 60 * 24));
    return diffInDays > 3 ? (diffInDays - 3) * 10 : 0;
  };

  return (
    <div className="dashboard-wrapper">
      <header className="dashboard-header">
        <div className="header-left">Welcome, {user.name}</div>
        <div className="header-right">
          {user.role === "user" && (
            <button
              className="toggle-panel-button"
              onClick={() => setShowPanel(!showPanel)}
            >
              📘 My Books
            </button>
          )}
          <button className="logout-button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {loading ? (
          <div className="loading-text">📚 Loading books...</div>
        ) : user.role === "admin" ? (
          <AdminPanel
            books={books}
            addBook={addToLibrary}
            removeBook={deleteFromLibrary}
            returnBook={returnBook}
            borrowLogs={borrowLogs}
          />
        ) : (
          <UserPanel
            books={books}
            userBooks={userBooks}
            addBook={addUserBook}
            removeBook={removeUserBook}
            returnBook={returnBook}
            showPanel={showPanel}
            setShowPanel={setShowPanel}
            calculateFine={calculateFine}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
