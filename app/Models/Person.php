<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

abstract class Person extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'last_name',
        'email',
        'phone',
        'address',
        'gender',
        'document_type',
        'document',
        'birth_date',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'birth_date' => 'date',
    ];

    /**
     * Accessor to get the current age based on birth_date.
     * This field is calculated and NOT stored in the database.
     *
     * @return int|null
     */
    public function getAgeAttribute(): ?int
    {
        if (is_null($this->birth_date)) {
            return null;
        }
        return $this->birth_date->diffInYears(Carbon::now());
    }
}
