<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\SubjectController;
use App\Http\Controllers\Api\TeacherController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Auth endpoints (login without token middleware)
    Route::post('/login', [AuthController::class, 'login']);

    // Protected endpoints
    Route::middleware('token')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

        Route::apiResource('students', StudentController::class)->names('api.students');
        Route::apiResource('teachers', TeacherController::class)->names('api.teachers');
        Route::apiResource('subjects', SubjectController::class)->names('api.subjects');
    });
});
