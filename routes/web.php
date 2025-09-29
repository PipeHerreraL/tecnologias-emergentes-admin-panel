<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Admin model tables
    Route::get('students', function (\Illuminate\Http\Request $request) {
        $perPage = (int) $request->query('per_page', 10);
        $q = $request->query('q');
        $students = \App\Models\Student::query()
            ->when($q, function ($query, $q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('last_name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->appends($request->query());

        return Inertia::render('students/index', [
            'items' => $students,
        ]);
    })->name('students.index');

    Route::get('teachers', function (\Illuminate\Http\Request $request) {
        $perPage = (int) $request->query('per_page', 10);
        $q = $request->query('q');
        $teachers = \App\Models\Teacher::query()
            ->when($q, function ($query, $q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('last_name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%");
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->appends($request->query());

        return Inertia::render('teachers/index', [
            'items' => $teachers,
        ]);
    })->name('teachers.index');

    Route::get('subjects', function (\Illuminate\Http\Request $request) {
        $perPage = (int) $request->query('per_page', 10);
        $q = $request->query('q');
        $subjects = \App\Models\Subject::query()
            ->when($q, function ($query, $q) {
                $query->where('name', 'like', "%{$q}%")
                    ->orWhere('code', 'like', "%{$q}%");
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->appends($request->query());

        return Inertia::render('subjects/index', [
            'items' => $subjects,
        ]);
    })->name('subjects.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
