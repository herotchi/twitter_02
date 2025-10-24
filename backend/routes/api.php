<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//use App\Http\Controllers\Api\AuthController;
//use App\Http\Controllers\Api\TweetController;

/*Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/tweets', [TweetController::class, 'index']);
Route::post('/tweets', [TweetController::class, 'store']);

Route::group(['namespace' => 'App\Http\Controllers\Api'], function () {
    // --------------- Register and Login ----------------//
    Route::post('register', 'AuthenticationController@register')->name('register');
    Route::post('login', 'AuthController@login')->name('login');
    
    // ------------------ Get Data ----------------------//
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('user', 'AuthController@user')->name('user');
        Route::post('logout', 'AuthController@logout')->name('logout');
    });
});*/
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

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('tweets')->name('tweets.')->controller(TweetController::class)->group(function () {
        Route::get('', 'index')->name('index');
        Route::post('', 'store')->name('store');
    });
});*/
