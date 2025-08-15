import { newbook } from '../components/newbook.js';  // Import the book card component

// Function to handle search
export const handleSearch = async () => {
    const Query = document.getElementById("searchInput").value.trim();
    if (!Query) return; // If the search input is empty, do nothing

    // Fetch search results from the API
    const response = await fetch(`https://api.itbook.store/1.0/search/${Query}`);
    const data = await response.json();

    // Call the displayBooks function to display search results
    if (data.books) {
        displayBooks(data.books);
    } else {
        alert("No books found.");
    }
};

// Function to display books based on search results
const displayBooks = (books) => {
    const renderBookSection = document.getElementById("book");
    renderBookSection.innerHTML = "";  // Clear existing books before rendering new ones

    // Loop through the books and render each one using newbook
    books.forEach(book => {
        renderBookSection.innerHTML += newbook(book);  // Append the book component to the container
    });
};

// Event listener for search input field
document.getElementById("searchInput")?.addEventListener("input", () => {
    handleSearch();  // Trigger search as user types
});
