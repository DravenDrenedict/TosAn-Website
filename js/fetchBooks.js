import { newbook } from '../components/newbook.js';  // Import the book card component

export const fetchBooks = async () => {
    const response = await fetch("https://api.itbook.store/1.0/new");
    const data = await response.json();

    if (data.books) {
        displayBooks(data.books);
    } else {
        console.log("No books found.");
    }
};

// Function to display books on the page
const displayBooks = (books) => {
    const booksContainer = document.getElementById("book-container");
    booksContainer.innerHTML = ""; // Clear existing books

    books.forEach(book => {
        const bookCard = newbook(book);  // Call the card component
        booksContainer.innerHTML += bookCard;  // Append the book card to the container
    });
};
