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
                $q->where('first_name', 'like', "%$search%")
                  ->orWhere('last_name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        $perPage = (int) $request->integer('per_page', 10);
        $teachers = $query->orderByDesc('id')->paginate($perPage);

        return JsonResource::make($teachers);
    }

    public function show(Teacher $teacher): JsonResource
    {
        $teacher->load('subjects');

        return JsonResource::make($teacher);
    }
}
