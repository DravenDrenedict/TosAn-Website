export const newbook = (book) => {
  return `
    <div class="transform hover:scale-105 transition-transform duration-500 ease-in-out" data-aos="flip-left">
      <div class="relative shadow-lg rounded-lg overflow-hidden bg-[#803030] p-4">
        
        <!-- Book Image with Frame -->
        <div class="relative bg-white p-2 rounded-lg shadow-inner">
          <!-- Heart button positioned on book cover -->
          <div class="heart-btn absolute top-4 right-4 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer
                      bg-gray-200 bg-opacity-80 hover:bg-white transition-all duration-300">
            <span class="text-gray-600 text-sm hover:text-red-500 transition-colors duration-300">♥</span>
          </div>
          <img src="${book.image}" alt="${book.title}" class="w-full h-64 object-cover rounded-md md:h-72 lg:h-80">
        </div>
        
        <!-- Book Details -->
        <div class="mt-4 text-white">
          <h3 class="text-lg font-semibold truncate md:text-xl">${book.title}</h3>
          <p class="text-gray-200 text-sm md:text-base opacity-90">${book.subtitle}</p>
          <p class="text-yellow-300 font-bold text-lg mt-2">${book.price}</p>
          
          <!-- View Details Button -->
          <button onclick="openModal('${book.isbn13}')" 
                  class="mt-3 w-full text-white px-6 py-2 rounded-lg 
                         border-2 border-gray-400 border-opacity-50 hover:border-white hover:bg-white hover:text-[#803030] 
                         hover:scale-105 transition-all duration-300 ease-in-out font-medium">
            View Details
          </button>
        </div>
      </div>
    </div>
  `;
};

// Function to open the modal and fetch book details
function openModal(isbn) {
  document.getElementById('bookModal').classList.remove('hidden');
  document.getElementById('bookModal').classList.add('flex');

  // Fetch the book details using the ISBN
  fetchBookDetails(isbn);
}

// Function to fetch book details from the API
async function fetchBookDetails(isbn) {
  try {
    const response = await fetch(`https://api.itbook.store/1.0/books/${isbn}`);
    const data = await response.json();

    document.getElementById('modalBookImage').src = data.image;
    document.getElementById('modalBookTitle').textContent = data.title;
    document.getElementById('modalBookAuthors').textContent = `Authors: ${data.authors}`;
    document.getElementById('modalBookPublisher').textContent = `Publisher: ${data.publisher}`;
    document.getElementById('modalBookYear').textContent = `Year: ${data.year}`;
    document.getElementById('modalBookPages').textContent = `Pages: ${data.pages}`;
    document.getElementById('modalBookDescription').textContent = data.desc;

    document.getElementById('buyButton').textContent = `Buy ($${data.price.split(' ')[1]})`;
    document.getElementById('readMoreButton').href = data.url;
  } catch (error) {
    console.error("Error fetching book details:", error);
  }
}

// Function to close the modal
function closeModal() {
  document.getElementById('bookModal').classList.remove('flex');
  document.getElementById('bookModal').classList.add('hidden');
}
