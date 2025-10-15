<?php

namespace App\Http\Controllers\Api;

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
        $tweets = Tweet::orderByDesc('created_at')->paginate(TweetConsts::PAGENATE_LIST_LIMIT);
        return response()->json($tweets);
    }

    public function store(StoreRequest $request)
    {
        $tweet = Tweet::create($request->validated());

        return response()->json($tweet, 201);
    }
}
