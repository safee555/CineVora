const API_KEY = "af631d4b194ea4562c90098dc0ab6b9c";
const IMG = "https://image.tmdb.org/t/p/w500";

/* ================= HERO ================= */

async function loadHero() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
        const data = await res.json();

        let index = 0;

        setInterval(() => {
            const movie = data.results[index];
            if (movie.backdrop_path) {
                document.getElementById("hero").style.backgroundImage =
                    `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
                document.getElementById("heroTitle").innerText = movie.title;
            }
            index = (index + 1) % data.results.length;
        }, 4000);

    } catch (err) {
        console.log("Hero error:", err);
    }
}

/* ================= LOGIN MODAL ================= */

function openLogin() {
    document.getElementById("loginModal").style.display = "flex";
}

/* ================= LOGIN PROCESS ================= */

function login() {

    const name = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!name || !email) {
        alert("Please enter Full Name and Email");
        return;
    }

    // Close modal
    document.getElementById("loginModal").style.display = "none";

    // Hide hero button
    const heroBtn = document.querySelector(".hero-btn");
    if (heroBtn) heroBtn.style.display = "none";

    // Change navbar button to username
    const loginBtn = document.getElementById("loginBtn");
    loginBtn.innerText = name;
    loginBtn.onclick = toggleDropdown;

    // Welcome animation
    const welcome = document.getElementById("welcomeScreen");
    const welcomeText = document.getElementById("welcomeText");

    welcomeText.innerText = name;
    welcome.style.display = "flex";

    setTimeout(() => {
        welcome.style.display = "none";
        document.getElementById("content").classList.remove("hidden");
        loadMovies();
    }, 3000);
}

/* ================= DROPDOWN ================= */

function toggleDropdown() {
    document.getElementById("userDropdown").classList.toggle("hidden");
}

function logout() {
    location.reload();
}

/* ================= LOAD MOVIES ================= */

async function loadMovies() {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`);
        const data = await res.json();

        const container = document.getElementById("movies");
        container.innerHTML = "";

        data.results.forEach(movie => {
            if (!movie.poster_path) return;

            const img = document.createElement("img");
            img.src = IMG + movie.poster_path;
            img.onclick = () => playTrailer(movie.id);
            container.appendChild(img);
        });

    } catch (err) {
        console.log("Movies error:", err);
    }
}

/* ================= TRAILER ================= */

async function playTrailer(id) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`);
        const data = await res.json();

        const trailer = data.results.find(v =>
            v.type === "Trailer" && v.site === "YouTube"
        );

        if (!trailer) {
            alert("Trailer not available");
            return;
        }

        const modal = document.createElement("div");
        modal.className = "modal";
        modal.style.display = "flex";

        modal.innerHTML = `
            <div style="width:80%; max-width:900px;">
                <iframe width="100%" height="500"
                    src="https://www.youtube.com/embed/${trailer.key}?autoplay=1"
                    frameborder="0"
                    allowfullscreen>
                </iframe>
            </div>
        `;

        modal.onclick = () => modal.remove();
        document.body.appendChild(modal);

    } catch (err) {
        console.log("Trailer error:", err);
    }
}

loadHero();
