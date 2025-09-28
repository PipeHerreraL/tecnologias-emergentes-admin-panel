<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectController extends Controller
{
    public function index(Request $request): JsonResource
    {
        $query = Subject::query()->withCount(['students', 'teacher']);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('code', 'like', "%$search%");
            });
        }

        $perPage = (int) $request->integer('per_page', 10);
        $subjects = $query->orderByDesc('id')->paginate($perPage);

        return JsonResource::make($subjects);
    }

    public function show(Subject $subject): JsonResource
    {
        $subject->load(['students', 'teacher']);

        return JsonResource::make($subject);
    }
}
