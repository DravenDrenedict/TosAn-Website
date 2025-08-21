// Function to fetch books for "This Week" and populate the grid
export const fetchBooksForThisWeek = async () => {
    try {
        // Fetch books from the API
        const response = await fetch("https://api.itbook.store/1.0/new");
        const data = await response.json();

        if (data.books && data.books.length > 0) {
            // Limit to 10 books and populate the grid
            const limitedBooks = data.books.slice(0, 10);  // Limit to 10 books
            populateWeeklyBooks(limitedBooks);  // Populate the weekly books
        } else {
            console.log("No books found.");
        }
    } catch (error) {
        console.error("Error fetching books:", error);
    }
};

// Function to populate the books in the weekly section
const populateWeeklyBooks = (books) => {
    const weeklyBooksContainer = document.getElementById("weekly-books-container");
    weeklyBooksContainer.innerHTML = "";  // Clear existing content

    // Loop through each book and create a card
    books.forEach(book => {
        const card = document.createElement("div");
        card.classList.add("weekly-card", "group", "cursor-pointer", "mx-auto");

        // Create the book card structure dynamically
        card.innerHTML = `
            <div class="relative aspect-[3/4] bg-[#803030] rounded-lg overflow-hidden shadow-lg mb-3">
                <a href="${book.url}">
                    <img src="${book.image}" alt="${book.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                </a>
                
            </div>
            <h3 class="font-semibold text-gray-900 mb-1 text-sm">${book.title}</h3>
            <p class="text-xs text-gray-600">${book.subtitle}</p>
        `;

        // Append the card to the container
        weeklyBooksContainer.appendChild(card);
    });
};

// Call the function to fetch and populate books for "This Week"
fetchBooksForThisWeek();
