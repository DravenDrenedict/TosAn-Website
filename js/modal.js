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

        // Populate the modal with the fetched data
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
