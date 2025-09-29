<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TokenAuth
{
    /**
     * Handle an incoming request.
     * The client should send an Authorization: Bearer <token> header.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json(['message' => 'Unauthorized. Missing bearer token.'], 401);
        }

        $token = substr($authHeader, 7);

        /** @var User|null $user */
        $user = User::query()->where('remember_token', $token)->first();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized. Invalid token.'], 401);
        }

        // Authenticate the user for the current request lifecycle
        auth()->setUser($user);

        return $next($request);
    }
}
