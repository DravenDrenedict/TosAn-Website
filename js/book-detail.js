// Global variables
let currentBook = null;
let favorites = JSON.parse(localStorage.getItem('bookFavorites') || '[]');

// API Base URL
const API_BASE = 'https://api.itbook.store/1.0';

// DOM Elements
const loading = document.getElementById('loading');
const errorState = document.getElementById('errorState');
const bookContent = document.getElementById('bookContent');
const favoriteBtn = document.getElementById('favoriteBtn');
const favoriteText = document.getElementById('favoriteText');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const isbn = urlParams.get('isbn') || localStorage.getItem('selectedBookISBN');
    
    if (isbn) {
        loadBookDetails(isbn);
    } else {
        showError();
    }
});

// Load book details from API
async function loadBookDetails(isbn) {
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE}/books/${isbn}`);
        const data = await response.json();
        
        if (data && data.title) {
            currentBook = data;
            displayBookDetails(data);
            loadRelatedBooks();
            updateFavoriteButton();
        } else {
            showError();
        }
    } catch (error) {
        console.error('Error loading book details:', error);
        showError();
    } finally {
        hideLoading();
    }
}

// Display book details
function displayBookDetails(book) {
    // Update page title
    document.title = `${book.title} - TOSAN Digital Library`;
    
    // Book cover and basic info
    document.getElementById('bookImage').src = book.image;
    document.getElementById('bookImage').alt = book.title;
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookSubtitle').textContent = book.subtitle || '';
    
    // Price
    if (book.price && book.price !== '$0.00') {
        document.getElementById('bookPrice').textContent = book.price;
        document.getElementById('priceTag').classList.remove('hidden');
    }
    
    // Rating
    displayRating(book.rating);
    
    // Meta information
    document.getElementById('bookAuthors').textContent = book.authors || 'Unknown';
    document.getElementById('bookPublisher').textContent = book.publisher || 'Unknown';
    document.getElementById('bookISBN13').textContent = book.isbn13 || 'N/A';
    document.getElementById('bookPages').textContent = book.pages ? `${book.pages} pages` : 'N/A';
    document.getElementById('bookYear').textContent = book.year || 'N/A';
    
    // Description
    document.getElementById('bookDescription').innerHTML = book.desc || 'No description available for this book.';
    
    // URLs
    if (book.url) {
        document.getElementById('bookUrl').href = book.url;
        document.getElementById('pdfUrl').href = book.url;
    } else {
        document.getElementById('bookUrl').style.display = 'none';
        document.getElementById('pdfUrl').style.display = 'none';
    }
    
    // Show content
    bookContent.classList.remove('hidden');
}

// Display rating stars
function displayRating(rating) {
    const ratingStars = document.getElementById('ratingStars');
    const ratingText = document.getElementById('ratingText');
    
    if (!rating || rating === '0') {
        ratingStars.innerHTML = '<span class="text-gray-400 text-sm">No rating available</span>';
        ratingText.textContent = '';
        return;
    }
    
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star rating-stars"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt rating-stars"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star rating-stars-empty"></i>';
    }
    
    ratingStars.innerHTML = starsHTML;
    ratingText.textContent = `${rating}/5`;
}

// Load related books
async function loadRelatedBooks() {
    if (!currentBook) return;
    
    try {
        // Extract keywords from title for related book search
        const keywords = extractKeywords(currentBook.title);
        const searchTerm = keywords[0] || 'programming'; // Use first keyword or fallback
        
        const response = await fetch(`${API_BASE}/search/${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        
        if (data && data.books) {
            // Filter out current book and limit to 4 books
            const relatedBooks = data.books
                .filter(book => book.isbn13 !== currentBook.isbn13)
                .slice(0, 4);
            
            displayRelatedBooks(relatedBooks);
        }
    } catch (error) {
        console.error('Error loading related books:', error);
    }
}

// Extract keywords from book title
function extractKeywords(title) {
    // Common words to exclude
    const excludeWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    
    return title
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove punctuation
        .split(' ')
        .filter(word => word.length > 2 && !excludeWords.includes(word))
        .slice(0, 3); // Take first 3 meaningful words
}

// Display related books
function displayRelatedBooks(books) {
    const relatedBooksContainer = document.getElementById('relatedBooks');
    
    if (!books || books.length === 0) {
        relatedBooksContainer.innerHTML = `
            <div class="col-span-full text-center py-8">
                <p class="text-gray-600">No related books found</p>
            </div>
        `;
        return;
    }
    
    relatedBooksContainer.innerHTML = '';
    
    books.forEach((book, index) => {
        const bookCard = createRelatedBookCard(book, index);
        relatedBooksContainer.appendChild(bookCard);
    });
}

