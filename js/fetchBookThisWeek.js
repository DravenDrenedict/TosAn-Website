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
                <button class="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg class="h-3 w-3 text-gray-700 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
                        </path>
                    </svg>
                </button>
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
