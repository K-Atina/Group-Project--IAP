<?php
require_once "Backend/src/Config/Database.php";

// Handle admin actions
$message = "";
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['action']) && $_POST['action'] == 'clear_all') {
    $database = new Database();
    $conn = $database->getConnection();
    $conn->exec("DELETE FROM users");
    $conn->exec("ALTER TABLE users AUTO_INCREMENT = 1");
    $message = "All users cleared successfully!";
    header("Refresh: 2");
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyTikiti Database Viewer</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 20px; 
            background: #f5f6fa;
            margin: 0;
        }
        .header {
            background: linear-gradient(135deg, #e67e22, #d35400);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .stats {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        .stat-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            flex: 1;
            text-align: center;
        }
        .stat-number {
            font-size: 2em;
            font-weight: bold;
            color: #2c3e50;
        }
        .stat-label {
            color: #7f8c8d;
            margin-top: 5px;
        }
        table { 
            border-collapse: collapse; 
            width: 100%; 
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: left; 
        }
        th { 
            background: #34495e;
            color: white;
            font-weight: 600;
            position: sticky;
            top: 0;
        }
        tr:nth-child(even) {
            background: #f8f9fa;
        }
        tr:hover {
            background: #e8f4f8;
        }
        .verified { 
            color: #27ae60; 
            font-weight: bold;
            background: #d5f4e6;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .unverified { 
            color: #e74c3c; 
            font-weight: bold;
            background: #fdf2f2;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.9em;
        }
        .token { 
            font-family: 'Courier New', monospace; 
            font-size: 11px; 
            max-width: 150px; 
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            background: #f8f9fa;
            padding: 2px 4px;
            border-radius: 3px;
        }
        .email {
            color: #3498db;
            font-weight: 500;
        }
        .admin-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .danger-btn {
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }
        .danger-btn:hover {
            background: #c0392b;
        }
        .success-message {
            background: #d5f4e6;
            color: #27ae60;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #27ae60;
        }
        .no-data {
            text-align: center;
            padding: 40px;
            color: #7f8c8d;
            font-style: italic;
        }
        .timestamp {
            font-size: 0.9em;
            color: #7f8c8d;
        }
        .nav-links {
            margin-bottom: 20px;
        }
        .nav-links a {
            display: inline-block;
            padding: 8px 16px;
            background: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-right: 10px;
            font-size: 14px;
        }
        .nav-links a:hover {
            background: #2980b9;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎟️ MyTikiti Database Viewer</h1>
        <p>Email Verification System Status</p>
    </div>

    <div class="nav-links">
        <a href="index.php">← Back to Homepage</a>
        <a href="signup.php">Test Signup</a>
        <a href="login.php">Test Login</a>
    </div>

    <?php if ($message): ?>
        <div class="success-message">
            <?= htmlspecialchars($message) ?>
        </div>
    <?php endif; ?>

    <?php
    try {
        $database = new Database();
        $conn = $database->getConnection();
        
        // Get all users
        $stmt = $conn->query("SELECT * FROM users ORDER BY created_at DESC");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Calculate statistics
        $totalUsers = count($users);
        $verifiedUsers = count(array_filter($users, function($u) { return $u['email_verified']; }));
        $unverifiedUsers = $totalUsers - $verifiedUsers;
        $pendingTokens = count(array_filter($users, function($u) { return !empty($u['verification_token']); }));
        
        ?>
        
        <div class="stats">
            <div class="stat-box">
                <div class="stat-number"><?= $totalUsers ?></div>
                <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-box">
                <div class="stat-number" style="color: #27ae60;"><?= $verifiedUsers ?></div>
                <div class="stat-label">Verified Users</div>
            </div>
            <div class="stat-box">
                <div class="stat-number" style="color: #e74c3c;"><?= $unverifiedUsers ?></div>
                <div class="stat-label">Unverified Users</div>
            </div>
            <div class="stat-box">
                <div class="stat-number" style="color: #f39c12;"><?= $pendingTokens ?></div>
                <div class="stat-label">Pending Tokens</div>
            </div>
        </div>

        <h2>Users Table (<?= $totalUsers ?> records)</h2>
        
        <?php if ($totalUsers > 0): ?>
            <div style="overflow-x: auto;">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Verification Status</th>
                            <th>Token</th>
                            <th>Token Expires</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($users as $user): ?>
                            <tr>
                                <td><strong><?= $user['id'] ?></strong></td>
                                <td><?= htmlspecialchars($user['full_name']) ?></td>
                                <td class="email"><?= htmlspecialchars($user['email']) ?></td>
                                <td>
                                    <?php if ($user['email_verified']): ?>
                                        <span class="verified">✓ VERIFIED</span>
                                    <?php else: ?>
                                        <span class="unverified">✗ UNVERIFIED</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if ($user['verification_token']): ?>
                                        <span class="token" title="<?= htmlspecialchars($user['verification_token']) ?>">
                                            <?= substr($user['verification_token'], 0, 16) ?>...
                                        </span>
                                    <?php else: ?>
                                        <span style="color: #95a5a6;">No Token</span>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <?php if ($user['token_expires_at']): ?>
                                        <span class="timestamp"><?= $user['token_expires_at'] ?></span>
                                        <?php
                                        $expires = strtotime($user['token_expires_at']);
                                        $now = time();
                                        if ($expires < $now): ?>
                                            <br><small style="color: #e74c3c;">EXPIRED</small>
                                        <?php else: ?>
                                            <br><small style="color: #27ae60;">Valid</small>
                                        <?php endif; ?>
                                    <?php else: ?>
                                        <span style="color: #95a5a6;">N/A</span>
                                    <?php endif; ?>
                                </td>
                                <td class="timestamp"><?= $user['created_at'] ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php else: ?>
            <div class="no-data">
                <h3>No users found in the database</h3>
                <p>Create some test accounts through the <a href="signup.php">signup page</a> to see data here.</p>
            </div>
        <?php endif; ?>

        <div class="admin-section">
            <h3>Admin Actions</h3>
            <p>Use this for testing and demonstration purposes:</p>
            
            <form method="post" style="display: inline;" onsubmit="return confirm('⚠️ This will permanently delete ALL users and reset the ID counter. Are you sure?')">
                <input type="hidden" name="action" value="clear_all">
                <button type="submit" class="danger-btn">🗑️ Clear All Users</button>
            </form>
            
            <p style="margin-top: 15px; font-size: 14px; color: #7f8c8d;">
                <strong>Note:</strong> This action cannot be undone. Use only for testing purposes.
            </p>
        </div>

        <?php
    } catch (Exception $e) {
        echo "<div style='color: red; background: #fdf2f2; padding: 20px; border-radius: 5px;'>";
        echo "<strong>Database Error:</strong> " . htmlspecialchars($e->getMessage());
        echo "</div>";
    }
    ?>

    <footer style="text-align: center; margin-top: 40px; padding: 20px; color: #7f8c8d; font-size: 12px;">
        <p>MyTikiti Email Verification System | Last updated: <?= date('Y-m-d H:i:s') ?></p>
    </footer>
</body>
</html>