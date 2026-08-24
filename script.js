// DOM Elements
const gamesList = document.getElementById('gamesList');
const trendingList = document.getElementById('trendingList');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('gameModal');
const closeBtn = document.querySelector('.close-btn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const gameFrame = document.getElementById('gameFrame');
const noResults = document.getElementById('noResults');
const modalGameTitle = document.getElementById('modalGameTitle');
const modalGameCategory = document.getElementById('modalGameCategory');

// State
let allGames = [];
let filteredGames = [];
let currentFilter = 'all';
let currentSearchTerm = '';

// Trending game IDs (Baldi's Basics and other popular games)
const trendingGameIds = [26, 5, 21, 9, 2, 14];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGames();
    setupEventListeners();
});

// Load games from JSON
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

// Setup Event Listeners
function setupEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.toLowerCase();
        filterAndRenderGames();
    });

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            filterAndRenderGames();
        });
    });

    // Modal close button
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fullscreen button
    fullscreenBtn.addEventListener('click', toggleFullscreen);

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Render trending games
function renderTrendingGames() {
    trendingList.innerHTML = '';
    
    const trendingGames = allGames.filter(game => trendingGameIds.includes(game.id));
    
    trendingGames.forEach(game => {
        const gameCard = createGameCard(game, true);
        trendingList.appendChild(gameCard);
    });
}

// Filter and render games
function filterAndRenderGames() {
    filteredGames = allGames.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(currentSearchTerm) ||
                            game.description.toLowerCase().includes(currentSearchTerm);
        const matchesFilter = currentFilter === 'all' || game.category === currentFilter;
        return matchesSearch && matchesFilter;
    });

    renderGames();
}

// Render games to the grid
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

// Create a game card element
function createGameCard(game, isTrending = false) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    let trendingBadgeHTML = '';
    if (isTrending) {
        trendingBadgeHTML = '<span class="trending-badge">🔥 Trending</span>';
    }
    
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

// Open modal with game
function openModal(game) {
    modalGameTitle.textContent = game.title;
    modalGameCategory.textContent = capitalizeCategory(game.category);
    gameFrame.src = game.iframeUrl;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modal.classList.remove('active');
    gameFrame.src = '';
    document.body.style.overflow = 'auto';
}

// Toggle fullscreen
function toggleFullscreen() {
    if (gameFrame.requestFullscreen) {
        gameFrame.requestFullscreen();
    } else if (gameFrame.webkitRequestFullscreen) {
        gameFrame.webkitRequestFullscreen();
    } else if (gameFrame.msRequestFullscreen) {
        gameFrame.msRequestFullscreen();
    }
}

// Utility function to capitalize category
function capitalizeCategory(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

// Add smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';
