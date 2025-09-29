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

    // Create pages
    Route::get('students/create', function () {
        return Inertia::render('students/create');
    })->name('students.create');

    Route::post('students', function (\Illuminate\Http\Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'gender' => 'nullable|string|max:50',
            'document_type' => 'nullable|string|max:50',
            'document' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
        ]);
        $student = \App\Models\Student::create($data);
        return redirect()->route('students.show', $student);
    })->name('students.store');

    Route::get('teachers/create', function () {
        return Inertia::render('teachers/create');
    })->name('teachers.create');

    Route::post('teachers', function (\Illuminate\Http\Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'gender' => 'nullable|string|max:50',
            'document_type' => 'nullable|string|max:50',
            'document' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
        ]);
        $teacher = \App\Models\Teacher::create($data);
        return redirect()->route('teachers.show', $teacher);
    })->name('teachers.store');

    Route::get('subjects/create', function () {
        $teachers = \App\Models\Teacher::query()
            ->select(['id','name','last_name'])
            ->orderBy('name')
            ->get();
        return Inertia::render('subjects/create', [
            'teachers' => $teachers,
        ]);
    })->name('subjects.create');

    Route::post('subjects', function (\Illuminate\Http\Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'credits' => 'required|integer|min:0',
            'teacher_id' => 'sometimes|nullable|exists:teachers,id',
        ]);
        $subject = new \App\Models\Subject();
        $subject->fill(collect($data)->only(['name','code','credits'])->all());
        if (array_key_exists('teacher_id', $data)) {
            $subject->teacher()->associate($data['teacher_id']);
        }
        $subject->save();
        return redirect()->route('subjects.show', $subject);
    })->name('subjects.store');

    // Show pages
    Route::get('students/{student}', function (\App\Models\Student $student) {
        return Inertia::render('students/show', [
            'item' => $student,
        ]);
    })->name('students.show');

    Route::get('teachers/{teacher}', function (\App\Models\Teacher $teacher) {
        return Inertia::render('teachers/show', [
            'item' => $teacher,
        ]);
    })->name('teachers.show');

    Route::get('subjects/{subject}', function (\App\Models\Subject $subject) {
        $subject->load(['teacher:id,name,last_name']);

        return Inertia::render('subjects/show', [
            'item' => $subject,
        ]);
    })->name('subjects.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
