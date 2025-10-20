<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Tweet\StoreRequest;
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
}
