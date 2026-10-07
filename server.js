const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "password",
    database: "azienda",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;

const pool = require("./db");

async function createTables() {
    try {

        // Tabella Personale
        await pool.query(`
            CREATE TABLE IF NOT EXISTS personale (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                cognome VARCHAR(100) NOT NULL,
                ruolo VARCHAR(100),
                email VARCHAR(150) UNIQUE,
                telefono VARCHAR(20),
                stipendio DECIMAL(10,2),
                data_assunzione DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabella Prodotti
        await pool.query(`
            CREATE TABLE IF NOT EXISTS prodotti (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(150) NOT NULL,
                descrizione TEXT,
                prezzo DECIMAL(10,2) NOT NULL,
                quantita INT DEFAULT 0,
                categoria VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabella Ordini
        await pool.query(`
            CREATE TABLE IF NOT EXISTS ordini (
                id INT AUTO_INCREMENT PRIMARY KEY,
                personale_id INT NOT NULL,
                prodotto_id INT NOT NULL,
                quantita INT NOT NULL,
                totale DECIMAL(10,2) NOT NULL,
                data_ordine DATETIME DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (personale_id)
                    REFERENCES personale(id)
                    ON DELETE CASCADE,

                FOREIGN KEY (prodotto_id)
                    REFERENCES prodotti(id)
                    ON DELETE CASCADE
            )
        `);

        console.log("Tabelle create con successo!");

    } catch (error) {
        console.error("Errore:", error);
    } finally {
        await pool.end();
    }
}

createTables();