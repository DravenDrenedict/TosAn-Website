// favorites.js

// Function to get the favorite books from localStorage
function getFavorites() {
    return JSON.parse(localStorage.getItem('bookFavorites') || '[]');
}

// Function to display the books on the page
function displayFavorites() {
    const favoriteBooks = getFavorites();
    const favoriteBooksContainer = document.getElementById('favorite-books');

    if (favoriteBooks.length === 0) {
        favoriteBooksContainer.innerHTML = '<p class="text-center text-gray-500 col-span-4">No favorite books yet!</p>';
        return;
    }

    favoriteBooksContainer.innerHTML = ''; // Clear any existing content

    favoriteBooks.forEach(isbn => {
        // Fetch book data based on ISBN (using your API)
        fetch(`https://api.itbook.store/1.0/books/${isbn}`)
            .then(response => response.json())
            .then(book => {
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card', 'bg-white', 'rounded-lg', 'shadow-lg', 'overflow-hidden', 'transition-transform', 'duration-300', 'hover:scale-105');

                bookCard.innerHTML = `
                    <img src="${book.image}" alt="${book.title}" class="w-full h-64 object-cover">
                    <div class="p-4">
                        <h3 class="text-lg font-semibold text-gray-800 truncate">${book.title}</h3>
                        <p class="text-sm text-gray-600 truncate">${book.subtitle || ''}</p>
                        <button class="favorite-btn mt-3 px-4 py-2 bg-red-500 text-white rounded-full w-full hover:bg-red-600" data-isbn="${book.isbn13}">
                            <i class="fas fa-heart"></i> Remove from Favorites
                        </button>
                    </div>
                `;

                favoriteBooksContainer.appendChild(bookCard);

                // Add event listener to remove from favorites
                const favoriteBtn = bookCard.querySelector('.favorite-btn');
                favoriteBtn.addEventListener('click', function() {
                    removeFromFavorites(book.isbn13);
                });
            })
            .catch(error => {
                console.error('Error fetching book data:', error);
            });
    });
}

// Function to remove a book from favorites
function removeFromFavorites(isbn) {
    const favorites = getFavorites();
    const index = favorites.indexOf(isbn);
    if (index > -1) {
        favorites.splice(index, 1);
        localStorage.setItem('bookFavorites', JSON.stringify(favorites));
        displayFavorites(); // Re-render the favorites list
    }
}

// Call displayFavorites when the page loads
document.addEventListener('DOMContentLoaded', displayFavorites);
