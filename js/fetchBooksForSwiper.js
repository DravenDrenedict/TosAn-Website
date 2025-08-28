// Function to fetch books and populate the Swiper slider
export const fetchBooksForSwiper = async () => {
    try {
        // Fetch books from the API (you can change the endpoint based on your needs)
        const response = await fetch("https://api.itbook.store/1.0/new");
        const data = await response.json();

        if (data.books && data.books.length > 0) {
            populateSwiper(data.books); // Populate the swiper with the books
        } else {
            console.log("No books found.");
        }
    } catch (error) {
        console.error("Error fetching books:", error);
    }
};

// Function to populate the Swiper with books
const populateSwiper = (books) => {
    const swiperWrapper = document.getElementById("swiper-wrapper");

    // Loop through each book and create a swiper slide
    books.forEach(book => {
        const slide = document.createElement("div");
        slide.classList.add("swiper-slide");

        // Create the book card structure dynamically
        slide.innerHTML = `
            <div class="group cursor-pointer relative">
                <div class="aspect-[3/4] bg-[#803030] rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                    <a href="#" class="book-details-button"> 
                        <img src="${book.image}" alt="${book.title}" class="w-full h-full object-cover">
                    </a>
                </div>
                <p class="mt-3 text-center text-sm font-medium text-gray-800">${book.title}</p>
                <!-- View Details Button (Hidden by default) -->
                <button class="view-details-btn absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Details
                </button>
            </div>
        `;
        
        // Add click event listener to open the modal on "View Details" button click
        const viewDetailsButton = slide.querySelector(".view-details-btn");
        viewDetailsButton.addEventListener("click", (e) => {
            e.stopPropagation();  // Prevent swiper's click event from firing
            openModal(book);      // Open modal with book details
        });

        // Append the slide to the swiper wrapper
        swiperWrapper.appendChild(slide);
    });

    // Initialize Swiper after dynamically adding the slides
    initializeSwiper();
};

// Function to initialize the Swiper instance
const initializeSwiper = () => {
    const swiper = new Swiper('.bookSwiper', {
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,  // Show 2 slides on small screens
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 3,  // Show 3 slides on medium screens
                spaceBetween: 20,
            },
            1024: {
                slidesPerView: 5,  // Show 5 slides on large screens
                spaceBetween: 30,
            },
        }
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

// Call the function to fetch and populate books when the page loads
fetchBooksForSwiper();
