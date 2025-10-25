<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Profile\EditRequest;
use App\Http\Requests\Profile\PasswordRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class ProfileController extends Controller
{
    //
    public function update(EditRequest $request)
    {
        $validated = $request->validated();
        $user = Auth::user();

        if (Hash::check($validated['currentPasswordForProfile'], $user->password)) {
            // 一致しているので更新処理OK
            $user = User::find(Auth::id());
            $user->name = $validated['name'];
            $user->email = $validated['email'];
            $user->save();
        } else {
            // パスワード不一致
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json([
            'message' => 'プロフィール変更が完了しました。',
        ], 201);
    }
}
