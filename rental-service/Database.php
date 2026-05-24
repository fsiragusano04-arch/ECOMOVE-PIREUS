<?php
// Gestione della connessione fisica tramite pattern Singleton
class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        $host = getenv('DB_HOST') ?: 'postgres-db';
        $db   = getenv('DB_NAME') ?: 'ecomove_db';
        $user = getenv('DB_USER') ?: 'ecomove_admin';
        $pass = getenv('DB_PASSWORD') ?: 'SecretPassword123!';
        
        try {
            $this->conn = new PDO("pgsql:host=$host;dbname=$db;", $user, $pass, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
        } catch (PDOException $e) {
            throw new Exception("Errore di connessione al database: " . $e->getMessage());
        }
    }

    public static function getInstance() {
        if (self::$instance == null) {
            self::$instance = new Database();
        }
        return self::$instance->conn;
    }
}
