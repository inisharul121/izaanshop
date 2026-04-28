<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;

class ApprovalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pendingUsers = User::where('isApproved', false)->latest()->get();
        return view('admin.approvals.index', compact('pendingUsers'));
    }

    /**
     * Approve the specified user.
     */
    public function approve(string $id)
    {
        $user = User::findOrFail($id);
        $user->update(['isApproved' => true]);

        return redirect()->route('admin.approvals.index')->with('success', "User {$user->name} has been approved successfully.");
    }
}
