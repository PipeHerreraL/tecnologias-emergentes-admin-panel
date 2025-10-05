<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $q = $request->query('q');
        $teachers = Teacher::query()
            ->when($q, function ($query, $q) {
                $query->where('name', 'like', "%$q%")
                    ->orWhere('last_name', 'like', "%$q%")
                    ->orWhere('email', 'like', "%$q%");
            })
            ->orderBy('id')
            ->paginate($perPage)
            ->appends($request->query());

        return Inertia::render('teachers/index', [
            'items' => $teachers,
        ]);
    }

    public function show(Teacher $teacher)
    {
        $teacher->load(['subjects:id,name,code,teacher_id']);

        $availableSubjects = Subject::query()
            ->select(['id', 'name', 'code'])
            ->whereNull('teacher_id')
            ->orderBy('name')
            ->get();

        return Inertia::render('teachers/show', [
            'item' => $teacher,
            'available_subjects' => $availableSubjects,
        ]);
    }

    public function create()
    {
        return Inertia::render('teachers/create');
    }

    public function store(Request $request)
    {
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
    }

    public function edit(Teacher $teacher)
    {
        return Inertia::render('teachers/edit', [
            'item' => $teacher,
        ]);
    }

    public function update(Request $request, Teacher $teacher)
    {
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
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->delete();

        return redirect()->route('teachers.index');
    }

    public function subjectAssociate(Request $request, Teacher $teacher)
    {
        $data = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
        ]);
        $subject = Subject::findOrFail($data['subject_id']);

        if (is_null($subject->teacher_id)) {
            $subject->teacher()->associate($teacher->id);
            $subject->save();
        }

        return redirect()->route('teachers.show', $teacher);
    }
}
