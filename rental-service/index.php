<?php
header("Content-Type: application/json");
require_once 'RentalController.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST') {
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    
    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["error" => "Token JWT mancante."]);
        exit();
    }

    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['codice_qr'])) {
        http_response_code(400);
        echo json_encode(["error" => "Codice QR mancante."]);
        exit();
    }

    $controller = new RentalController();
    $res = $controller->startRental($matches[1], $input['codice_qr']);
    http_response_code($res['status']);
    echo json_encode($res);
}
