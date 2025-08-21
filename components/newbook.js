export const newbook = (book, isFavorite) => {
  return `
    <div class="relative group cursor-pointer" onclick="openBookDetail('${book.isbn13}')">
        <!-- Book Image with Frame -->
        <div class="aspect-[3/4] overflow-hidden relative">
            <img 
                src="${book.image}" 
                alt="${book.title}" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA5MEg3NVY5MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjwvdGc+Cjwvc3ZnPg=='"
            >

            <!-- Favorite Button -->
            
            
            <!-- Price Badge -->
            ${book.price && book.price !== '$0.00' ? `
                <div class="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                    ${book.price}
                </div>
            ` : ''}
            
            <!-- Overlay on hover -->
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button onclick="openModal('${book.isbn13}')" class="bg-white text-[#803030] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    View Details
                </button>
            </div>
        </div>

        <!-- Book Details -->
        <div class="p-4">
            <h3 class="font-semibold text-gray-800 text-sm leading-tight mb-2 line-clamp-2" title="${book.title}">
                ${book.title}
            </h3>
            ${book.subtitle ? `
                <p class="text-xs text-gray-600 mb-2 line-clamp-2" title="${book.subtitle}">
                    ${book.subtitle}
                </p>
            ` : ''}
            <div class="flex items-center justify-between">
                <span class="text-xs text-gray-500">ISBN: ${book.isbn13}</span>
                ${book.url ? `
                    <a href="${book.url}" target="_blank" class="text-[#803030] hover:text-[#4d1d1d] text-xs">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                ` : ''}
            </div>
        </div>
    </div>
  `;
};

// Function to toggle favorite status and save to localStorage
function toggleFavorite(isbn, event) {
  event.stopPropagation(); // Prevent the card click event from firing

  let favorites = JSON.parse(localStorage.getItem('bookFavorites') || '[]');
  const index = favorites.indexOf(isbn);

  if (index > -1) {
    favorites.splice(index, 1); // Remove from favorites
  } else {
    favorites.push(isbn); // Add to favorites
  }

  localStorage.setItem('bookFavorites', JSON.stringify(favorites));

  // Re-render books with updated favorite state
  fetchBooks();
}

// Function to check if a book is in the favorites
function isFavorite(isbn) {
  let favorites = JSON.parse(localStorage.getItem('bookFavorites') || '[]');
  return favorites.includes(isbn);
}

// Function to fetch books and render them
async function fetchBooks() {
  const response = await fetch("https://api.itbook.store/1.0/new");
  const data = await response.json();

  if (data.books) {
    displayBooks(data.books);
  } else {
    console.log("No books found.");
  }
}

// Function to display books
const displayBooks = (books) => {
  const booksContainer = document.getElementById("book-container");
  booksContainer.innerHTML = ""; // Clear any existing books

  books.forEach(book => {
    const bookCard = newbook(book, isFavorite(book.isbn13));  // Pass favorite status
    booksContainer.innerHTML += bookCard;  // Append the book card to the container
  });
};

// Fetch and display books when the page loads
fetchBooks();
