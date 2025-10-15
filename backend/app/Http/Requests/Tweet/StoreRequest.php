<?php

namespace App\Http\Requests\Tweet;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

use App\Consts\TweetConsts;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            //
            'content' => 'required|string|max:' . TweetConsts::CONTENT_LENGTH_MAX,
        ];
    }

    /**
     * バリデーション失敗時に JSON レスポンスを返す
     */
    protected function failedValidation(Validator $validator): void
    {
        // ここでバリデーションエラー時の挙動を上書き
        throw new HttpResponseException(response()->json([
            'message' => 'Validation failed.',
            'errors' => $validator->errors(),
        ], 422)); // HTTP 422: Unprocessable Entity
    }
}
