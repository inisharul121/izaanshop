<?php

try {
    $reportController = new \App\Http\Controllers\Admin\ReportController();
    
    // Finance
    echo "Testing Finance Report...\n";
    $financeView = $reportController->finance()->render();
    echo "Finance OK\n";

    // Stock
    echo "Testing Stock Report...\n";
    $stockView = $reportController->stock()->render();
    echo "Stock OK\n";

    // Payments
    echo "Testing Payments Report...\n";
    $paymentsView = $reportController->payments()->render();
    echo "Payments OK\n";

    // Media Page
    echo "Testing Media Page...\n";
    $mediaController = new \App\Http\Controllers\Admin\MediaController();
    $mediaView = $mediaController->page()->render();
    echo "Media OK\n";

    // Approvals
    echo "Testing Approvals Page...\n";
    $approvalController = new \App\Http\Controllers\Admin\ApprovalController();
    $approvalsView = $approvalController->index()->render();
    echo "Approvals OK\n";

    // Users
    echo "Testing Users Page...\n";
    $userController = new \App\Http\Controllers\Admin\UserController();
    $usersView = $userController->index()->render();
    echo "Users OK\n";

    // Shipping
    echo "Testing Shipping Page...\n";
    $shippingController = new \App\Http\Controllers\Admin\ShippingController();
    $shippingView = $shippingController->index()->render();
    echo "Shipping OK\n";

    echo "\nAll Admin Pages rendered successfully without syntax or variable errors!\n";

} catch (\Exception $e) {
    echo "EXCEPTION CAUGHT: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " on line " . $e->getLine() . "\n";
}
