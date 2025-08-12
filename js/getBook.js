import { getData } from "../store/fetchData.js";
import { cardBookComponent } from "../components/cardBookComponent.js";

const response = await getData("new");


    const books = response.books;
    const render_book = document.getElementById("book");
    
    books.map((book) => {
        render_book.innerHTML += cardBookComponent(book);
    });
    
    console.log(`Successfully rendered ${books.length} books`);