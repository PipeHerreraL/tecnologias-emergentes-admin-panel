<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);

        return response()->json(Teacher::query()->paginate($perPage));
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

        return response()->json($teacher, 201);
    }

    public function show(Teacher $teacher)
    {
        return response()->json($teacher);
    }

    public function update(Request $request, Teacher $teacher)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|nullable|email|max:255',
            'phone' => 'sometimes|nullable|string|max:255',
            'address' => 'sometimes|nullable|string|max:255',
            'gender' => 'sometimes|nullable|string|max:50',
            'document_type' => 'sometimes|nullable|string|max:50',
            'document' => 'sometimes|nullable|string|max:255',
            'birth_date' => 'sometimes|nullable|date',
        ]);

        $teacher->update($data);

        return response()->json($teacher);
    }

    public function destroy(Teacher $teacher)
    {
        $teacher->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
