<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TweetController;

/*
Route::prefix('auth')->name('auth.')->controller(AuthController::class)->group(function () {
    // --------------- Register and Login ----------------//
    Route::post('/register', 'register')->name('register');
    Route::post('/login', 'login')->name('login');
    
    // ------------------ Get Data ----------------------//
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('user', 'user')->name('user');
        Route::post('logout', 'logout')->name('logout');
    });
});
*/
Route::middleware('web')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/user', [AuthController::class, 'user'])->name('auth.user');
        Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::get('/tweets', [TweetController::class, 'index']);
        Route::post('/tweets', [TweetController::class, 'store']);
    });
});