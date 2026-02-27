document.addEventListener("DOMContentLoaded", function () {

const API_KEY = "af631d4b194ea4562c90098dc0ab6b9c";
const heroBtn = document.querySelector(".hero-btn");
heroBtn.addEventListener("click", openLogin);
const hero = document.querySelector(".hero");
const moviesGrid = document.getElementById("moviesGrid");
const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const loginForm = document.getElementById("loginForm");

let bgIndex = 0;
let backgrounds = [];

/* HERO BACKGROUND */

let heroBg1 = document.createElement("div");
let heroBg2 = document.createElement("div");

heroBg1.className = "hero-bg";
heroBg2.className = "hero-bg";

hero.appendChild(heroBg1);
hero.appendChild(heroBg2);

let activeBg = heroBg1;
let nextBg = heroBg2;

async function loadHero() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`);
        const data = await res.json();
        backgrounds = data.results.slice(0, 6);

        setHeroBackground();
        setInterval(setHeroBackground, 7000);
    } catch (err) {
        console.log("Hero load error:", err);
    }
}

function setHeroBackground() {
    if (!backgrounds.length) return;

    const movie = backgrounds[bgIndex];

    const imageUrl =
        `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;

    // preload image before switching
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
        nextBg.style.backgroundImage = `url(${imageUrl})`;

        nextBg.style.transition = "opacity 2s ease";
	activeBg.style.transition = "opacity 2s ease";

 	nextBg.style.opacity = 1;
        activeBg.style.opacity = 0;

        [activeBg, nextBg] = [nextBg, activeBg];
        bgIndex = (bgIndex + 1) % backgrounds.length;
    };
}

/* MOVIES */

async function loadMovies() {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
        );

        const data = await res.json();

        moviesGrid.innerHTML = "";

        data.results.forEach(movie => {
            if (!movie.poster_path) return;

            const div = document.createElement("div");
            div.className = "movie-card";

            div.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}">
                <button class="watch-btn">Watch Now</button>
            `;

            div.querySelector(".watch-btn").onclick =
                () => playTrailer(movie.id);

            moviesGrid.appendChild(div);
        });

    } catch (error) {
        console.log("Movie load error:", error);
    }
}

/* TRAILER */

async function playTrailer(id) {
    try {
        const res = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
        );

        const data = await res.json();
        const trailer = data.results.find(v => v.type === "Trailer");

        if (trailer) {
            document.getElementById("videoModal")
                .classList.remove("hidden");

            document.getElementById("videoFrame").src =
                `https://www.youtube.com/embed/${trailer.key}?autoplay=1`;
        }
    } catch (err) {
        console.log("Trailer error:", err);
    }
}

function closeVideo() {
    const modal = document.getElementById("videoModal");
    const frame = document.getElementById("videoFrame");

    modal.classList.add("hidden");
    frame.src = "";
}

/* LOGIN */

function openLogin() {
    loginModal.style.display = "flex";
}

function closeLogin() {
    loginModal.style.display = "none";
}

loginBtn.addEventListener("click", openLogin);

loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("cinevoraUser", name);

    closeLogin();
    showWelcome(name);
});

/* WELCOME */

function showWelcome(name) {

    const welcomeScreen = document.getElementById("welcomeScreen");
    const welcomeMain = document.getElementById("welcomeMain");

    welcomeMain.innerText = "WELCOME " + name.toUpperCase();

    welcomeScreen.style.display = "flex";

    setTimeout(() => {
        welcomeScreen.style.display = "none";

        hero.style.display = "none";
        updateNavbarUser(name);

    }, 3500);
}

function updateNavbarUser(name) {
    loginBtn.style.display = "none";

    const userName = document.getElementById("userName");
    userName.innerText = name;
    userName.classList.remove("hidden");
}

/* INIT */

loadHero();
loadMovies();

});

/* ================= VIDEO CLOSE FIX ================= */

document.addEventListener("DOMContentLoaded", function () {
    const closeBtn = document.getElementById("closeVideoBtn");

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            const modal = document.getElementById("videoModal");
            const frame = document.getElementById("videoFrame");

            modal.classList.add("hidden");
            frame.src = "";
        });
    }
});
