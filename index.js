const movieInput = document.getElementById("movie-input")
const searchBtn = document.getElementById("search-btn")
const movieEl =  document.getElementById("movie-el")
const watchlistMovieEl = document.getElementById("watchlist-movie-el")
const apiKey = "e578ea9"
const placeholder = document.getElementById("placeholder")

const  savedMovies = localStorage.getItem("movies")
let myWatchlist = savedMovies ? JSON.parse(savedMovies) : []


if(searchBtn) searchBtn.addEventListener("click", handleSearch)

async function handleSearch() {
    placeholder.innerHTML  = `<p>Loading...</p>`
    searchBtn.classList.add("wait")

    try {
        if(movieInput.value !== "") {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&t=${movieInput.value}`)
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

document.addEventListener("click", async (e) => {
    if(e.target.classList.contains("add-btn")){
        const movieId = e.target.dataset.movieId
        try {
            const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`)
            if(!res.ok) {
                throw new Error("Something wnet wrong.")
            }
    
            const data = await res.json()

            let hasMovie = false

            for(let movie of myWatchlist) {
                if(movie.movieId === movieId) {
                    hasMovie = true
                }
            }

            if(!hasMovie) {
                myWatchlist.push({
                movieId: data.imdbID,
                Poster: data.Poster,
                Title: data.Title,
                imdbRating: data.imdbRating,
                Runtime: data.Runtime,
                Genre: data.Genre,
                Plot: data.Plot,
                })

                localStorage.setItem("movies", JSON.stringify(myWatchlist))
                console.log(localStorage.getItem("movies"))
                console.log("Stored Successfully...")
                
            }
        } catch(err) {
            console.log(err)
        }     
    }

    if(e.target.classList.contains("remove-btn")) {
        const movieId = e.target.dataset.movieId
        console.log(movieId)

        const filterMovies = myWatchlist.filter(movie => movie.movieId !== movieId)
        localStorage.setItem("movies", JSON.stringify(filterMovies))
        location.reload()
    }
})

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
                    <button class="add-btn" data-movie-id=${data.imdbID}>+</button>
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

function getWatchlistHtml() {
    let movieHtml = ''

    if(myWatchlist.length === 0) {
        movieHtml = `
            <div class="movie-placeholder">
                <p class="wl-ph-p">Your watchlist is looking a little empty...</p>
                <div class="ph-bottom">
                    <a class="ph-a" href="index.html"><img class="add-icon" src="images/add-icon.png" alt="Add to watchlist icon"></a>
                    <p>Let's add some movies!</p>
            </div>
        `
    } else {
        for(let movie of myWatchlist) {
            movieHtml += `<div class="movie">
                    <img class="poster" src="${movie.Poster}" alt="movie poster">
                    <div class="movie-info">
                        <div class="info-top">
                            <h2 class="title">${movie.Title}</h2>
                            <img  class="star-icon" src="images/rating-icon.png" alt="rating icon">
                            <p>${movie.imdbRating}</p>
                        </div>
                        <div class="info-middle">
                            <p>${movie.Runtime}</p>
                            <p${movie.Genre}</p>
                            <div class="add-watchlist">
                                <button class="remove-btn" data-movie-id=${movie.movieId}>-</button>
                                <p>Watchlist</p>
                            </div>
                        </div>
                        <p class="plot">${movie.Plot}</p>
                    </div>
                </div>
                <hr>
            `
        }
    }
        watchlistMovieEl.innerHTML = movieHtml 
}

if(watchlistMovieEl) {
    getWatchlistHtml()
}