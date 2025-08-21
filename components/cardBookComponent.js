export const cardBookComponent = (book) => {
    return `
    <div class="w-full md:w-1/3">
        <div data-aos="flip-up" data-aos-delay="50"
            class="flex bg-[#6B1D1D] text-white rounded-2xl p-4 hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
            <div class="w-1/3 min-w-[150px] max-w-[200px]">
                <img src="${book.image}" alt="${book.title}"
                    class="w-full h-full object-cover rounded-xl">
            </div>
            <div class="flex flex-col justify-between pl-4 flex-grow">
                <div>
                    <h3 class="text-xl font-bold">${book.title}</h3>
                    <p class="mt-2 text-sm">${book.description || 'A great book to read'}</p>
                    <p class="mt-3 text-sm font-semibold">${book.author}</p>
                    <div class="flex items-center mt-2">
                        <span class="text-yellow-400 mr-2">★★★★★</span>
                        <span class="text-sm">${book.reviews || '28'} reviews</span>
                    </div>
                </div>
                <div class="mt-4">
                    <button onclick="openModal('${book.isbn13}')" 
                        class="text-sm font-medium bg-white text-[#6B1D1D] px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                        View
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
}
