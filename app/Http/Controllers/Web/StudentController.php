<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 10);
        $q = $request->query('q');
        $students = Student::query()
            ->when($q, function ($query, $q) {
                $query->where('name', 'like', "%$q%")
                    ->orWhere('last_name', 'like', "%$q%")
                    ->orWhere('email', 'like', "%$q%");
            })
            ->orderBy('id')
            ->paginate($perPage)
            ->appends($request->query());

        return Inertia::render('students/index', [
            'items' => $students,
        ]);
    }

    public function show(Student $student)
    {
        $student->load(['subjects:id,name,code']);

        $availableSubjects = Subject::query()
            ->select(['id', 'name', 'code'])
            ->whereNotIn('id', $student->subjects()->pluck('subjects.id'))
            ->orderBy('name')
            ->get();

        return Inertia::render('students/show', [
            'item' => $student,
            'available_subjects' => $availableSubjects,
        ]);
    }

    public function create()
    {
        return Inertia::render('students/create');
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
        $student = Student::create($data);

        return redirect()->route('students.show', $student);
    }

    public function edit(Student $student)
    {
        return Inertia::render('students/edit', [
            'item' => $student,
        ]);
    }

    public function update(Request $request, Student $student)
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
        $student->update($data);

        return redirect()->route('students.show', $student);
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->route('students.index');
    }

    public function subjectAttach(Request $request, Student $student)
    {
        $data = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
        ]);
        $student->subjects()->syncWithoutDetaching([$data['subject_id']]);

        return redirect()->route('students.show', $student);
    }
}
