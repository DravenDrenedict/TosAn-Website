export const cardBookComponent = (book) => {
    return `<div class="group cursor-pointer">
                            <div class="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                                <img src=${book.image}
                                     alt="Silver Blood" class="w-full h-full object-cover">
                            </div>
                            <p class="mt-3 text-center text-sm font-medium text-gray-800">${book.subtitle}</p>
                        </div>
                        <div class="py-12 bg-[#FFFFF]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <!-- Card Wrapper -->
            <div class="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">


            <div
                    class="flex bg-[#6B1D1D] text-white rounded-2xl p-4 hover:shadow-xl transition-all duration-300 cursor-pointer w-full">
                    <div class="w-1/3 min-w-[150px] max-w-[200px]">
                        <img src=${book.image} alt="Pride and Prejudice"
                            class="w-full h-full object-cover rounded-xl">
                    </div>
                    <div class="flex flex-col justify-between pl-4 flex-grow">
                        <div>
                            <h3 class="text-xl font-bold">Pride Prejudice</h3>
                            <p class="mt-2 text-sm">Get the latest book recommendation, reading tip, and exclusive
                                content delivered to your inbox</p>
                            <p class="mt-3 text-sm font-semibold">${book.title}</p>
                            <div class="flex items-center mt-2">
                                <span class="text-yellow-400 mr-2">★★★★★</span>
                                <span class="text-sm">28 reviews</span>
                            </div>
                        </div>
                        <div class="mt-4">
                            <button
                                class="text-sm font-medium bg-white text-[#6B1D1D] px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                                View
                            </button>
                        </div>
                    </div>
                </div>

                
    `
}