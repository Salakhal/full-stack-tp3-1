import { Router } from 'express';
import { query } from '../config/db.js';
import { body, validationResult } from 'express-validator';

const router = Router();

// Validation rules
const validateUser = [
  body('nom').trim().isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères'),
  body('prenom').trim().isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('nom').escape(),
  body('prenom').escape(),
  body('email').escape()
];

// GET / - Page d'accueil
router.get('/', async (req, res) => {
  try {
    const result = await query(
      'SELECT id, nom, prenom, email, created_at FROM utilisateurs ORDER BY created_at DESC LIMIT 50'
    );
    res.render('pages/home', {
      title: 'Gestion des Utilisateurs',
      users: result.rows,
      error: null,
      success: req.query.success || null
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).render('pages/home', {
      title: 'Erreur',
      users: [],
      error: 'Impossible de charger les utilisateurs',
      success: null
    });
  }
});

// POST /users - Création d'un utilisateur
router.post('/users', validateUser, async (req, res) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    try {
      const result = await query('SELECT id, nom, prenom, email FROM utilisateurs ORDER BY created_at DESC');
      return res.status(400).render('pages/home', {
        title: 'Erreur de validation',
        users: result.rows,
        error: errors.array().map(e => e.msg).join(', '),
        success: null
      });
    } catch (err) {
      return res.status(400).render('pages/home', {
        title: 'Erreur',
        users: [],
        error: errors.array().map(e => e.msg).join(', '),
        success: null
      });
    }
  }

  const { nom, prenom, email } = req.body;
  
  try {
    await query(
      'INSERT INTO utilisateurs (nom, prenom, email) VALUES ($1, $2, $3)',
      [nom, prenom, email]
    );
    res.redirect('/?success=Utilisateur ajouté avec succès');
  } catch (err) {
    console.error('Erreur lors de la création:', err);
    let errorMessage = 'Erreur lors de la création';
    if (err.code === '23505') { // Violation d'unicité
      errorMessage = 'Cet email existe déjà';
    }
    
    try {
      const result = await query('SELECT id, nom, prenom, email FROM utilisateurs ORDER BY created_at DESC');
      res.status(500).render('pages/home', {
        title: 'Erreur',
        users: result.rows,
        error: errorMessage,
        success: null
      });
    } catch (fetchErr) {
      res.status(500).render('pages/home', {
        title: 'Erreur',
        users: [],
        error: errorMessage,
        success: null
      });
    }
  }
});

// POST /users/:id/edit - Mise à jour
router.post('/users/:id/edit', validateUser, async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, email } = req.body;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).redirect('/?error=' + encodeURIComponent(errors.array().map(e => e.msg).join(', ')));
  }
  
  try {
    await query(
      'UPDATE utilisateurs SET nom=$1, prenom=$2, email=$3 WHERE id=$4',
      [nom, prenom, email, id]
    );
    res.redirect('/?success=Utilisateur modifié avec succès');
  } catch (err) {
    console.error('Erreur lors de la mise à jour:', err);
    res.redirect('/?error=Erreur lors de la modification');
  }
});

// POST /users/:id/delete - Suppression
router.post('/users/:id/delete', async (req, res) => {
  const { id } = req.params;
  
  try {
    await query('DELETE FROM utilisateurs WHERE id=$1', [id]);
    res.redirect('/?success=Utilisateur supprimé avec succès');
  } catch (err) {
    console.error('Erreur lors de la suppression:', err);
    res.redirect('/?error=Erreur lors de la suppression');
  }
});

// GET /search - Recherche d'utilisateurs
router.get('/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim() === '') {
    return res.redirect('/');
  }
  
  try {
    const result = await query(
      `SELECT id, nom, prenom, email 
       FROM utilisateurs 
       WHERE nom ILIKE $1 OR prenom ILIKE $1 OR email ILIKE $1 
       ORDER BY created_at DESC`,
      [`%${q}%`]
    );
    res.render('pages/home', {
      title: `Résultats pour "${q}"`,
      users: result.rows,
      error: result.rows.length === 0 ? 'Aucun résultat trouvé' : null,
      success: null
    });
  } catch (err) {
    console.error('Erreur lors de la recherche:', err);
    res.redirect('/?error=Erreur lors de la recherche');
  }
});

export default router;