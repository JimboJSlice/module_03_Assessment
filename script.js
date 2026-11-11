const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzAwMGM3MjUzYTg1Y2ZlNmRhYmJlMzVjZjUyODQ3NCIsIm5iZiI6MTc5MzI5MzA1NS45NTIsInN1YiI6IjZhZTM3YWZmMzllZDNjMWE0MjkyYWU0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KOszt2oLlw7XqUuaSXm68o5_gJTfuRJIunsHR92Twrg";
const API_URL = "https://api.themoviedb.org/3";
const OPTIONS = {
  headers: { Authorization: "Bearer " + API_KEY },
};
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const result = document.getElementById("result");
const statusText = document.getElementById("statusText");
const sectionTitle = document.getElementById("sectionTitle");
const genreSelect = document.getElementById("genreSelect");
const watchlistLink = document.getElementById("watchlistLink");
const watchlistCount = document.getElementById("watchlistCount");
const movieModal = document.getElementById("movieModal");
const modalMovieDetails = document.getElementById("modalMovieDetails");
const closeModal = document.getElementById("closeModal");

// Store movies and current page view
let nowPlayingMovies = [];
let currentMovies = [];
let currentView = "movies";

// Get movies currently playing in Ireland
function getNowPlaying() {
  currentView = "movies";

  statusText.innerText = "Loading movies...";
  sectionTitle.innerText = "Now Playing in Ireland";

  fetch(`${API_URL}/movie/now_playing?region=IE&language=en-IE`, OPTIONS)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not load movies.");
      }

      return response.json();
    })

    .then((data) => {
      nowPlayingMovies = data.results;

      displayMovies(nowPlayingMovies);

      statusText.innerText = `${data.total_results} movies found`;
    })

    .catch((error) => {
      console.log(error);
      statusText.innerText = "Something went wrong. Please try again.";
    });
}

// Get movie genres from TMDB
function getGenres() {
  fetch(`${API_URL}/genre/movie/list?language=en-IE`, OPTIONS)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not load genres.");
      }

      return response.json();
    })

    .then((data) => {
      data.genres.forEach((genre) => {
        const option = document.createElement("option");

        option.value = genre.id;
        option.innerText = genre.name;

        genreSelect.append(option);
      });
    })

    .catch((error) => {
      console.log(error);
    });
}

// Filter Now Playing movies by genre
function filterMoviesByGenre(genreId) {
  currentView = "movies";

  if (genreId === "") {
    displayMovies(nowPlayingMovies);

    sectionTitle.innerText = "Now Playing in Ireland";
    statusText.innerText = `${nowPlayingMovies.length} movies found`;
  } else {
    const filteredMovies = nowPlayingMovies.filter((movie) =>
      movie.genre_ids.includes(Number(genreId)),
    );

    displayMovies(filteredMovies);

    sectionTitle.innerText = "Now Playing in Ireland";
    statusText.innerText = `${filteredMovies.length} movies found`;
  }
}

// Search for movies
function searchMovies(movieName) {
  currentView = "movies";

  // Reset genre selection
  genreSelect.value = "";

  statusText.innerText = "Searching...";
  sectionTitle.innerText = `Search results for "${movieName}"`;

  fetch(
    `${API_URL}/search/movie?query=${encodeURIComponent(movieName)}&region=IE&language=en-IE`,
    OPTIONS,
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not search for movies.");
      }

      return response.json();
    })

    .then((data) => {
      displayMovies(data.results);

      statusText.innerText = `${data.total_results} movies found`;
    })

    .catch((error) => {
      console.log(error);
      statusText.innerText = "Something went wrong. Please try again.";
    });
}

// Get saved watchlist from localStorage
function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

// Save watchlist to localStorage
function saveWatchlist(watchlist) {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  updateWatchlistCount();
}

// Update watchlist number in navigation
function updateWatchlistCount() {
  const watchlist = getWatchlist();

  watchlistCount.innerText = watchlist.length;
}

// Add or remove a movie from the watchlist
function toggleWatchlist(movie) {
  let watchlist = getWatchlist();

  const movieExists = watchlist.some(
    (savedMovie) => savedMovie.id === movie.id,
  );

  if (movieExists) {
    watchlist = watchlist.filter((savedMovie) => savedMovie.id !== movie.id);
  } else {
    watchlist.push(movie);
  }

  saveWatchlist(watchlist);

  // Refresh the current movie list or watchlist
  if (currentView === "watchlist") {
    displayMovies(getWatchlist());

    statusText.innerText = `${getWatchlist().length} saved movies`;
  } else {
    displayMovies(currentMovies);
  }
}

// Open watchlist
function showWatchlist() {
  currentView = "watchlist";

  sectionTitle.innerText = "My Watchlist";

  const watchlist = getWatchlist();

  displayMovies(watchlist);

  statusText.innerText = `${watchlist.length} saved movies`;
}

