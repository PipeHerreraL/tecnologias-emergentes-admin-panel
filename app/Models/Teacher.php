<?php

namespace App\Models;

use Database\Factories\TeacherFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

/**
 * @method static create(array $data)
 *
 * @property mixed $id
 */
class Teacher extends Person
{
    /** @use HasFactory<TeacherFactory> */
    use HasFactory;

    protected $table = 'teachers';

    protected $guarded = [];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function ($teacher) {
            DB::transaction(function () use ($teacher) {
                $lastTeacher = self::orderBy('teachers_code', 'desc')->first();

                $lastNumber = 0;
                if ($lastTeacher && preg_match('/-(\d+)$/', $lastTeacher->teachers_code, $matches)) {
                    $lastNumber = (int) $matches[1];
                }

                $newNumber = $lastNumber + 1;

                $formattedNumber = str_pad($newNumber, 6, '0', STR_PAD_LEFT);

                $teacher->teachers_code = 'TC-'.$formattedNumber;
            });
        });
    }

    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class);
    }
}
