<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\SubjectController;

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
    Route::get('teachers', function () {
        return Inertia::render('teachers/index');
    })->name('teachers.index');
    Route::get('subjects', function () {
        return Inertia::render('subjects/index');
    })->name('subjects.index');

    // Session-authenticated API (uses web guard)
    Route::prefix('api')->group(function () {
        Route::get('students', [StudentController::class, 'index'])->name('api.students.index');
        Route::get('students/{student}', [StudentController::class, 'show'])->name('api.students.show');
        Route::get('teachers', [TeacherController::class, 'index'])->name('api.teachers.index');
        Route::get('teachers/{teacher}', [TeacherController::class, 'show'])->name('api.teachers.show');
        Route::get('subjects', [SubjectController::class, 'index'])->name('api.subjects.index');
        Route::get('subjects/{subject}', [SubjectController::class, 'show'])->name('api.subjects.show');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