// Display movies on the page
// TO DO - Remove information as it's now in pop-up and redesign page
function displayMovies(movies) {
  currentMovies = movies;

  result.innerHTML = "";

  if (!movies || movies.length === 0) {
    result.innerHTML = "<p>No movies found.</p>";
  } else {
    movies.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("movie-row");

      movieElement.style.cursor = "pointer";

      movieElement.addEventListener("click", function () {
        getMovieDetails(movie.id);
      });

      // Movie poster
      const poster = document.createElement("img");
      poster.classList.add("movie-poster");

      if (movie.poster_path) {
        poster.src = IMAGE_URL + movie.poster_path;
      }

      poster.alt = `${movie.title} poster`;
      poster.loading = "lazy";

      // Movie information
      const movieInfo = document.createElement("div");
      movieInfo.classList.add("movie-info");

      // Movie title
      const title = document.createElement("h2");
      title.innerText = movie.title;

      // Release date
      const releaseDate = document.createElement("p");
      releaseDate.classList.add("movie-date");
      releaseDate.innerText = `Release date: ${movie.release_date || "Unknown"}`;

      // Movie rating
      const rating = document.createElement("p");
      rating.classList.add("movie-rating");
      rating.innerText = `Rating: ${Number(movie.vote_average || 0).toFixed(1)}/10`;

      // Movie description
      const description = document.createElement("p");
      description.classList.add("movie-description");
      description.innerText = movie.overview || "No description available.";

      // Watchlist button
      const watchlistButton = document.createElement("button");
      watchlistButton.classList.add("watchlist-button");

      const watchlist = getWatchlist();

      const movieSaved = watchlist.some(
        (savedMovie) => savedMovie.id === movie.id,
      );

      if (movieSaved) {
        watchlistButton.innerText = "Remove from Watchlist";
      } else {
        watchlistButton.innerText = "+ Add to Watchlist";
      }

      watchlistButton.addEventListener("click", function (event) {
        event.stopPropagation();

        toggleWatchlist(movie);
      });

      // Add information to movie
      movieInfo.append(
        title,
        releaseDate,
        rating,
        description,
        watchlistButton,
      );

      movieElement.append(poster, movieInfo);

      result.append(movieElement);
    });
  }
}

// Search form event listener
searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const movieName = searchInput.value.trim();

  if (movieName === "") {
    genreSelect.value = "";

    getNowPlaying();
  } else {
    searchMovies(movieName);
  }
});

// Genre selection event listener
genreSelect.addEventListener("change", function () {
  const genreId = genreSelect.value;

  // Clear search input
  searchInput.value = "";

  filterMoviesByGenre(genreId);
});

// Watchlist navigation event listener
watchlistLink.addEventListener("click", function (event) {
  event.preventDefault();

  showWatchlist();
});

// Get more information about a movie
function getMovieDetails(movieId) {
  modalMovieDetails.innerHTML = "<p>Loading movie details...</p>";
  movieModal.classList.add("active");

  fetch(`${API_URL}/movie/${movieId}?language=en-IE`, OPTIONS)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Could not load movie details.");
      }

      return response.json();
    })

    .then((movie) => {
      modalMovieDetails.innerHTML = "";

      // Movie header
      const movieHeader = document.createElement("div");
      movieHeader.classList.add("modal-movie-header");

      // Poster
      const poster = document.createElement("img");
      poster.classList.add("modal-movie-poster");

      if (movie.poster_path) {
        poster.src = IMAGE_URL + movie.poster_path;
      }

      poster.alt = `${movie.title} poster`;

      // Movie information
      const movieInfo = document.createElement("div");
      movieInfo.classList.add("modal-movie-info");

      const title = document.createElement("h2");
      title.innerText = movie.title;

      const releaseDate = document.createElement("p");
      releaseDate.innerText = `Release date: ${movie.release_date || "Unknown"}`;

      const rating = document.createElement("p");
      rating.innerText = `Rating: ${Number(movie.vote_average || 0).toFixed(1)}/10`;

      const runtime = document.createElement("p");
      runtime.innerText = `Runtime: ${movie.runtime ? movie.runtime + " minutes" : "Unknown"}`;

      const genres = document.createElement("p");
      genres.innerText = `Genres: ${movie.genres.map((genre) => genre.name).join(", ") || "Unknown"}`;

      const status = document.createElement("p");
      status.innerText = `Status: ${movie.status || "Unknown"}`;

      movieInfo.append(title, releaseDate, rating, runtime, genres, status);

      movieHeader.append(poster, movieInfo);

      // Movie overview
      const overview = document.createElement("p");
      overview.classList.add("modal-movie-overview");
      overview.innerText = movie.overview || "No description available.";

      modalMovieDetails.append(movieHeader, overview);
    })

    .catch((error) => {
      console.log(error);
      modalMovieDetails.innerText =
        "Unable to load movie details. Please try again.";
    });
}

// Close popup using close button
closeModal.addEventListener("click", function () {
  movieModal.classList.remove("active");
});

// Close popup by clicking outside the content
movieModal.addEventListener("click", function (event) {
  if (event.target === movieModal) {
    movieModal.classList.remove("active");
  }
});

// Close popup using Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    movieModal.classList.remove("active");
  }
});

// Load genres and movies when the page opens
getGenres();
getNowPlaying();
updateWatchlistCount();
