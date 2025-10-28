<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
// We don't need Models or Session management here, as Laravel handles that via helpers/Blade

class HomeController extends Controller
{
    public function index()
    {
        // 1. Logic (future event fetching) goes here, if any.

        // 2. Return the view.
        return view('home.index');
    }
}
?>