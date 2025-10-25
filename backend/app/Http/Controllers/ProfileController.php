<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Profile\EditRequest;
use App\Http\Requests\Profile\PasswordRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class ProfileController extends Controller
{
    //
    public function update(EditRequest $request)
    {
        $validated = $request->validated();
        $user = User::find(Auth::id());

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->save();

        return response()->json([
            'message' => 'プロフィール変更が完了しました。',
        ], 201);
    }
}
