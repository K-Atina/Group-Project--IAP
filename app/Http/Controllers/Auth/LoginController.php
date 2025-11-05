<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class LoginController extends Controller
{
    /**
     * Show the login form
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    /**
     * Handle login request
     */
    public function login(Request $request)
    {
        // Validate the request
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Find the user by email
        $user = User::where('email', $credentials['email'])->first();

        // Check if user exists and password is correct
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return back()
                ->withInput($request->only('email'))
                ->withErrors(['email' => 'Invalid login credentials.']);
        }

        // Check if email is verified
        if (is_null($user->email_verified_at)) {
            return back()
                ->withInput($request->only('email'))
                ->with('needs_verification', true)
                ->with('user_email', $credentials['email'])
                ->withErrors([
                    'email' => 'Please verify your email address before logging in. Check your inbox for the verification link.'
                ]);
        }

        // Log the user in
        Auth::login($user);

        // Regenerate session to prevent fixation attacks
        $request->session()->regenerate();

        // Set success message
        session()->flash('success', "Congratulations {$user->full_name} for logging in!");

        // Redirect to intended page or dashboard
        return redirect()->intended('dashboard');
    }

    /**
     * Handle logout request
     */
    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}