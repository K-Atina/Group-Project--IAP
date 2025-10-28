<?php

use Illuminate\Support\Facades\Route;


//Testing if the model works
use App\Models\User;


Route::get('/test-users', function () {
    // Retrieve all users from the database
    $users = User::all();

    // Return the users as a JSON response
    return response()->json($users);
});
