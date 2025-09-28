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

    // JSON mirrors for Filament admin list routes so React/HTTP can use similar paths
    Route::get('admin/students.json', [StudentController::class, 'index'])->name('admin.students.json');
    Route::get('admin/teachers.json', [TeacherController::class, 'index'])->name('admin.teachers.json');
    Route::get('admin/subjects.json', [SubjectController::class, 'index'])->name('admin.subjects.json');

    // Session-authenticated API (uses web guard)
    Route::prefix('api')->group(function () {
        // Students
        Route::get('students', [StudentController::class, 'index'])->name('api.students.index');
        Route::post('students', [StudentController::class, 'store'])->name('api.students.store');
        Route::get('students/{student}', [StudentController::class, 'show'])->name('api.students.show');
        Route::patch('students/{student}', [StudentController::class, 'update'])->name('api.students.update');
        Route::delete('students/{student}', [StudentController::class, 'destroy'])->name('api.students.destroy');

        // Teachers
        Route::get('teachers', [TeacherController::class, 'index'])->name('api.teachers.index');
        Route::post('teachers', [TeacherController::class, 'store'])->name('api.teachers.store');
        Route::get('teachers/{teacher}', [TeacherController::class, 'show'])->name('api.teachers.show');
        Route::patch('teachers/{teacher}', [TeacherController::class, 'update'])->name('api.teachers.update');
        Route::delete('teachers/{teacher}', [TeacherController::class, 'destroy'])->name('api.teachers.destroy');

        // Subjects
        Route::get('subjects', [SubjectController::class, 'index'])->name('api.subjects.index');
        Route::post('subjects', [SubjectController::class, 'store'])->name('api.subjects.store');
        Route::get('subjects/{subject}', [SubjectController::class, 'show'])->name('api.subjects.show');
        Route::patch('subjects/{subject}', [SubjectController::class, 'update'])->name('api.subjects.update');
        Route::delete('subjects/{subject}', [SubjectController::class, 'destroy'])->name('api.subjects.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
