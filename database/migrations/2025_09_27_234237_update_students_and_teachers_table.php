<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('email')->unique();
            $table->string('phone', 15)->unique();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->enum('document_type', ['passport', 'id_card'])->nullable();
            $table->date('birth_date')->nullable();
        });

        Schema::table('teachers', function (Blueprint $table) {
            $table->string('email')->unique();
            $table->string('phone', 15)->unique();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->enum('document_type', ['passport', 'id_card'])->nullable();
            $table->date('birth_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'email',
                'phone',
                'gender',
                'document_type',
                'birth_date',
            ]);
        });

        Schema::table('teachers', function (Blueprint $table) {
            $table->dropColumn([
                'email',
                'phone',
                'gender',
                'document_type',
                'birth_date',
            ]);
        });
    }
};
