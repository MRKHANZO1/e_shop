<?php
// checkout.php
include 'db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
    $cart = json_decode($_POST['cart'], true); // Expecting JSON format

    // Calculate total
    $total = 0;
    foreach ($cart as $item) {
        $total += $item['price'] * $item['quantity'];
    }

    // Insert order
    $stmt = $conn->prepare("INSERT INTO orders (user_id, total) VALUES (?, ?)");
    $stmt->bind_param("id", $userId, $total);
    $stmt->execute();
    $orderId = $stmt->insert_id;

    // Insert order items
    foreach ($cart as $item) {
        $stmt = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)");
        $stmt->bind_param("iii", $orderId, $item['id'], $item['quantity']);
        $stmt->execute();
    }

    echo json_encode(["success" => true]);
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
}
?>
