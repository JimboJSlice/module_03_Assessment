# Cine.ie – JavaScript Assignment

## Description

Cine.ie is a movie discovery and search website built using HTML, CSS and JavaScript, integrated with The Movie Database (TMDB) API.

The website allows users to discover movies currently playing in Irish cinemas, search for specific films and view additional information, including movie ratings, genres, release dates, runtime and descriptions.

Users can also add movies to a personal watchlist, which is saved locally in their browser. Each movie has a dedicated popup displaying its information and a **Watch In** section containing cinema details and example screening times.

The project was designed with an Irish audience in mind, using Ireland-specific movie information and cinema locations.

## Features

- **Movie Search:** Search for movies by title using TMDB's movie search API.
- **Now Playing:** Automatically displays movies currently playing in Ireland.
- **Genre Filtering:** Dynamically filter the Now Playing movies by genre.
- **Movie Details:** Click on a movie to open a popup containing additional information, including:
  - Movie title
  - Release date
  - TMDB rating
  - Runtime
  - Genres
  - Movie description
  - Movie poster
- **Watch In:** Displays cinema information, including cinema names, addresses, websites and example screening times.
- **Watchlist:** Add and remove movies from a personal watchlist.
- **Local Storage:** Watchlist information is saved using the browser's localStorage, so saved movies remain available when the user revisits the website in the same browser.
- **Responsive Design:** The layout adjusts for different screen sizes, including desktop and mobile devices.

## Tech Stack

- **JavaScript:** Handles API requests, movie rendering, search functionality, filtering, modal interactions and watchlist management.
- **TMDB API:** Provides movie information, search results, genres, ratings, posters and now-playing data.
- **HTML5:** Provides the structure and content of the website.
- **CSS3:** Handles styling, layout, responsive design and interactive hover effects.
- **Browser localStorage:** Stores the user's watchlist locally.

## Project Structure

The JavaScript functionality is separated into multiple files to make the code easier to organise, maintain and understand.

| File | Purpose |
|---|---|
| `index.html` | Main structure and content of the website. |
| `style.css` | Website styling, movie grid, modal and responsive layouts. |
| `script.js` | Main JavaScript file responsible for TMDB API requests, searching, genre filtering, movie cards and movie details. |
| `watchlist.js` | Handles adding, removing, retrieving and saving movies in localStorage. |
| `cinemas.js` | Contains an array of cinema information, including names, locations, addresses and websites. |
| `showtimes.js` | Generates and displays example screening dates and times for the cinemas. |

JavaScript modules are used to import and export functionality between files. This keeps the main script organised and allows functionality to be reused where required.

## How It Works

### 1. Movie Search

Users can enter a movie title into the search bar.

JavaScript captures the search input and sends a request to TMDB's movie search endpoint:

`/search/movie`

The search request includes the Irish region (`IE`) and the language setting (`en-IE`).

The API returns matching movie results, which JavaScript uses to dynamically generate movie cards on the page.

### 2. Now Playing in Ireland

When the website loads, JavaScript automatically requests the latest movies currently playing in cinemas.

This uses TMDB's now-playing endpoint:

`/movie/now_playing`

The request includes `region=IE` to return cinema releases for Ireland.

The returned movie information is stored in a JavaScript array and displayed in a responsive grid.

### 3. Genre Filtering

The website retrieves available movie genres using TMDB's genre list endpoint:

`/genre/movie/list`

These genres are dynamically added to the genre dropdown.

When a user selects a genre, JavaScript filters the existing Now Playing movie array using each movie's genre IDs.

The results are then updated without making another movie search request.

### 4. Movie Details Popup

When a user clicks on a movie card, JavaScript retrieves additional information using the movie's unique TMDB ID.

The request uses the following endpoint:

`/movie/{movie_id}`

The returned information is displayed in a popup, including the movie's poster, title, release date, rating, runtime, genres and description.

The popup can be closed using the close button, by clicking outside the popup or by pressing the Escape key.

### 5. Watch In – Cinemas and Showtimes

The Watch In section displays cinema information and example screening times for each movie.

Cinema details are stored separately in `cinemas.js` as an array of objects. Each cinema contains information such as its name, cinema chain, city, address, Eircode, website and available facilities.

The `showtimes.js` file imports the cinema array and uses it to generate screening information.

The example screening data includes:
- Two cinema locations per movie.
- Three days of example screening dates.
- Multiple example screening times for each cinema.

**Note:** Cinema details and screening times are currently sample data. The screening times are generated using JavaScript and are not retrieved from live cinema booking systems or an external showtimes API. They are included to demonstrate how cinema and screening information could be displayed.

### 6. Watchlist

Users can add or remove movies from their personal watchlist using the button on each movie card.

The watchlist functionality is managed separately in `watchlist.js`.

The browser's localStorage is used to save movie information as JSON data.

## Running the Project

The website can be accessed directly through the deployed GitHub Pages link.

## Future Improvements

There are several features that could be introduced to improve the website further:

- **Live Cinema Showtimes:** Integrate an appropriate cinema API or data source to retrieve real-time screening information and cinema availability in Ireland.
- **Movie Trailers:** Use TMDB's video endpoint to retrieve and display movie trailers within the movie details popup.
- **Cinema Search:** Allow users to search and filter cinemas by location or county.
- **Improved Watchlist:** Introduce user accounts and cloud-based storage so watchlists can be accessed across multiple devices.

## Deployment

The website is deployed using GitHub Pages.

## Live Site

[https://jimbojslice.github.io/module_03_Assessment/](https://jimbojslice.github.io/module_03_Assessment/)

## Author

**JimboJSlice**