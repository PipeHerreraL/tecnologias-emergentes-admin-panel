<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherController extends Controller
{
    public function index(Request $request): JsonResource
    {
        $query = Teacher::query()->withCount('subjects');

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('last_name', 'like', "%$search%")
                  ->orWhere('document', 'like', "%$search%")
                  ->orWhere('address', 'like', "%$search%");
            });
        }

        $perPage = (int) $request->integer('per_page', 10);
        $teachers = $query->orderByDesc('id')->paginate($perPage);

        return JsonResource::make($teachers);
    }

    public function store(Request $request): JsonResource
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'last_name' => ['required','string','max:255'],
            'document' => ['nullable','string','max:255'],
            'address' => ['nullable','string','max:255'],
            'email' => ['nullable','email','max:255'],
            'phone' => ['nullable','string','max:255'],
            'gender' => ['nullable','string','in:male,female,other'],
            'document_type' => ['nullable','string','max:255'],
            'birth_date' => ['nullable','date'],
        ]);

        $teacher = Teacher::create($data);

        return JsonResource::make($teacher);
    }

    public function show(Teacher $teacher): JsonResource
    {
        $teacher->load('subjects');

        return JsonResource::make($teacher);
    }

    public function update(Request $request, Teacher $teacher): JsonResource
    {
        $data = $request->validate([
            'name' => ['sometimes','required','string','max:255'],
            'last_name' => ['sometimes','required','string','max:255'],
            'document' => ['sometimes','nullable','string','max:255'],
            'address' => ['sometimes','nullable','string','max:255'],
            'email' => ['sometimes','nullable','email','max:255'],
            'phone' => ['sometimes','nullable','string','max:255'],
            'gender' => ['sometimes','nullable','string','in:male,female,other'],
            'document_type' => ['sometimes','nullable','string','max:255'],
            'birth_date' => ['sometimes','nullable','date'],
        ]);

        $teacher->update($data);
        $teacher->refresh();

        return JsonResource::make($teacher);
    }

    public function destroy(Teacher $teacher): JsonResource
    {
        $teacher->delete();

        return JsonResource::make(['deleted' => true]);
    }
}
