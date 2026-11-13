// Get watchlist from local storage
export function getWatchlist() {
  const watchlist = localStorage.getItem("watchlist");

  return watchlist ? JSON.parse(watchlist) : [];
}

// Save watchlist to local storage
export function saveWatchlist(watchlist) {
  localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

// Check if a movie is already in the watchlist
export function isMovieInWatchlist(movieId) {
  const watchlist = getWatchlist();

  return watchlist.some((movie) => movie.id === movieId);
}

// Add or remove a movie from the watchlist
export function toggleWatchlist(movie) {
  let watchlist = getWatchlist();

  if (isMovieInWatchlist(movie.id)) {
    watchlist = watchlist.filter((savedMovie) => savedMovie.id !== movie.id);
  } else {
    watchlist.push(movie);
  }

  saveWatchlist(watchlist);
  updateWatchlistCount();
}

// Update the watchlist counter in the navigation
export function updateWatchlistCount() {
  const watchlistCount = document.getElementById("watchlistCount");

  if (!watchlistCount) {
    return;
  }

  const watchlist = getWatchlist();

  watchlistCount.innerText = watchlist.length;
}
