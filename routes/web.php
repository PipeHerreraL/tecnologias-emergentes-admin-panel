<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\StudentController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // React admin pages
    Route::get('students', function () {
        return Inertia::render('students/index');
    })->name('students.index');

    // Session-authenticated API (uses web guard)
    Route::prefix('api')->group(function () {
        Route::get('students', [StudentController::class, 'index'])->name('api.students.index');
        Route::get('students/{student}', [StudentController::class, 'show'])->name('api.students.show');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
