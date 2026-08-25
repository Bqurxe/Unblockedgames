/* ==========================================================================
   TABLE OF CONTENTS
   1. Password Protection
   2. DOM Elements
   3. State
   4. Config
   5. Init
   6. Event Listeners
   7. Rendering
       7.1 Trending Games
       7.2 Filtering
       7.3 Game Grid
       7.4 Game Card Factory
   8. Modal Controls
   9. Utilities
   ========================================================================== */


/* ==========================================================================
   1. PASSWORD PROTECTION
   ========================================================================== */

const PASSWORD = '1230';
const MAX_ATTEMPTS = 5;
let passwordAttempts = MAX_ATTEMPTS;
let isPasswordCorrect = false;

// Check if password was already entered in this session
window.addEventListener('beforeunload', () => {
    if (isPasswordCorrect) {
        sessionStorage.setItem('gameAccessGranted', 'true');
    }
});

// Restore access if user had already entered password
window.addEventListener('load', () => {
    if (sessionStorage.getItem('gameAccessGranted') === 'true') {
        isPasswordCorrect = true;
        unlockGames();
    }
});

function setupPasswordProtection() {
    const passwordInput = document.getElementById('passwordInput');
    const submitPasswordBtn = document.getElementById('submitPasswordBtn');
    const passwordError = document.getElementById('passwordError');
    const attemptsCounter = document.getElementById('attemptsCounter');
    const passwordForm = document.getElementById('passwordForm');
    const lockedMessage = document.getElementById('lockedMessage');
    const resetBtn = document.getElementById('resetBtn');

    // Submit on button click
    submitPasswordBtn.addEventListener('click', checkPassword);

    // Submit on Enter key
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });

    // Reset button
    resetBtn.addEventListener('click', () => {
        passwordAttempts = MAX_ATTEMPTS;
        attemptsCounter.textContent = passwordAttempts;
        lockedMessage.style.display = 'none';
        passwordForm.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();
        passwordError.style.display = 'none';
    });

    function checkPassword() {
        const inputPassword = passwordInput.value;

        if (inputPassword === PASSWORD) {
            isPasswordCorrect = true;
            sessionStorage.setItem('gameAccessGranted', 'true');
            unlockGames();
            passwordError.style.display = 'none';
        } else {
            passwordAttempts--;
            attemptsCounter.textContent = passwordAttempts;

            if (passwordAttempts <= 0) {
                // Lock the access
                passwordForm.style.display = 'none';
                lockedMessage.style.display = 'block';
                passwordError.style.display = 'none';
            } else {
                // Show error message
                passwordError.style.display = 'block';
                passwordError.textContent = `❌ Incorrect password. ${passwordAttempts} attempt${passwordAttempts !== 1 ? 's' : ''} remaining.`;
                passwordInput.value = '';
                passwordInput.focus();
            }
        }
    }
}

function unlockGames() {
    const passwordModal = document.getElementById('passwordModal');
    const mainContent = document.getElementById('mainContent');

    passwordModal.classList.remove('active');
    mainContent.style.display = 'block';

    // Initialize games after modal is hidden
    loadGames();
    setupEventListeners();
}


/* ==========================================================================
   2. DOM ELEMENTS
   ========================================================================== */

const gamesList = document.getElementById('gamesList');
const trendingList = document.getElementById('trendingList');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');

const modal = document.getElementById('gameModal');
const closeBtn = document.querySelector('.close-btn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const gameFrame = document.getElementById('gameFrame');
const modalGameTitle = document.getElementById('modalGameTitle');
const modalGameCategory = document.getElementById('modalGameCategory');

const noResults = document.getElementById('noResults');


/* ==========================================================================
   3. STATE
   ========================================================================== */

let allGames = [];
let filteredGames = [];
let currentFilter = 'all';
let currentSearchTerm = '';


/* ==========================================================================
   4. CONFIG
   ========================================================================== */

// IDs of games featured in the "Trending" section.
// NOTE: these reference IDs in the current games.json (1-12).
const trendingGameIds = [12, 7, 5, 2, 9, 8];


/* ==========================================================================
   5. INIT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    setupPasswordProtection();
});

// Fetch game data and perform the initial render
async function loadGames() {
    try {
        const response = await fetch('games.json');
        const data = await response.json();

        allGames = data.games;
        filteredGames = [...allGames];

        renderTrendingGames();
        renderGames();
    } catch (error) {
        console.error('Error loading games:', error);
        gamesList.innerHTML = '<p class="error">Failed to load games. Please refresh the page.</p>';
    }
}


/* ==========================================================================
   6. EVENT LISTENERS
   ========================================================================== */

function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        filterAndRenderGames();
    });

    // Category filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            filterAndRenderGames();
        });
    });

    // Modal: close button
    closeBtn.addEventListener('click', closeModal);

    // Modal: click outside content to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Modal: Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Modal: fullscreen toggle
    fullscreenBtn.addEventListener('click', toggleFullscreen);
}


/* ==========================================================================
   7. RENDERING
   ========================================================================== */

/* --- 7.1 Trending Games --- */

function renderTrendingGames() {
    trendingList.innerHTML = '';

    const trendingGames = allGames.filter(game => trendingGameIds.includes(game.id));

    trendingGames.forEach(game => {
        const gameCard = createGameCard(game, true);
        trendingList.appendChild(gameCard);
    });
}

/* --- 7.2 Filtering --- */

function filterAndRenderGames() {
    filteredGames = allGames.filter(game => {
        const matchesSearch =
            game.title.toLowerCase().includes(currentSearchTerm) ||
            game.description.toLowerCase().includes(currentSearchTerm);

        const matchesFilter =
            currentFilter === 'all' || game.category === currentFilter;

        return matchesSearch && matchesFilter;
    });

    renderGames();
}

/* --- 7.3 Game Grid --- */

function renderGames() {
    gamesList.innerHTML = '';

    if (filteredGames.length === 0) {
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';

    filteredGames.forEach(game => {
        const gameCard = createGameCard(game, false);
        gamesList.appendChild(gameCard);
    });
}

/* --- 7.4 Game Card Factory --- */

function createGameCard(game, isTrending = false) {
    const card = document.createElement('div');
    card.className = 'game-card';

    const trendingBadgeHTML = isTrending
        ? '<span class="trending-badge">🔥 Trending</span>'
        : '';

    card.innerHTML = `
        ${trendingBadgeHTML}
        <div class="game-thumbnail">${game.emoji}</div>
        <div class="game-info">
            <h3 class="game-title">${game.title}</h3>
            <span class="game-category">${capitalizeCategory(game.category)}</span>
            <p class="game-description">${game.description}</p>
            <button class="game-btn">Play Now</button>
        </div>
    `;

    card.querySelector('.game-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(game);
    });

    return card;
}


/* ==========================================================================
   8. MODAL CONTROLS
   ========================================================================== */

function openModal(game) {
    modalGameTitle.textContent = game.title;
    modalGameCategory.textContent = capitalizeCategory(game.category);
    gameFrame.src = game.iframeUrl;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    gameFrame.src = '';
    document.body.style.overflow = 'auto';
}

function toggleFullscreen() {
    if (gameFrame.requestFullscreen) {
        gameFrame.requestFullscreen();
    } else if (gameFrame.webkitRequestFullscreen) {
        gameFrame.webkitRequestFullscreen();
    } else if (gameFrame.msRequestFullscreen) {
        gameFrame.msRequestFullscreen();
    }
}


/* ==========================================================================
   9. UTILITIES
   ========================================================================== */

function capitalizeCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Enable smooth scrolling site-wide
document.documentElement.style.scrollBehavior = 'smooth';
