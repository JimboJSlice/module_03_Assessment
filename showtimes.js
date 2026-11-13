import { cinemas } from "./cinemas.js";

function getShowtimes(movieId) {
  const today = new Date();

  const movieOffset = Number(movieId) % cinemas.length;

  const selectedCinemas = [
    cinemas[movieOffset],
    cinemas[(movieOffset + 1) % cinemas.length],
  ];

  const times = [
    ["13:00", "16:30", "19:45"],
    ["12:30", "15:45", "18:30", "21:15"],
    ["14:00", "17:00", "20:00"],
  ];

  const screenings = selectedCinemas.map((cinema, index) => {
    const cinemaIndex = cinemas.findIndex((item) => item.id === cinema.id);

    return {
      cinema: cinema,

      dates: [0, 1, 2].map((dayOffset) => {
        const screeningDate = new Date(today);

        screeningDate.setDate(today.getDate() + dayOffset);

        return {
          date: screeningDate,
          times: times[(cinemaIndex + index) % times.length],
        };
      }),
    };
  });

  return screenings;
}

export function displayShowtimes(movieId) {
  const watchInSection = document.createElement("div");

  watchInSection.classList.add("watch-in-section");

  const heading = document.createElement("h3");
  heading.innerText = "Watch In";

  const notice = document.createElement("p");

  watchInSection.append(heading, notice);

  const screenings = getShowtimes(movieId);

  screenings.forEach((screening) => {
    const cinemaElement = document.createElement("div");

    cinemaElement.classList.add("cinema-showing");

    const cinemaName = document.createElement("h4");
    cinemaName.innerText = screening.cinema.name;

    const cinemaAddress = document.createElement("p");
    cinemaAddress.innerText = screening.cinema.address;

    const cinemaWebsite = document.createElement("a");

    cinemaWebsite.href = screening.cinema.website;
    cinemaWebsite.innerText = "Cinema website";
    cinemaWebsite.target = "_blank";
    cinemaWebsite.rel = "noopener noreferrer";

    cinemaElement.append(cinemaName, cinemaAddress, cinemaWebsite);

    screening.dates.forEach((screeningDay) => {
      const dateHeading = document.createElement("p");

      dateHeading.classList.add("screening-date");

      dateHeading.innerText = screeningDay.date.toLocaleDateString("en-IE", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      const timesContainer = document.createElement("div");

      timesContainer.classList.add("screening-times");

      screeningDay.times.forEach((time) => {
        const timeElement = document.createElement("span");

        timeElement.classList.add("screening-time");

        timeElement.innerText = time;

        timesContainer.append(timeElement);
      });

      cinemaElement.append(dateHeading, timesContainer);
    });

    watchInSection.append(cinemaElement);
  });

  return watchInSection;
}
