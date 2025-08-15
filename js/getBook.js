// import { getData } from "../store/fetchData.js";
// import { cardBookComponent } from "../components/cardBookComponent.js";

// const response = await getData("new");


//     const books = response.books;
//     const render_book = document.getElementById("book");
    
//     books.map((book) => {
//         render_book.innerHTML += cardBookComponent(book);
//     });
    
//     console.log(`Successfully rendered ${books.length} books`);

import { getData } from "../store/fetchData.js";
import { cardBookComponent } from "../components/cardBookComponent.js";

const response = await getData("new");

const books = response.books;
const render_book = document.getElementById("swipe-book");

// Limit to the first 3 books
const limitedBooks = books.slice(0, 3);

// Create container structure for one row with 3 columns
render_book.innerHTML = `
    <div class="py-12 bg-[#FFFFFF]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                ${limitedBooks.map((book) => cardBookComponent(book)).join('')}
            </div>
        </div>
    </div>
`;


// limitedBooks.map((book) => {
//     render_book.innerHTML += cardBookComponent(book);
// });

console.log(`Successfully rendered ${limitedBooks.length} books`);
