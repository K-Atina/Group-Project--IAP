<?php
require_once __DIR__ . '/Backend/src/Config/Database.php';

// Create database connection
$database = new Database();
$conn = $database->getConnection();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>View Tickets | MyTikiti</title>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>

<body class="bg-light">
  <nav class="navbar navbar-expand-lg navbar-dark bg-success">
    <div class="container">
      <a class="navbar-brand fw-bold" href="#">MyTikiti</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item"><a class="nav-link" href="index.php">Home</a></li>
          <li class="nav-item"><a class="nav-link active" href="#">View Tickets</a></li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container py-5">
    <h2 class="text-center mb-4 text-success fw-bold">Available Tickets & Events</h2>

    <?php
    try {
      $stmt = $conn->query("SELECT * FROM tickets ORDER BY id DESC");
      $tickets = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
      echo "<div class='alert alert-danger'>Error fetching tickets: " . htmlspecialchars($e->getMessage()) . "</div>";
      $tickets = [];
    }
    ?>

    <?php if (count($tickets) > 0): ?>
      <div class="card shadow-sm">
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-hover table-bordered align-middle">
              <thead class="table-success">
                <tr>
                  <th>ID</th>
                  <th>Event Name</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Price (KSh)</th>
                  <th>Available Tickets</th>
                </tr>
              </thead>
              <tbody>
                <?php foreach ($tickets as $ticket): ?>
                  <tr>
                    <td><?= htmlspecialchars($ticket['id']) ?></td>
                    <td><?= htmlspecialchars($ticket['event_name']) ?></td>
                    <td><?= htmlspecialchars($ticket['event_date']) ?></td>
                    <td><?= htmlspecialchars($ticket['venue']) ?></td>
                    <td><?= htmlspecialchars($ticket['price']) ?></td>
                    <td><?= htmlspecialchars($ticket['available_tickets']) ?></td>
                  </tr>
                <?php endforeach; ?>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    <?php else: ?>
      <div class="alert alert-info text-center mt-4">No events or tickets found.</div>
    <?php endif; ?>
  </div>

  <!-- Bootstrap JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
