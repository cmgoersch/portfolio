const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Root-Route auf "views/index.html" setzen
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Statische Dateien bereitstellen
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/js', express.static(path.join(__dirname, 'js')));

// Zusätzliche Routen
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`);
  });

// 404-Fallback
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://127.0.0.1:${PORT}`);
});