// Create related book card
function createRelatedBookCard(book, index) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', index * 100);
    
    card.innerHTML = `
        <div class="aspect-[3/4] overflow-hidden">
            <img 
                src="${book.image}" 
                alt="${book.title}" 
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjNGNEY2Ii8+CjwvZWc+'"
            >
        </div>
        <div class="p-4">
            <h3 class="font-semibold text-gray-800 text-sm mb-2 line-clamp-2" title="${book.title}">
                ${book.title}
            </h3>
            <p class="text-xs text-gray-600 mb-2 line-clamp-1" title="${book.subtitle || ''}">
                ${book.subtitle || ''}
            </p>
            <div class="flex items-center justify-between">
                <span class="text-green-600 font-semibold text-sm">
                    ${book.price && book.price !== '$0.00' ? book.price : 'Free'}
                </span>
                <button class="text-[#803030] hover:text-[#4d1d1d] text-xs">
                    View Details
                </button>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.open(`../html/book-detail.html?isbn=${book.isbn13}`, '_self');
    });
    
    return card;
}

// Show loading state
function showLoading() {
    loading.classList.remove('hidden');
    errorState.classList.add('hidden');
    bookContent.classList.add('hidden');
}

// Hide loading state
function hideLoading() {
    loading.classList.add('hidden');
}

// Show error state
function showError() {
    hideLoading();
    errorState.classList.remove('hidden');
    bookContent.classList.add('hidden');
}

// Toggle favorite
function toggleFavorite() {
    if (!currentBook) return;
    
    const isbn = currentBook.isbn13;
    const index = favorites.indexOf(isbn);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(isbn);
    }
    
    localStorage.setItem('bookFavorites', JSON.stringify(favorites));
    updateFavoriteButton();
    
    // Show notification
    showNotification(
        favorites.includes(isbn) ? 'Added to favorites!' : 'Removed from favorites!'
    );
}

// Update favorite button state
function updateFavoriteButton() {
    if (!currentBook || !favoriteBtn || !favoriteText) return;
    
    const isFavorite = favorites.includes(currentBook.isbn13);
    
    if (isFavorite) {
        favoriteBtn.classList.add('bg-red-600', 'hover:bg-red-700');
        favoriteBtn.classList.remove('hover:bg-[#4d1d1d]');
        favoriteText.textContent = 'Remove from Favorites';
        favoriteBtn.querySelector('i').classList.add('text-white');
    } else {
        favoriteBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
        favoriteBtn.classList.add('hover:bg-[#4d1d1d]');
        favoriteText.textContent = 'Add to Favorites';
        favoriteBtn.querySelector('i').classList.remove('text-white');
    }
}

// Download book
function downloadBook() {
    if (!currentBook || !currentBook.url) {
        showNotification('Download not available for this book', 'error');
        return;
    }
    
    // Open the book URL in a new tab
    window.open(currentBook.url, '_blank');
    showNotification('Opening book in new tab...');
}

// Share book
async function shareBook() {
    if (!currentBook) return;
    
    const shareData = {
        title: currentBook.title,
        text: `Check out this book: ${currentBook.title}${currentBook.subtitle ? ' - ' + currentBook.subtitle : ''}`,
        url: window.location.href
    };
    
    // Check if Web Share API is supported
    if (navigator.share) {
        try {
            await navigator.share(shareData);
        } catch (error) {
            if (error.name !== 'AbortError') {
                copyToClipboard();
            }
        }
    } else {
        copyToClipboard();
    }
}

// Copy to clipboard fallback
function copyToClipboard() {
    const textToCopy = `${currentBook.title} - ${window.location.href}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Link copied to clipboard!');
        }).catch(() => {
            fallbackCopyTextToClipboard(textToCopy);
        });
    } else {
        fallbackCopyTextToClipboard(textToCopy);
    }
}

// Fallback copy method
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Link copied to clipboard!');
    } catch (err) {
        showNotification('Failed to copy link', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-20 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300 ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Go back function
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '../index.html';
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // ESC key to go back
    if (e.key === 'Escape') {
        goBack();
    }
    
    // F key to toggle favorite
    if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFavorite();
    }
    
    // S key to share
    if (e.key === 's' || e.key === 'S') {
        if (e.ctrlKey || e.metaKey) return; // Don't interfere with save
        e.preventDefault();
        shareBook();
    }
});

// Add line clamp utility styles
const style = document.createElement('style');
style.textContent = `
    .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
    
    .book-cover-shadow:hover {
        transform: scale(1.02);
        transition: transform 0.3s ease;
    }
    
    @media (max-width: 768px) {
        .container {
            padding-left: 1rem;
            padding-right: 1rem;
        }
        
        #bookTitle {
            font-size: 2rem;
        }
        
        .grid.grid-cols-1.lg\\:grid-cols-2 {
            gap: 2rem;
        }
        
        .w-80 {
            width: 16rem;
        }
    }
    
    @media (max-width: 640px) {
        .flex.flex-wrap.gap-4 {
            flex-direction: column;
        }
        
        .flex.flex-wrap.gap-4 > * {
            width: 100%;
            text-align: center;
            justify-content: center;
        }
        
        .grid.grid-cols-1.md\\:grid-cols-2 {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);

// Handle image load errors
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgdmlld0JveD0iMCAwIDIwMCAyNjciIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY3IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMzLjVMMTAwIDEzMy41WiIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiLz4KPHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5Q0EzQUYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';
        });
    });
});