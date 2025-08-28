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
        card.classList.add("weekly-card", "group", "cursor-pointer", "mx-auto", "relative", "bg-white", "rounded-lg", "shadow-lg", "overflow-hidden", "transition-transform", "transform", "hover:scale-105");

        // Create the book card structure dynamically
        card.innerHTML = `
            <div class="relative aspect-[3/4] bg-[#803030] rounded-lg overflow-hidden mb-3 group-hover:opacity-80 transition-opacity duration-300">
                <img src="${book.image}" alt="${book.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                <!-- View Details Button (Hidden by default) -->
                <button class="view-details-btn absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Details
                </button>
            </div>
            <h3 class="font-semibold text-gray-900 mb-1 text-sm">${book.title}</h3>
            <p class="text-xs text-gray-600">${book.subtitle}</p>
        `;

        // Add click event listener to open the modal on "View Details" button click
        const viewDetailsButton = card.querySelector(".view-details-btn");
        viewDetailsButton.addEventListener("click", (e) => {
            e.stopPropagation();  // Prevent card click event from firing
            openModal(book);      // Open modal with book details
        });

        // Append the card to the container
        weeklyBooksContainer.appendChild(card);
    });
};

// Function to open the modal with book details
const openModal = (book) => {
    const modal = document.getElementById("bookModal");
    const modalTitle = document.getElementById("modalBookTitle");
    const modalImage = document.getElementById("modalBookImage");
    const modalAuthors = document.getElementById("modalBookAuthors");
    const modalPublisher = document.getElementById("modalBookPublisher");
    const modalYear = document.getElementById("modalBookYear");
    const modalPages = document.getElementById("modalBookPages");
    const modalDescription = document.getElementById("modalBookDescription");
    const modalLink = document.getElementById("readMoreButton");

    // Populate the modal with book details
    modalTitle.textContent = book.title;
    modalImage.src = book.image;
    modalAuthors.textContent = book.authors || "Unknown Author";
    modalPublisher.textContent = book.publisher || "Unknown Publisher";
    modalYear.textContent = book.year || "Unknown Year";
    modalPages.textContent = `Pages: ${book.pages || "N/A"}`;
    modalDescription.textContent = book.description || "No description available.";
    modalLink.href = book.url || "#";

    // Show the modal (assuming modal is hidden by default)
    modal.classList.remove("hidden");
};

// Function to close the modal
const closeModal = () => {
    document.getElementById("bookModal").classList.add("hidden");
};

// Close modal when clicking outside the modal
document.getElementById("bookModal").addEventListener("click", (event) => {
    if (event.target === event.currentTarget) {
        closeModal();
    }
});

// Call the function to fetch and populate books for "This Week"
fetchBooksForThisWeek();
