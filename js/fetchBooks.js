import { newbook } from "../components/newbook.js";  // Import the book card component

export const fetchBooks = async () => {
    try {
        const response = await fetch("https://api.itbook.store/1.0/new");
        const data = await response.json();

        if (data.books) {
            displayBooks(data.books); // Call function to display books
        } else {
            console.log("No books found.");
        }
    } catch (error) {
        console.error("Error fetching books:", error);
    }
};

// Function to display books on the page
const displayBooks = (books) => {
    const booksContainer = document.getElementById("book-container");
    booksContainer.innerHTML = ""; // Clear any existing books

    books.forEach(book => {
        const bookCard = newbook(book);  // Generate a book card for each book
        booksContainer.innerHTML += bookCard;  // Append the book card to the container
    });
};

// Fetch and display books when the page loads
fetchBooks();
