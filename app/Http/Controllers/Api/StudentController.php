<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResource
    {
        $query = Student::query()->withCount('subjects');

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('last_name', 'like', "%$search%")
                  ->orWhere('document', 'like', "%$search%")
                  ->orWhere('address', 'like', "%$search%");
            });
        }

        $perPage = (int) $request->integer('per_page', 10);
        $students = $query->orderByDesc('id')->paginate($perPage);

        return JsonResource::make($students);
    }

    /**
     * Store a newly created resource in storage.
     */
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

        $student = Student::create($data);

        return JsonResource::make($student);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student): JsonResource
    {
        $student->load('subjects');

        return JsonResource::make($student);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Student $student): JsonResource
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

        $student->update($data);
        $student->refresh();

        return JsonResource::make($student);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student): JsonResource
    {
        $student->delete();

        return JsonResource::make(['deleted' => true]);
    }
}
