import React, { useState } from "react";

const AdminPanel = ({ books, addBook, removeBook, returnBook, borrowLogs }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAdd = () => {
    if (title.trim()) {
      addBook({
        title,
        description,
        image: image || "",
      });
      setTitle("");
      setDescription("");
      setImage(null);
    }
  };

  return (
    <div className="admin-panel-container">
      <h2 className="section-title">📚 Manage Library (Admin)</h2>

      <div className="admin-form">
        <input
          className="admin-input"
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="admin-textarea"
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <input type="file" accept="image/*" onChange={handleImage} />
        <button className="admin-add-btn" onClick={handleAdd}>
          ➕ Add Book
        </button>
      </div>

      <ul className="book-grid">
        {books.map((book) => {
          const pastBorrowers = borrowLogs.filter(
            (log) => log.bookTitle === book.title
          );
          const currentBorrower = pastBorrowers.find((log) => !log.returnedAt)?.user;

          return (
            <li key={book.id} className="book-card">
              {book.image && (
                <img
                  src={book.image}
                  alt={book.title}
                  className="book-card-image"
                />
              )}
              <h4 className="book-card-title">{book.title}</h4>
              <p className="book-card-desc">{book.description}</p>

              {currentBorrower && (
                <p style={{ color: "#d32f2f", fontWeight: "bold" }}>
                  Currently borrowed by: {currentBorrower}
                </p>
              )}

              {pastBorrowers.length > 0 && (
                <div style={{ marginTop: 8, textAlign: "left" }}>
                  <strong>Borrow History:</strong>
                  <ul style={{ paddingLeft: 16 }}>
                    {pastBorrowers.map((entry, idx) => (
                      <li key={idx} style={{ fontSize: "0.85rem" }}>
                        {entry.user} - {entry.returnedAt ? "Returned" : "Borrowed"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="book-actions">
                <button
                  className="book-remove-btn"
                  onClick={() => removeBook(book.id)}
                >
                  🗑️ Remove
                </button>
                <button
                  className="book-return-btn"
                  onClick={() => returnBook(book.id)}
                >
                  🔁 Return
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminPanel;
