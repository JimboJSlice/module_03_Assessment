const API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzAwMGM3MjUzYTg1Y2ZlNmRhYmJlMzVjZjUyODQ3NCIsIm5iZiI6MTc5MzI5MzA1NS45NTIsInN1YiI6IjZhZTM3YWZmMzllZDNjMWE0MjkyYWU0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KOszt2oLlw7XqUuaSXm68o5_gJTfuRJIunsHR92Twrg";
const API_URL = "https://api.themoviedb.org/3";
const OPTIONS = {
  headers: { Authorization: "Bearer " + API_KEY },
};
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const input = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const result = document.getElementById("result");
const statusMessage = document.getElementById("statusText");
const sectionTitle = document.getElementById("sectionTitle");

async function getNowPlaying() {
  try {
    statusMessage.innerText = "Loading movies...";
    sectionTitle.innerText = "Now Playing in Ireland";

    const params = new URLSearchParams({
      language: "en-IE",
      region: "IE",
      page: 1,
    });

    const response = await fetch(
      `${API_URL}/movie/now_playing?${params}`,
      OPTIONS,
    );

    if (!response.ok) {
      throw new Error(`TMDB error: ${response.status}`);
    }

    const body = await response.json();

    displayMovies(body.results);

    statusMessage.innerText = `${body.total_results} movies currently showing`;
  } catch (error) {
    console.error(error);
    statusMessage.innerText = error.message;
  }
}

async function searchMovies(movieName) {
  try {
    statusMessage.innerText = "Searching...";

    sectionTitle.innerText = `Search results for "${movieName}"`;

    const params = new URLSearchParams({
      query: movieName,
      language: "en-IE",
      region: "IE",
      include_adult: false,
      page: 1,
    });

    const response = await fetch(`${API_URL}/search/movie?${params}`, OPTIONS);

    if (!response.ok) {
      throw new Error(`TMDB error: ${response.status}`);
    }

    const body = await response.json();

    displayMovies(body.results);

    statusMessage.innerText = `${body.total_results} movies found`;
  } catch (error) {
    console.error(error);
    statusMessage.innerText = error.message;
  }
}

function displayMovies(movies) {
  // Clear previous movies
  result.innerHTML = "";

  if (!movies || movies.length === 0) {
    result.innerHTML = "<p>No movies found.</p>";
    return;
  }

  movies.forEach((movie) => {
    // Movie row
    const div = document.createElement("article");
    div.classList.add("movie-row");

    // Poster
    const img = document.createElement("img");
    img.classList.add("movie-poster");

    if (movie.poster_path) {
      img.src = IMAGE_URL + movie.poster_path;
    }

    img.alt = `${movie.title} poster`;
    img.loading = "lazy";

    // Movie information container
    const info = document.createElement("div");
    info.classList.add("movie-info");

    // Title
    const title = document.createElement("h2");
    title.innerText = movie.title;

    // Release date
    const date = document.createElement("p");
    date.classList.add("movie-date");
    date.innerText = movie.release_date
      ? `Release date: ${movie.release_date}`
      : "Release date unavailable";

    // Rating
    const rating = document.createElement("p");
    rating.classList.add("movie-rating");

    rating.innerText = `★ ${Number(movie.vote_average || 0).toFixed(1)}/10`;

    // Overview
    const description = document.createElement("p");
    description.classList.add("movie-description");

    description.innerText = movie.overview || "No description available.";

    // Assemble movie information
    info.append(title, date, rating, description);

    // Assemble movie row
    div.append(img, info);

    result.append(div);
  });
}

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const movieName = input.value.trim();

  if (movieName === "") {
    getNowPlaying();
  } else {
    searchMovies(movieName);
  }
});

// Load cinema listings when homepage opens
getNowPlaying();
