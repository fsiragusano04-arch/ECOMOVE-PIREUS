<?php
require_once 'Database.php';

class RentalController {
    private $db;
    private $jwtSecret;

    public function __construct() {
        $this->db = Database::getInstance();
        $this->jwtSecret = getenv('JWT_SECRET') ?: 'PireusSuperSecretKey2026_IDS_QualityGateA!!';
    }

    public function validateJWT($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return false;
        list($header, $payload, $signature) = $parts;
        $validSignature = hash_hmac('sha256', "$header.$payload", $this->jwtSecret, true);
        $validSignatureEncoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($validSignature));
        
        if ($signature !== $validSignatureEncoded) return false;
        return json_decode(base64_decode($payload), true);
    }

    public function startRental($token, $qrCode) {
        $userData = $this->validateJWT($token);
        if (!$userData) {
            return ["status" => 401, "message" => "Autenticazione Fallita: Token non valido."];
        }

        try {
            $this->db->beginTransaction();

            $stmt = $this->db->prepare("SELECT id_mezzo, stato, livello_batteria FROM VEICOLO WHERE codice_qr = :qr FOR UPDATE");
            $stmt->execute(['qr' => $qrCode]);
            $vehicle = $stmt->fetch();

            if (!$vehicle || ($vehicle['stato'] !== 'DISPONIBILE' && $vehicle['stato'] !== 'PRENOTATO')) {
                $this->db->rollBack();
                return ["status" => 409, "message" => "Veicolo non disponibile o già in uso."];
            }

            $update = $this->db->prepare("UPDATE VEICOLO SET stato = 'IN_USO' WHERE id_mezzo = :id");
            $update->execute(['id' => $vehicle['id_mezzo']]);

            $insert = $this->db->prepare("INSERT INTO CORSA (id_utente_fk, id_mezzo_fk, ora_inizio, coord_inizio_lat, coord_inizio_lon) VALUES (:u, :m, CURRENT_TIMESTAMP, 37.9474, 23.6462) RETURNING id_corsa");
            $insert->execute(['u' => $userData['id_utente'], 'm' => $vehicle['id_mezzo']]);
            $corsa = $insert->fetch();

            $this->db->commit();
            return [
                "status" => 200, 
                "message" => "Sblocco effettuato.", 
                "data" => ["id_corsa" => $corsa['id_corsa'], "batteria" => $vehicle['livello_batteria']]
            ];
        } catch (Exception $e) {
            $this->db->rollBack();
            return ["status" => 500, "message" => $e->getMessage()];
        }
    }
}
