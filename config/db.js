import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  max: 20, // Nombre maximum de connexions dans le pool
  idleTimeoutMillis: 30000, // Temps d'inactivité avant fermeture
  connectionTimeoutMillis: 2000, // Temps d'attente pour une connexion
});

// Tester la connexion
pool.on('connect', () => {
  console.log(' Connecté à PostgreSQL');
});

pool.on('error', (err) => {
  console.error(' Erreur de connexion PostgreSQL:', err);
});

export const query = (text, params) => pool.query(text, params);
export default pool;