<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Tweet\StoreRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Tweet;

use App\Consts\TweetConsts;

class TweetController extends Controller
{
    //
    public function index(Request $request)
    {
        $user = $request->user();
        $tweets = Tweet::where('user_id', $user->id)
                ->orderByDesc('created_at')
                ->paginate(TweetConsts::PAGENATE_LIST_LIMIT);

        return response()->json($tweets);
    }

    public function store(StoreRequest $request)
    {
        $tweet = $request->user()->tweets()->create($request->validated());

        return response()->json($tweet, 201);
    }

    public function destroy($id)
    {
        $tweet = Tweet::find($id);

        if (!$tweet) {
            return response()->json(['message' => 'Tweet not found'], 404);
        }

        // 自分のツイート以外は削除不可
        if ($tweet->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $tweet->delete();

        // 204: No Content（成功）
        return response()->noContent();
    }
}
