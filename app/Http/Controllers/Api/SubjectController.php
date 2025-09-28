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

    public function store(Request $request): JsonResource
    {
        $data = $request->validate([
            'name' => ['required','string','max:255'],
            'code' => ['nullable','string','max:255'],
            'credits' => ['nullable','integer','min:0'],
        ]);

        $subject = Subject::create($data);

        return JsonResource::make($subject);
    }

    public function show(Subject $subject): JsonResource
    {
        $subject->load(['students', 'teacher']);

        return JsonResource::make($subject);
    }

    public function update(Request $request, Subject $subject): JsonResource
    {
        $data = $request->validate([
            'name' => ['sometimes','required','string','max:255'],
            'code' => ['sometimes','nullable','string','max:255'],
            'credits' => ['sometimes','nullable','integer','min:0'],
        ]);

        $subject->update($data);
        $subject->refresh();

        return JsonResource::make($subject);
    }

    public function destroy(Subject $subject): JsonResource
    {
        $subject->delete();

        return JsonResource::make(['deleted' => true]);
    }
}
