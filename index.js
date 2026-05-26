const movieInput = document.getElementById("movie-input")
const searchBtn = document.getElementById("search-btn")
const movieEl =  document.getElementById("movie-el")
const apiKey = "e578ea9"
const placeholder = document.getElementById("placeholder")

searchBtn.addEventListener("click", handleSearch)

async function handleSearch() {
    placeholder.innerHTML  = `<p>Loading...</p>`
    searchBtn.classList.add("wait")

    try {
        if(movieInput.value !== "") {
            const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${movieInput.value}`)
            const data = await res.json()
    
            if(data.Response === "False") {
                throw Error(data.Error)
            }
            console.log(data)
            searchBtn.classList.remove("wait")
            movieEl.innerHTML = getMovieHtml(data)
        } else {
            searchBtn.classList.remove("wait")
            placeholder.innerHTML = "<p>Unable to find what you're looking for. Please try another search.</p>"
        }
        
    } catch (err) {
        searchBtn.classList.remove("wait")
        placeholder.innerHTML = `<p class="error">${err.message}</p>`
        console.log(err)
    }
}

function getMovieHtml(data) {
    let movieHtml = `
    <div class="movie">
        <img class="poster" src="${data.Poster}" alt="movie poster">
        <div class="movie-info">
            <div class="info-top">
                <h2 class="title">${data.Title}</h2>
                <img  class="star-icon" src="images/rating-icon.png" alt="rating icon">
                <p>${data.imdbRating}</p>
            </div>
            <div class="info-middle">
                <p>${data.Runtime}</p>
                <p>${data.Genre}</p>
                <div class="add-watchlist">
                    <button class="plus-btn">+</button>
                    <p>Watchlist</p>
                </div>
            </div>
            <p class="plot">${data.Plot}</p>
        </div>
    </div>
    <hr>
    `
    return movieHtml
}
