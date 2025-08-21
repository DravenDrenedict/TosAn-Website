// Global variables
let currentBooks = [];
let currentPage = 1;
let isLoading = false;
let currentQuery = '';
let favorites = JSON.parse(localStorage.getItem('bookFavorites') || '[]');
let searchTimeout;

// API Base URL
const API_BASE = 'https://api.itbook.store/1.0';

// DOM Elements
const booksGrid = document.getElementById('booksGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const favCount = document.getElementById('favCount');
const loading = document.getElementById('loading');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    updateFavoriteCount();
    loadNewBooks();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Search input with debounce
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length >= 2) {
            searchTimeout = setTimeout(() => {
                showSearchSuggestions(query);
            }, 300);
        } else {
            hideSearchSuggestions();
        }
    });

    // Hide search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchSuggestions();
        }
    });

    // Enter key search
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchBooks();
        }
    });
}

// Show loading spinner
function showLoading() {
    if (loading) {
        loading.classList.remove('hidden');
    }
    isLoading = true;
}

// Hide loading spinner
function hideLoading() {
    if (loading) {
        loading.classList.add('hidden');
    }
    isLoading = false;
}

// Load new books (default view)
async function loadNewBooks() {
    if (isLoading) return;
    
    try {
        showLoading();
        updateFilterButtons('new');
        currentQuery = 'new';
        currentPage = 1;
        
        const response = await fetch(`${API_BASE}/new`);
        const data = await response.json();
        
        if (data && data.books) {
            currentBooks = data.books;
            displayBooks(currentBooks, true);
        } else {
            showError('No new books found');
        }
    } catch (error) {
        console.error('Error loading new books:', error);
        showError('Failed to load new books');
    } finally {
        hideLoading();
    }
}

// Search books by query
async function searchByQuery(query) {
    if (isLoading) return;
    
    try {
        showLoading();
        updateFilterButtons(query);
        currentQuery = query;
        currentPage = 1;
        
        const response = await fetch(`${API_BASE}/search/${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data && data.books && data.books.length > 0) {
            currentBooks = data.books;
            displayBooks(currentBooks, true);
        } else {
            showError(`No books found for "${query}"`);
        }
    } catch (error) {
        console.error('Error searching books:', error);
        showError('Failed to search books');
    } finally {
        hideLoading();
    }
}

// Search books from search bar
function searchBooks() {
    const query = searchInput.value.trim();
    if (query) {
        searchByQuery(query);
        hideSearchSuggestions();
    }
}

// Show search suggestions
async function showSearchSuggestions(query) {
    try {
        const response = await fetch(`${API_BASE}/search/${encodeURIComponent(query)}`);
        const data = await response.json();
        
        if (data && data.books && data.books.length > 0) {
            const suggestions = data.books.slice(0, 5); // Show only first 5 suggestions
            displaySearchSuggestions(suggestions);
        } else {
            hideSearchSuggestions();
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        hideSearchSuggestions();
    }
}

// Display search suggestions
function displaySearchSuggestions(books) {
    if (!searchResults) return;
    
    searchResults.innerHTML = '';
    searchResults.classList.remove('hidden');
    
    books.forEach(book => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200';
        suggestionItem.innerHTML = `
            <img src="${book.image}" alt="${book.title}" class="w-12 h-16 object-cover rounded mr-3">
            <div class="flex-1">
                <h4 class="font-medium text-gray-800 text-sm truncate">${book.title}</h4>
                <p class="text-xs text-gray-600 truncate">${book.subtitle || 'IT Book'}</p>
                <p class="text-xs text-green-600 font-medium">${book.price}</p>
            </div>
        `;
        
        suggestionItem.addEventListener('click', () => {
            openBookDetail(book.isbn13);
            hideSearchSuggestions();
            searchInput.value = book.title;
        });
        
        searchResults.appendChild(suggestionItem);
    });
}

// Hide search suggestions
function hideSearchSuggestions() {
    if (searchResults) {
        searchResults.classList.add('hidden');
    }
}

// Display books in grid
function displayBooks(books, clearGrid = false) {
    if (!booksGrid) return;
    
    if (clearGrid) {
        booksGrid.innerHTML = '';
    }
    
    if (!books || books.length === 0) {
        if (clearGrid) {
            booksGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-book text-6xl text-gray-300 mb-4"></i>
                    <h3 class="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
                    <p class="text-gray-500">Try searching for different keywords</p>
                </div>
            `;
        }
        return;
    }
    
    books.forEach((book, index) => {
        const bookCard = createBookCard(book, index);
        booksGrid.appendChild(bookCard);
    });
    
    // Show/hide load more button based on results
    if (books.length >= 10 && loadMoreBtn) {
        loadMoreBtn.classList.remove('hidden');
    } else if (loadMoreBtn) {
        loadMoreBtn.classList.add('hidden');
    }
}

