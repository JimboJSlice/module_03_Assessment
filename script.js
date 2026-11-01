const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MzAwMGM3MjUzYTg1Y2ZlNmRhYmJlMzVjZjUyODQ3NCIsIm5iZiI6MTc5MzI5MzA1NS45NTIsInN1YiI6IjZhZTM3YWZmMzllZDNjMWE0MjkyYWU0MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KOszt2oLlw7XqUuaSXm68o5_gJTfuRJIunsHR92Twrg';
const API_URL = 'https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-UK&page=1&query=';
const OPTIONS = {
  headers: { Authorization: 'Bearer ' + API_KEY }
};
const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';

const input = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const result = document.getElementById("result");
const statusMessage = document.getElementById("statusText");

function renderMovieProperties(movieData) {
    const div = document.createElement('div');
    div.classList.add('result');
    const img = document.createElement('img');
    img.src = IMAGE_URL + movieData.poster_path;
    const title = document.createElement('h2');
    title.innerText = movieData.title;
    const description = document.createElement('p');
    description.innerText = movieData.overview;
    const date = document.createElement('h3');
    date.innerText = movieData.release_date;
    const rating = document.createElement('p');
    rating.innerText = 'Rating: ' + movieData.vote_average + '/10';
    div.append(img, title, description, date, rating);
    result.append(div);
}

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();
  const movieName = input.value.trim();
  try {
    const response = await fetch(API_URL + encodeURIComponent(movieName), OPTIONS);
    const body = await response.json();
    result.innerHTML = ''; 
       if (body.results.length > 0) {
            body.results.forEach(movie => {
                renderMovieProperties(movie);
            });
            statusMessage.innerText =
                `Found ${body.total_results} movies`;
        } else {
            statusMessage.innerText = 'No movies found';
        }
      } catch (error) {

        console.error(error);
        statusMessage.innerText = error.message;
    }
});