<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config.php';

$sql = "SELECT id, termino, pron as pronunciacion, traduccion as significado, contexto, COALESCE(peso, 0) as peso 
        FROM translations 
        ORDER BY (
            LEAST(COALESCE(peso, 0), 5) * 1 + 
            IF(ultimo_acceso IS NULL, 0, TIMESTAMPDIFF(SECOND, ultimo_acceso, NOW()) / 3600 * 0.5)
        ) ASC, RAND() 
        LIMIT 1";

try {
    $stmt = $pdo->query($sql);
    $palabra = $stmt->fetch();

    if (!$palabra) {
        http_response_code(404);
        echo json_encode(['error' => 'No hay palabras']);
        exit;
    }

    echo json_encode($palabra);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error del servidor']);
}