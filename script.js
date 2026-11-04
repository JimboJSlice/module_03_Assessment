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

// Store the original Now Playing movies
let nowPlayingMovies = [];

// Get movies currently playing in Ireland
function getNowPlaying() {
  statusText.innerText = "Loading movies...";
  sectionTitle.innerText = "Now Playing in Ireland";

  fetch(`${API_URL}/movie/now_playing?region=IE&language=en-IE`, OPTIONS)
    .then((response) => response.json())

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
    .then((response) => response.json())

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
  // Reset genre selection
  genreSelect.value = "";

  statusText.innerText = "Searching...";
  sectionTitle.innerText = `Search results for "${movieName}"`;

  fetch(
    `${API_URL}/search/movie?query=${encodeURIComponent(movieName)}&region=IE&language=en-IE`,
    OPTIONS,
  )
    .then((response) => response.json())

    .then((data) => {
      displayMovies(data.results);

      statusText.innerText = `${data.total_results} movies found`;
    })

    .catch((error) => {
      console.log(error);
      statusText.innerText = "Something went wrong. Please try again.";
    });
}

// Display movies on the page
function displayMovies(movies) {
  result.innerHTML = "";

  if (!movies || movies.length === 0) {
    result.innerHTML = "<p>No movies found.</p>";
  } else {
    movies.forEach((movie) => {
      const movieElement = document.createElement("div");
      movieElement.classList.add("movie-row");

      // Movie poster
      const poster = document.createElement("img");
      poster.classList.add("movie-poster");

      if (movie.poster_path) {
        poster.src = IMAGE_URL + movie.poster_path;
      }

      poster.alt = movie.title;
      poster.loading = "lazy";

      // Movie information
      const movieInfo = document.createElement("div");
      movieInfo.classList.add("movie-info");

      // Movie title
      const title = document.createElement("h2");
      title.innerText = movie.title;

      // Release date
      const releaseDate = document.createElement("p");
      releaseDate.innerText = `Release date: ${movie.release_date || "Unknown"}`;

      // Movie rating
      const rating = document.createElement("p");
      rating.innerText = `Rating: ${Number(movie.vote_average || 0).toFixed(1)}/10`;

      // Movie description
      const description = document.createElement("p");
      description.innerText = movie.overview || "No description available.";

      // Add information to the movie
      movieInfo.append(title, releaseDate, rating, description);

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

  // Clear search input when selecting a genre
  searchInput.value = "";

  filterMoviesByGenre(genreId);
});

// Load genres and movies when the page opens
getGenres();
getNowPlaying();
