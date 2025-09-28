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
                $q->where('first_name', 'like', "%$search%")
                  ->orWhere('last_name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        $perPage = (int) $request->integer('per_page', 10);
        $students = $query->orderByDesc('id')->paginate($perPage);

        return JsonResource::make($students);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student): JsonResource
    {
        $student->load('subjects');

        return JsonResource::make($student);
    }
}
