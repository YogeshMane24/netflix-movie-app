const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c';
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;
const HORROR_API = `https://api.themoviedb.org/3/discover/movie?with_genres=27&api_key=${API_KEY}`;
const COMEDY_API = `https://api.themoviedb.org/3/discover/movie?with_genres=35&api_key=${API_KEY}`;
const ROMANCE_API = `https://api.themoviedb.org/3/discover/movie?with_genres=10749&api_key=${API_KEY}`;
const CRIME_API = `https://api.themoviedb.org/3/discover/movie?with_genres=80&api_key=${API_KEY}`;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const openBtn = document.querySelector('.open-btn');
const closeBtn = document.querySelector('.close-btn');
const navs = document.querySelectorAll('.nav');
const categoryLinks = document.querySelectorAll(".list li a");

// Open navigation menu with animation (white → red → black)
openBtn.addEventListener('click', () => {
    navs.forEach((nav, index) => {
        setTimeout(() => {
            nav.classList.add('visible');
        }, index * 200); // Delayed transition effect for layers
    });
});

// Close navigation menu with animation
closeBtn.addEventListener('click', () => {
    navs.forEach((nav, index) => {
        setTimeout(() => {
            nav.classList.remove('visible');
        }, (navs.length - index - 1) * 200); // Reverse delay effect for smooth closing
    });
});

// Fetch movies based on category selection
categoryLinks.forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default link behavior
        navs.forEach(navEl => navEl.classList.remove('visible')); // Close navigation after selection

        const category = event.target.textContent.trim().toLowerCase();
        let apiUrl;

        switch (category) {
            case "home":
                apiUrl = API_URL;
                break;
            case "horror":
                apiUrl = HORROR_API;
                break;
            case "comedy":
                apiUrl = COMEDY_API;
                break;
            case "romance":
                apiUrl = ROMANCE_API;
                break;
            case "crime":
                apiUrl = CRIME_API;
                break;
            default:
                apiUrl = API_URL;
        }
        getMovies(apiUrl);
    });
});

// Fetch and display movies
async function getMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    showMovies(data.results);
}

getMovies(API_URL);

// Function to round ratings to nearest 0.5 and remove trailing zero
function roundToHalf(value) {
    let rounded = Math.round(value * 2) / 2;
    return rounded % 1 === 0 ? rounded.toFixed(1) : rounded.toString();
}

// Display movies in the UI
function showMovies(movies) {
    main.innerHTML = '';
    if (movies.length === 0) {
        main.innerHTML = '<div id="no-results">No results found</div>';
        return;
    }
    movies.forEach(movie => {
        const { title, poster_path, vote_average, overview } = movie;
        const roundedVote = roundToHalf(vote_average); // Apply rounding

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span>${roundedVote}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                <p>${overview}</p>
            </div>
        `;
        main.appendChild(movieEl);
    });
}

// Handle movie search
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value;
    if (searchTerm) {
        getMovies(SEARCH_API + searchTerm);
        search.value = '';
    }
});
