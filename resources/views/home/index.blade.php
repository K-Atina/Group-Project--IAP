<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MyTikiti - Landing Page</title>
    {{-- Convert asset path using the asset() helper --}}
    <link rel="stylesheet" href="{{ asset('style.css') }}">
</head>
<body>
    <nav class="navbar">
        <div class="logo"><strong>MyTikiti</strong></div>
        <ul>
            {{-- Use the route() helper for link names --}}
            <li><a href="{{ route('home') }}">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Services</a></li>
            <li><a href="#">Contact</a></li>
        </ul>

        {{-- SESSION CHECK: Convert PHP 'isset($_SESSION["user"])' to Blade '@if(session()->has("user"))' --}}
        @if (session()->has('user'))
            <span style="color:#f39c12; margin-right:15px;">
                Welcome, {{ htmlspecialchars(session('user')) }} {{-- Access session data using session() helper --}}
            </span>
            <a href="{{ url('logout.php') }}" class="navbar-btn">Logout</a>
        @else
            <a href="{{ url('login.php') }}" class="navbar-btn">Log In</a>
        @endif
    </nav>

    <section class="hero">
        <h1>Your Ticket to Everything!</h1>
        <p>Skip the line, not the show</p>

        {{-- SESSION CHECK: Convert PHP '!isset($_SESSION["user"])' to Blade '@unless(session()->has("user"))' --}}
        @unless (session()->has('user'))
            <a class="btn" href="{{ url('events.php') }}">Events</a>
            <a class="btn" href="{{ url('signup.php') }}">Sign Up</a>
        @else
            <a class="btn" href="{{ url('events.php') }}">Browse Events</a>
        @endunless
    </section>

    <section class="events">
        {{-- These cards will eventually be replaced by a @foreach loop over a collection of events fetched by the Model --}}
        <div class="card">
            <img src="https://via.placeholder.com/200x120">
            <h3>Event Title</h3>
            <p>Event Venue | Event Time</p>
            <button>View Event</button>
        </div>
        <div class="card">
            <img src="https://via.placeholder.com/200x120">
            <h3>Event Title</h3>
            <p>Event Venue | Event Time</p>
            <button>View Event</button>
        </div>
        <div class="card">
            <img src="https://via.placeholder.com/200x120">
            <h3>Event Title</h3>
            <p>Event Venue | Event Time</p>
            <button>View Event</button>
        </div>
    </section>

    {{-- MESSAGE CHECK: Check for 'success' in the session, use session()->pull() to display and remove --}}
    @if (session()->has('success'))
        <div class="popup">{{ session()->pull('success') }}</div>
    @endif
</body>
</html>