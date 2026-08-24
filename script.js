/* ==========================================================================
   TABLE OF CONTENTS
   1. DOM Elements
   2. State
   3. Config
   4. Init
   5. Event Listeners
   6. Rendering
      6.1 Trending Games
      6.2 Filtering
      6.3 Game Grid
      6.4 Game Card Factory
   7. Modal Controls
   8. Utilities
   ========================================================================== */


/* ==========================================================================
   1. DOM ELEMENTS
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
   2. STATE
   ========================================================================== */

let allGames = [];
let filteredGames = [];
let currentFilter = 'all';
let currentSearchTerm = '';


/* ==========================================================================
   3. CONFIG
   ========================================================================== */

// IDs of games featured in the "Trending" section.
// NOTE: these reference IDs in the current games.json (1-12).
const trendingGameIds = [12, 7, 5, 2, 9, 8];


/* ==========================================================================
   4. INIT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    setupEventListeners();
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
   5. EVENT LISTENERS
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
   6. RENDERING
   ========================================================================== */

/* --- 6.1 Trending Games --- */

function renderTrendingGames() {
    trendingList.innerHTML = '';

    const trendingGames = allGames.filter(game => trendingGameIds.includes(game.id));

    trendingGames.forEach(game => {
        const gameCard = createGameCard(game, true);
        trendingList.appendChild(gameCard);
    });
}

/* --- 6.2 Filtering --- */

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

/* --- 6.3 Game Grid --- */

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

/* --- 6.4 Game Card Factory --- */

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
   7. MODAL CONTROLS
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
   8. UTILITIES
   ========================================================================== */

function capitalizeCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Enable smooth scrolling site-wide
document.documentElement.style.scrollBehavior = 'smooth';
