<?php

use App\Http\Controllers\Web\StudentController;
use App\Http\Controllers\Web\SubjectController;
use App\Http\Controllers\Web\TeacherController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('students', StudentController::class);
    Route::post('students/{student}/subjects/attach', [StudentController::class, 'subjectAttach'])
        ->name('students.subjects.attach');

    Route::resource('subjects', SubjectController::class);
    Route::post('subjects/{subject}/students/attach', [SubjectController::class, 'studentAttach'])
        ->name('subjects.students.attach');

    Route::resource('teachers', TeacherController::class);
    Route::post('teachers/{teacher}/subjects/associate', [TeacherController::class, 'subjectAssociate'])
        ->name('teachers.subjects.associate');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
