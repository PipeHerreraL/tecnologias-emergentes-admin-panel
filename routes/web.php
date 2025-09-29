<?php

use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
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
    Route::get('students', function (Request $request) {
        $perPage = (int) $request->query('per_page', 10);
        $q = $request->query('q');
        $students = Student::query()
            ->when($q, function ($query, $q) {
                $query->where('name', 'like', "%$q%")
                    ->orWhere('last_name', 'like', "%$q%")
                    ->orWhere('email', 'like', "%$q%");
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->appends($request->query());

        return Inertia::render('students/index', [
            'items' => $students,
        ]);
    })->name('students.index');

    Route::get('teachers', function (Request $request) {
        $perPage = (int) $request->query('per_page', 10);
        $q = $request->query('q');
        $teachers = Teacher::query()
            ->when($q, function ($query, $q) {
                $query->where('name', 'like', "%$q%")
                    ->orWhere('last_name', 'like', "%$q%")
                    ->orWhere('email', 'like', "%$q%");
            })
            ->orderByDesc('id')
            ->paginate($perPage)
            ->appends($request->query());

        return Inertia::render('teachers/index', [
            'items' => $teachers,
        ]);
    })->name('teachers.index');

    Route::get('subjects', function (Request $request) {
        $perPage = (int) $request->query('per_page', 10);
        $q = $request->query('q');
        $subjects = Subject::query()
            ->when($q, function ($query, $q) {
                $query->where('name', 'like', "%$q%")
                    ->orWhere('code', 'like', "%$q%");
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

    Route::post('students', function (Request $request) {
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
        $student = Student::create($data);

        return redirect()->route('students.show', $student);
    })->name('students.store');

    Route::get('teachers/create', function () {
        return Inertia::render('teachers/create');
    })->name('teachers.create');

    Route::post('teachers', function (Request $request) {
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
        $teacher = Teacher::create($data);

        return redirect()->route('teachers.show', $teacher);
    })->name('teachers.store');

    Route::get('subjects/create', function () {
        $teachers = Teacher::query()
            ->select(['id', 'name', 'last_name'])
            ->orderBy('name')
            ->get();

        return Inertia::render('subjects/create', [
            'teachers' => $teachers,
        ]);
    })->name('subjects.create');

    Route::post('subjects', function (Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255',
            'credits' => 'required|integer|min:0',
            'teacher_id' => 'sometimes|nullable|exists:teachers,id',
        ]);
        $subject = new Subject;
        $subject->fill(collect($data)->only(['name', 'code', 'credits'])->all());
        if (array_key_exists('teacher_id', $data)) {
            $subject->teacher()->associate($data['teacher_id']);
        }
        $subject->save();

        return redirect()->route('subjects.show', $subject);
    })->name('subjects.store');

    // Edit pages
    Route::get('students/{student}/edit', function (Student $student) {
        return Inertia::render('students/edit', [
            'item' => $student,
        ]);
    })->name('students.edit');

    Route::put('students/{student}', function (Request $request, Student $student) {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'gender' => 'nullable|string|max:50',
            'document_type' => 'nullable|string|max:50',
            'document' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
        ]);
        $student->update($data);

        return redirect()->route('students.show', $student);
    })->name('students.update');

    Route::delete('students/{student}', function (Student $student) {
        $student->delete();

        return redirect()->route('students.index');
    })->name('students.destroy');

    Route::get('teachers/{teacher}/edit', function (Teacher $teacher) {
        return Inertia::render('teachers/edit', [
            'item' => $teacher,
        ]);
    })->name('teachers.edit');

    Route::put('teachers/{teacher}', function (Request $request, Teacher $teacher) {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'gender' => 'nullable|string|max:50',
            'document_type' => 'nullable|string|max:50',
            'document' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
        ]);
        $teacher->update($data);

        return redirect()->route('teachers.show', $teacher);
    })->name('teachers.update');

    Route::delete('teachers/{teacher}', function (Teacher $teacher) {
        $teacher->delete();

        return redirect()->route('teachers.index');
    })->name('teachers.destroy');

    Route::get('subjects/{subject}/edit', function (Subject $subject) {
        $teachers = Teacher::query()
            ->select(['id', 'name', 'last_name'])
            ->orderBy('name')
            ->get();
        $subject->load(['teacher:id,name,last_name']);

        return Inertia::render('subjects/edit', [
            'item' => $subject,
            'teachers' => $teachers,
        ]);
    })->name('subjects.edit');

    Route::put('subjects/{subject}', function (Request $request, Subject $subject) {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'code' => 'sometimes|required|string|max:255',
            'credits' => 'sometimes|required|integer|min:0',
            'teacher_id' => 'sometimes|nullable|exists:teachers,id',
        ]);
        $subject->fill(collect($data)->only(['name', 'code', 'credits'])->all());
        if (array_key_exists('teacher_id', $data)) {
            $subject->teacher()->associate($data['teacher_id']);
        }
        $subject->save();

        return redirect()->route('subjects.show', $subject);
    })->name('subjects.update');

    Route::delete('subjects/{subject}', function (Subject $subject) {
        $subject->delete();

        return redirect()->route('subjects.index');
    })->name('subjects.destroy');

    // Show pages
    Route::get('students/{student}', function (Student $student) {
        // Load subjects attached to this student
        $student->load(['subjects:id,name,code']);
        // Subjects not yet attached to this student
        $availableSubjects = Subject::query()
            ->select(['id', 'name', 'code'])
            ->whereNotIn('id', $student->subjects()->pluck('subjects.id'))
            ->orderBy('name')
            ->get();

        return Inertia::render('students/show', [
            'item' => $student,
            'available_subjects' => $availableSubjects,
        ]);
    })->name('students.show');

    Route::post('students/{student}/subjects/attach', function (Request $request, Student $student) {
        $data = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
        ]);
        // Attach only if not already attached
        $student->subjects()->syncWithoutDetaching([$data['subject_id']]);

        return redirect()->route('students.show', $student);
    })->name('students.subjects.attach');

    Route::get('teachers/{teacher}', function (Teacher $teacher) {
        // Load subjects associated with this teacher and include teachers_code on the model
        $teacher->load(['subjects:id,name,code,teacher_id']);
        // Subjects that are unassigned (teacher_id is null)
        $availableSubjects = Subject::query()
            ->select(['id', 'name', 'code'])
            ->whereNull('teacher_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('teachers/show', [
            'item' => $teacher,
            'available_subjects' => $availableSubjects,
        ]);
    })->name('teachers.show');

    Route::post('teachers/{teacher}/subjects/associate', function (Request $request, Teacher $teacher) {
        $data = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
        ]);
        $subject = Subject::findOrFail($data['subject_id']);
        // Only allow association if currently unassigned
        if (is_null($subject->teacher_id)) {
            $subject->teacher()->associate($teacher->id);
            $subject->save();
        }

        return redirect()->route('teachers.show', $teacher);
    })->name('teachers.subjects.associate');

    Route::get('subjects/{subject}', function (Subject $subject) {
        $subject->load([
            'teacher:id,name,last_name',
            'students:id,name,last_name',
        ]);
        // Students not yet attached to this subject
        $availableStudents = Student::query()
            ->select(['id', 'name', 'last_name'])
            ->whereNotIn('id', $subject->students()->pluck('students.id'))
            ->orderBy('name')
            ->get();

        return Inertia::render('subjects/show', [
            'item' => $subject,
            'available_students' => $availableStudents,
        ]);
    })->name('subjects.show');

    Route::post('subjects/{subject}/students/attach', function (Request $request, Subject $subject) {
        $data = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
        ]);
        $subject->students()->syncWithoutDetaching([$data['student_id']]);

        return redirect()->route('subjects.show', $subject);
    })->name('subjects.students.attach');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
