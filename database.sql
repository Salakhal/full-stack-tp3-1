-- Vérifier si la base existe, sinon la créer
CREATE DATABASE IF NOT EXISTS ma_base
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Sélectionner la base
USE ma_base;

-- Supprimer la table si elle existe (optionnel - pour réinitialisation)
-- DROP TABLE IF EXISTS utilisateurs;

-- Créer la table utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Créer les index pour améliorer les performances
CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX idx_utilisateurs_created_at ON utilisateurs(created_at);
CREATE INDEX idx_utilisateurs_nom ON utilisateurs(nom);
CREATE INDEX idx_utilisateurs_prenom ON utilisateurs(prenom);

-- Insérer des données de test
INSERT INTO utilisateurs (nom, prenom, email) VALUES
('Dupont', 'Jean', 'jean.dupont@email.com'),
('Martin', 'Sophie', 'sophie.martin@email.com'),
('Bernard', 'Lucas', 'lucas.bernard@email.com'),
('Petit', 'Emma', 'emma.petit@email.com'),
('Robert', 'Thomas', 'thomas.robert@email.com'),
('Richard', 'Julie', 'julie.richard@email.com'),
('Dubois', 'Nicolas', 'nicolas.dubois@email.com'),
('Moreau', 'Camille', 'camille.moreau@email.com'),
('Simon', 'Alexandre', 'alexandre.simon@email.com'),
('Laurent', 'Marine', 'marine.laurent@email.com');

-- Vérifier que les données ont été insérées
SELECT COUNT(*) as total_utilisateurs FROM utilisateurs;

-- Afficher les 10 derniers utilisateurs
SELECT * FROM utilisateurs ORDER BY created_at DESC LIMIT 10;