# Unblocked Games Website

A simple, modern web application for playing unblocked games. Games are loaded from a JSON file and displayed in an iFrame for seamless gameplay.

## Features

✨ **Key Features:**
- 🎮 Play multiple unblocked games directly in the browser
- 🔍 Search functionality to find games by name or description
- 🏷️ Filter games by category (Action, Puzzle, Strategy, Sports)
- 📱 Fully responsive design for desktop, tablet, and mobile
- 🎨 Modern dark theme UI with smooth animations
- 🖼️ Games displayed in embedded iFrames
- ⌨️ Keyboard shortcuts (Escape to close modals)
- 🖥️ Fullscreen game mode support

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── script.js           # JavaScript for interactivity
├── games.json          # Game data with iFrame URLs
└── README.md           # This file
```

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation required!

### Installation

1. **Clone or download the repository:**
   ```bash
   git clone https://github.com/Bqurxe/Unblockedgames.git
   cd Unblockedgames
   ```

2. **Open the website:**
   - Double-click `index.html` to open in your default browser, OR
   - Serve it using a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Python 2
     python -m SimpleHTTPServer 8000
     
     # Using Node.js (with http-server package)
     npx http-server
     ```
   - Then visit `http://localhost:8000` in your browser

## How to Use

1. **Browse Games:** Scroll through the grid to see all available games
2. **Search:** Use the search bar to find games by name or description
3. **Filter:** Click category buttons to filter by game type
4. **Play:** Click "Play Now" on any game card to open it in fullscreen
5. **Fullscreen:** Click the "⛶ Fullscreen" button for a full browser experience
6. **Close:** Press Escape or click the X button to close a game

## Customizing Games

### Add New Games

Edit `games.json` and add entries to the games array:

```json
{
  "id": 13,
  "title": "Game Name",
  "category": "puzzle",
  "description": "Brief description of the game",
  "emoji": "🎮",
  "iframeUrl": "https://game-url.com/"
}
```

### Categories
- **action** - Fast-paced games requiring quick reflexes
- **puzzle** - Problem-solving and brain teaser games
- **strategy** - Turn-based or planning games
- **sports** - Sports-related games
- **all** - Shows all games

### Finding Game URLs

Many unblocked game websites provide embeddable iFrame URLs. Some popular sources:
- Official game websites
- Game hosting platforms like itch.io, Kongregate, or ArmorGames
- Public game repositories

## Styling Customization

Edit `styles.css` to customize the appearance:

- **Color Scheme:** Modify the CSS variables in `:root`:
  ```css
  :root {
      --primary-color: #6366f1;
      --secondary-color: #ec4899;
      --dark-bg: #0f172a;
  }
  ```

- **Fonts:** Change the default font family in `body`
- **Layout:** Adjust grid columns in `.games-grid`
- **Animations:** Modify `@keyframes` sections

## Technical Details

### Technologies Used
- **HTML5:** Semantic markup
- **CSS3:** Flexbox, Grid, Animations, Gradients
- **Vanilla JavaScript:** No frameworks or dependencies
- **JSON:** Game data storage

### Browser Compatibility
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

### Performance
- Lightweight (~50KB total)
- No external dependencies
- Fast loading times
- Optimized for all screen sizes

## Contributing

To improve this project:
1. Add more games to the collection
2. Improve UI/UX design
3. Add new features
4. Report broken game links

## License

This project is open source and available for personal and educational use.

---

**Enjoy your gaming! 🎮**
