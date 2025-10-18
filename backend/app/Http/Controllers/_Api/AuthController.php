<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Models\User;

use App\Http\Requests\Auth\LoginRequest;

class AuthController extends Controller
{
    /**
     * Register a new account.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // 自動ログインしない
        // Auth::login($user); ← 削除！

        return response()->json([
            'message' => 'ユーザー登録が完了しました。ログインしてください。',
        ], 201);
    }


    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => '認証に失敗しました'], 401);
        }

        $request->session()->regenerate();

        return response()->json(['user' => Auth::user()]);
    }


    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'ログアウトしました']);
    }


    // ログイン中ユーザー取得
    public function user(Request $request)
    {
        return response()->json($request->user());
    }
}
