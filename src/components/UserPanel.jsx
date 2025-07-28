import React from "react";

const UserPanel = ({
  books,
  userBooks,
  addBook,
  removeBook,
  returnBook,
  showPanel,
  setShowPanel,
  calculateFine
}) => {
  const isAdded = (id) => userBooks.some((b) => b.id === id);

  return (
    <div className="user-panel-wrapper">
      {/* Toggle Panel Button */}
      <button onClick={() => setShowPanel(!showPanel)} className="toggle-panel-button">
        {showPanel ? "Close My Books" : "📘 My Books"}
      </button>

      {/* Main Library Content */}
      <div className="library-section">
        <h3 className="section-title">📚 Available Books in Library</h3>
        <ul className="book-grid">
          {books.length === 0 && <p>No books available in the library.</p>}
          {books.map((book) => (
            <li key={book.id} className="book-card">
              <img src={book.image} alt={book.title} className="book-card-image" />
              <h4 className="book-card-title">{book.title}</h4>
              <p className="book-card-desc">{book.description}</p>
              <button
                onClick={() => addBook(book.id)}
                disabled={isAdded(book.id)}
                className={`book-card-button ${isAdded(book.id) ? 'added' : 'add'}`}
              >
                {isAdded(book.id) ? "✅ Added" : "➕ Add to My Books"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Slide-Out Borrowed Panel */}
      <div className={`side-panel ${showPanel ? "visible" : ""}`}>
        <h3>Your Added Books</h3>
        {userBooks.length === 0 && <p>No books added yet.</p>}
        <ul className="book-list">
          {userBooks.map((book) => {
            const fine = !book.returned && book.borrowedAt ? calculateFine(book.borrowedAt) : 0;
            const borrowedDate = book.borrowedAt
              ? new Date(book.borrowedAt).toLocaleDateString()
              : "N/A";

            return (
              <li key={book.id} className="book-item">
                <img src={book.image} alt={book.title} className="book-thumb" />
                <div className="book-meta">
                  <strong>{book.title}</strong>
                  <p><strong>Borrowed:</strong> {borrowedDate}</p>
                  <p><strong>By:</strong> {book.borrowedBy || "Unknown"}</p>
                  <p><strong>Status:</strong> {book.returned ? "✅ Returned" : "📖 Borrowed"}</p>
                  {!book.returned && (
                    <p style={{ color: fine > 0 ? "red" : "green" }}>
                      Fine: Rs.{fine}
                    </p>
                  )}
                  <div className="book-actions">
                    <button className="book-remove-btn" onClick={() => removeBook(book.id)}>
                      Remove
                    </button>
                    {!book.returned && (
                      <button className="book-return-btn" onClick={() => returnBook(book.id)}>
                        Return
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default UserPanel;
