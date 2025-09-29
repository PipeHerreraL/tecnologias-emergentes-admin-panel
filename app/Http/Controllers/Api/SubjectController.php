<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    private function saveSubject(Request $request, Subject $subject, string $rule)
    {
        $data = $request->validate([
            'name' => $rule . '|string|max:255',
            'code' => $rule . '|string|max:255',
            'credits' => $rule . '|integer|min:0',
            'teacher_id' => 'sometimes|nullable|exists:teachers,id',
        ]);

        $subject->fill(collect($data)->only(['name', 'code', 'credits'])->all());
        if (array_key_exists('teacher_id', $data)) {
            $subject->teacher()->associate($data['teacher_id']);
        }
        $subject->save();

        return $subject;
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->query('per_page', 15);

        return response()->json(Subject::query()->paginate($perPage));
    }

    public function store(Request $request)
    {
        $subject = $this->saveSubject($request, new Subject, 'required');
        return response()->json($subject, 201);
    }

    public function show(Subject $subject)
    {
        return response()->json($subject);
    }

    public function update(Request $request, Subject $subject)
    {
        $subject = $this->saveSubject($request, $subject, 'sometimes');
        return response()->json($subject);
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
