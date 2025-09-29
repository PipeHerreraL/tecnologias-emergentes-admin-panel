<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
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

        // When missing token
        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            // If this is an Inertia request, respond with an Inertia location redirect to login
            if ($request->header('X-Inertia')) {
                return Inertia::location(route('login'));
            }
            // If it's an API/json request, keep returning JSON
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Unauthorized. Missing bearer token.'], 401);
            }
            // Fallback to a guest redirect for regular browser requests
            return redirect()->guest(route('login'));
        }

        $token = substr($authHeader, 7);

        /** @var User|null $user */
        $user = User::query()->where('remember_token', $token)->first();

        if (!$user) {
            if ($request->header('X-Inertia')) {
                return Inertia::location(route('login'));
            }
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Unauthorized. Invalid token.'], 401);
            }
            return redirect()->guest(route('login'));
        }

        // Authenticate the user for the current request lifecycle
        auth()->setUser($user);

        return $next($request);
    }
}
