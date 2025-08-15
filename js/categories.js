// categories.js

import { getData } from '../store/fetchData.js'; // Importing getData from fetchData.js

let allBooks = [];

const fetchBooks = async () => {
  try {
    const data = await getData("new");  // Fetch books from the 'new' endpoint
    if (data.books) {
      allBooks = data.books;
      filterBooks('Fantasy'); // Show 'Fantasy' books by default
    } else {
      console.log("No books found.");
    }
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

const filterBooks = (category) => {
  const filteredBooks = allBooks.filter((book) => 
    book.title.toLowerCase().includes(category.toLowerCase()) || 
    (book.subtitle && book.subtitle.toLowerCase().includes(category.toLowerCase()))
  );

  document.getElementById("categoryTitle").textContent = category;

  let description = `Explore a selection of ${category} books`;
  if (category === "Fantasy") {
    description = "Discover amazing fantasy books";
  } else if (category === "Horror") {
    description = "Explore spine-chilling horror stories";
  } else if (category === "Romance") {
    description = "Dive into heartwarming romance books";
  } else if (category === "Sci-Fi") {
    description = "Blast off with thrilling sci-fi books";
  }
  document.getElementById("categoryDescription").textContent = description;

  renderBooks(filteredBooks);
};

const renderBooks = (books) => {
  const grid = document.getElementById("bookGrid");
  grid.innerHTML = ""; // Clear the grid

  if (books.length === 0) {
    grid.innerHTML = `<p>No books available for this category.</p>`;
    return;
  }

  console.log('Rendering books:', books);  // Log the books array

  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "transform hover:scale-105 transition duration-300 ease-in-out flex justify-center mb-[25px]";
    
    const bookLink = document.createElement("a");
    bookLink.href = `/html/detail/${book.isbn13}.html`; // Link to the book's detail page
    bookLink.className = "w-full";

    bookLink.innerHTML = `
      <div class="relative shadow-lg rounded-lg overflow-hidden bg-white w-[270px] max-w-sm" style="height: 400px;">
        <img src="${book.image}" alt="${book.title}" class="w-full h-[320px] object-cover">
        <div class="p-3">
          <h3 class="text-base font-semibold text-[#265073] text-center">${book.title}</h3>
          <p class="text-[15px] text-gray-500 mt-1 text-center">${book.subtitle || 'No subtitle available'}</p>
        </div>
      </div>
    `;

    card.appendChild(bookLink);  // Append the link to the card
    grid.appendChild(card);  // Append the card to the grid
  });
};

const testBooks = [
  {
    title: "Sample Book 1",
    subtitle: "A sample description",
    isbn13: "1234567890",
    image: "https://via.placeholder.com/270x320"
  },
  {
    title: "Sample Book 2",
    subtitle: "Another description",
    isbn13: "0987654321",
    image: "https://via.placeholder.com/270x320"
  }
];

renderBooks(testBooks);

const handleCategoryClick = (category) => {
  document.querySelectorAll(".category-btn").forEach((btn) => btn.classList.remove("active"));
  document.querySelector(`#category-${category}`).classList.add("active");
  filterBooks(category);
};

document.querySelector("#category-Fantasy").addEventListener("click", () => handleCategoryClick("Fantasy"));
document.querySelector("#category-Horror").addEventListener("click", () => handleCategoryClick("Horror"));
document.querySelector("#category-Romance").addEventListener("click", () => handleCategoryClick("Romance"));
document.querySelector("#category-SciFi").addEventListener("click", () => handleCategoryClick("Sci-Fi"));

document.addEventListener("DOMContentLoaded", fetchBooks);
