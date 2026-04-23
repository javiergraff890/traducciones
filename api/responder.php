<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['id']) || !isset($data['resultado'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Faltan datos']);
    exit;
}

$id = filter_var($data['id'], FILTER_VALIDATE_INT);
$resultado = filter_var($data['resultado'], FILTER_VALIDATE_BOOLEAN);

if ($id === false || $id === null || $id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID inválido']);
    exit;
}

if ($resultado === true) {
    $sql = "UPDATE translations SET peso = LEAST(peso + 1, 5), ultimo_acceso = NOW() WHERE id = ?";
} else {
    $sql = "UPDATE translations SET peso = GREATEST(peso - 1, 0), ultimo_acceso = NOW() WHERE id = ?";
}

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Palabra no encontrada']);
        exit;
    }

    echo json_encode(['success' => true]);
} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error del servidor']);
}