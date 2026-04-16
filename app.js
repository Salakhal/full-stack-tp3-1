import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import indexRoutes from './routes/index.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRoutes);

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).render('pages/home', {
    title: 'Page non trouvée',
    users: [],
    error: '404 - Page non trouvée',
    success: null
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur globale:', err);
  res.status(500).render('pages/home', {
    title: 'Erreur serveur',
    users: [],
    error: 'Une erreur interne est survenue',
    success: null
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📝 Environnement: ${process.env.NODE_ENV || 'development'}`);
});