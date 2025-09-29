<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $data = $request->only(['email', 'password']);

        $validator = Validator::make($data, [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        if (! Auth::attempt($data)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        /** @var User $user */
        $user = User::query()->where('email', $data['email'])->firstOrFail();

        // Issue a new token stored in remember_token (for simplicity, no extra packages)
        $token = Str::random(60);
        $user->forceFill(['remember_token' => $token])->save();

        return response()->json([
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        if ($user) {
            $user->forceFill(['remember_token' => null])->save();
        }

        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        /** @var User|null $user */
        $user = $request->user();

        return response()->json($user ? [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ] : null);
    }
}
