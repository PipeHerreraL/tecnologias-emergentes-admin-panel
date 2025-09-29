<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
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
    }

    public function show(Subject $subject)
    {
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
    }

    public function create()
    {
        $teachers = Teacher::query()
            ->select(['id', 'name', 'last_name'])
            ->orderBy('name')
            ->get();

        return Inertia::render('subjects/create', [
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
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
    }

    public function edit(Subject $subject)
    {
        $teachers = Teacher::query()
            ->select(['id', 'name', 'last_name'])
            ->orderBy('name')
            ->get();
        $subject->load(['teacher:id,name,last_name']);

        return Inertia::render('subjects/edit', [
            'item' => $subject,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Subject $subject)
    {
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
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();

        return redirect()->route('subjects.index');
    }

    public function studentAttach(Request $request, Subject $subject)
    {
        $data = $request->validate([
            'student_id' => ['required', 'exists:students,id'],
        ]);
        $subject->students()->syncWithoutDetaching([$data['student_id']]);

        return redirect()->route('subjects.show', $subject);
    }
}