// Create book card element
function createBookCard(book, index) {
    const isFavorite = favorites.includes(book.isbn13);
    
    const card = document.createElement('div');
    card.className = 'book-card card-hover bg-white rounded-xl shadow-md overflow-hidden';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index % 5) * 100);
    
    card.innerHTML = `
        <div class="relative group cursor-pointer" onclick="openBookDetail('${book.isbn13}')">
            <div class="aspect-[3/4] overflow-hidden">
                <img 
                    src="${book.image}" 
                    alt="${book.title}" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik03NSA5MEg3NVY5MFoiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjwvdGc+Cjwvc3ZnPg=='"
                >
            </div>
            
            <!-- Favorite Button -->
            <button 
                onclick="toggleFavorite('${book.isbn13}', event)" 
                class="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white'}"
            >
                <i class="fas fa-heart text-sm"></i>
            </button>
            
            <!-- Price Badge -->
            ${book.price && book.price !== '$0.00' ? `
                <div class="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    ${book.price}
                </div>
            ` : ''}
            
            <!-- Overlay on hover -->
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button class="bg-white text-[#803030] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    View Details
                </button>
            </div>
        </div>
        
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
    `;
    
    return card;
}

// Toggle favorite
function toggleFavorite(isbn13, event) {
    if (event) {
        event.stopPropagation();
    }
    
    const index = favorites.indexOf(isbn13);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(isbn13);
    }
    
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
    updateFavoriteCount();
    
    // Update the heart icon
    const heartBtn = event?.target.closest('button');
    if (heartBtn) {
        const isFavorite = favorites.includes(isbn13);
        heartBtn.className = `absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isFavorite ? 'bg-red-500 text-white' : 'bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white'}`;
    }
}

// Update favorite count
function updateFavoriteCount() {
    if (favCount) {
        favCount.textContent = favorites.length;
    }
}

// Show favorites
async function toggleFavorites() {
    if (favorites.length === 0) {
        showError('No favorite books yet');
        return;
    }
    
    try {
        showLoading();
        updateFilterButtons('favorites');
        
        const favoriteBooks = [];
        
        // Fetch details for each favorite book
        for (const isbn of favorites) {
            try {
                const response = await fetch(`${API_BASE}/books/${isbn}`);
                const bookData = await response.json();
                if (bookData && bookData.title) {
                    favoriteBooks.push(bookData);
                }
            } catch (error) {
                console.error(`Error fetching book ${isbn}:`, error);
            }
        }
        
        currentBooks = favoriteBooks;
        displayBooks(favoriteBooks, true);
        
        if (favoriteBooks.length === 0) {
            showError('Could not load favorite books');
        }
        
    } catch (error) {
        console.error('Error loading favorites:', error);
        showError('Failed to load favorites');
    } finally {
        hideLoading();
    }
}

// Open book detail page
function openBookDetail(isbn13) {
    // Store the book data for the detail page
    localStorage.setItem('selectedBookISBN', isbn13);
    window.open(`../html/book-detail.html?isbn=${isbn13}`, '_blank');
}

// Load more books (pagination simulation)
function loadMoreBooks() {
    if (isLoading || currentBooks.length < 10) return;
    
    // Since the API doesn't have pagination, we'll simulate it by showing a message
    const loadMoreMessage = document.createElement('div');
    loadMoreMessage.className = 'col-span-full text-center py-8';
    loadMoreMessage.innerHTML = `
        <p class="text-gray-600 mb-4">That's all for now!</p>
        <button onclick="loadNewBooks()" class="bg-[#803030] text-white px-6 py-2 rounded-full hover:bg-[#4d1d1d] transition-colors">
            Browse New Books
        </button>
    `;
    
    booksGrid.appendChild(loadMoreMessage);
    loadMoreBtn.classList.add('hidden');
}

