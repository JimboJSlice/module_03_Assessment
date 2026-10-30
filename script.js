const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzAwMGM3MjUzYTg1Y2ZlNmRhYmJlMzVjZjUyODQ3NCIsIm5iZiI6MTc5MzI5MzA1NS45NTIsInN1YiI6IjZhZTM3YWZmMzllZDNjMWE0MjkyYWU0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KOszt2oLlw7XqUuaSXm68o5_gJTfuRJIunsHR92Twrg';
const API_URL = 'https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1&query=';
const OPTIONS = {
  headers: { Authorization: 'Bearer ' + API_KEY }
};

const input = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const result = document.getElementById("result");
const statusMessage = document.getElementById("statusText");

function renderMovieProperties(movieData) {
    result.innerHTML = '';
    
    const div = document.createElement('div');
    div.classList.add('result');
    const h2 = document.createElement('h2');
    h2.innerText = movieData.title;
    div.append(h2);
    result.append(div);
}

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  console.log("Search triggered");

const movieName = input.value.trim();

const response = await fetch(API_URL + encodeURIComponent(movieName), OPTIONS);
const body = await response.json();

const movieData = body.results[0];

renderMovieProperties(movieData);
console.log(movieData);
});