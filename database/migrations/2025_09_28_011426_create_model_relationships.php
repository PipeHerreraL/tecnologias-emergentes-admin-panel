<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_subject', function (Blueprint $table) {
            $table->foreignId('student_id')
                ->constrained()
                ->onDelete('cascade');
            $table->foreignId('subject_id')
                ->constrained()
                ->onDelete('cascade');
            $table->primary(['student_id', 'subject_id']);
        });

        Schema::table('subjects', function (Blueprint $table) {
            $table->foreignId('teacher_id')
                ->nullable()
                ->constrained('teachers')
                ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_subject');

        Schema::table('subjects', function (Blueprint $table) {
            $table->dropForeign(['teacher_id']);
            $table->dropColumn('teacher_id');
        });
    }
};
