import React, { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data.docs.length === 0) {
        setError("No books found.");
        setBooks([]);
      } else {
        setBooks(data.docs.slice(0, 10)); // Show only first 10 results
      }
    } catch (err) {
      setError("Error fetching books.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchBooks();
  };

  return (
    <div className="app">
      <h1>📚 Book Finder</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          placeholder="Enter book title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <div className="book-list">
        {books.map((book) => (
          <div key={book.key} className="book-item">
            {book.cover_i ? (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                alt={book.title}
              />
            ) : (
              <div className="no-image">No Image</div>
            )}
            <div>
              <h3>{book.title}</h3>
              <p>
                Author:{" "}
                {book.author_name ? book.author_name.join(", ") : "Unknown"}
              </p>
              <p>First Published: {book.first_publish_year || "N/A"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
