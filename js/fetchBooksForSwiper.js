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
            <div class="group cursor-pointer">
                <div class="aspect-[3/4] bg-[#803030] rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                    <a href="${book.url}"> 
                        <img src="${book.image}" alt="${book.title}" class="w-full h-full object-cover">
                    </a>
                </div>
                <p class="mt-3 text-center text-sm font-medium text-gray-800">${book.title}</p>
            </div>
        `;
        
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

// Call the function to fetch and populate books when the page loads
fetchBooksForSwiper();