// Update filter buttons active state
function updateFilterButtons(activeFilter) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.classList.add('bg-gray-200', 'text-gray-700');
        btn.classList.remove('bg-[#803030]', 'text-white');
    });
    
    // Find and activate the correct button
    let activeBtn = null;
    if (activeFilter === 'new') {
        activeBtn = document.querySelector('.filter-btn[onclick="loadNewBooks()"]');
    } else if (activeFilter === 'favorites') {
        // No specific button for favorites, but update title
        updateSectionTitle('Your Favorite Books', 'Books you\'ve marked as favorites');
        return;
    } else {
        activeBtn = document.querySelector(`.filter-btn[onclick="searchByQuery('${activeFilter}')"]`);
    }
    
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-[#803030]', 'text-white');
        activeBtn.classList.remove('bg-gray-200', 'text-gray-700');
    }
    
    // Update section title based on filter
    let title = 'Featured Books';
    let subtitle = 'Discover the latest and most popular programming books';
    
    if (activeFilter === 'new') {
        title = 'New Releases';
        subtitle = 'Latest books in programming and technology';
    } else if (activeFilter !== 'favorites') {
        title = `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Books`;
        subtitle = `Books related to ${activeFilter}`;
    }
    
    updateSectionTitle(title, subtitle);
}

// Update section title
function updateSectionTitle(title, subtitle) {
    const titleElement = document.querySelector('#featuredBooks h2');
    const subtitleElement = document.querySelector('#featuredBooks p');
    
    if (titleElement) titleElement.textContent = title;
    if (subtitleElement) subtitleElement.textContent = subtitle;
}

// Show error message
function showError(message) {
    if (booksGrid) {
        booksGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-exclamation-triangle text-6xl text-red-400 mb-4"></i>
                <h3 class="text-xl font-semibold text-gray-700 mb-2">Oops!</h3>
                <p class="text-gray-600 mb-4">${message}</p>
                <button onclick="loadNewBooks()" class="bg-[#803030] text-white px-6 py-2 rounded-full hover:bg-[#4d1d1d] transition-colors">
                    Try Again
                </button>
            </div>
        `;
    }
    
    if (loadMoreBtn) {
        loadMoreBtn.classList.add('hidden');
    }
}

// Smooth scroll to section
function scrollToCategories() {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
        categoriesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Format price display
function formatPrice(price) {
    if (!price || price === '$0.00') return 'Free';
    return price;
}

// Function to toggle favorite books
function toggleFavorite(isbn, event) {
    event.stopPropagation(); // Prevent propagation if needed

    const favorites = JSON.parse(localStorage.getItem('bookFavorites') || '[]');
    const index = favorites.indexOf(isbn);

    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
    } else {
        // Add to favorites
        favorites.push(isbn);
    }

    // Save favorites to localStorage
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));

    // Update the UI (favorite button)
    updateFavoriteButton(isbn);

    // Update the favorites count
    document.getElementById('favCount').textContent = favorites.length;
}

// Function to update the favorite button state dynamically
function updateFavoriteButton(isbn) {
    const favoriteBtn = document.querySelector(`[data-isbn="${isbn}"]`);
    const isFavorite = JSON.parse(localStorage.getItem('bookFavorites') || '[]').includes(isbn);

    if (favoriteBtn) {
        // Update button text and class
        favoriteBtn.querySelector('span').textContent = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
        favoriteBtn.classList.toggle('bg-red-600', isFavorite);
        favoriteBtn.classList.toggle('text-white', isFavorite);
    }
}


// Add CSS for line clamping
const style = document.createElement('style');
style.textContent = `
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .book-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .book-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    @media (max-width: 640px) {
        .search-container {
            display: none;
        }
        
        .hero-gradient h1 {
            font-size: 2.5rem;
        }
        
        .hero-gradient p {
            font-size: 1rem;
        }
    }
`;
document.head.appendChild(style);