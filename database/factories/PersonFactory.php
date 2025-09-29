<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

abstract class PersonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $genders = ['male', 'female', 'other'];
        $documentTypes = ['passport', 'id_card'];
        $birthDateObject = $this->faker->dateTimeBetween('-30 years', '-18 years');

        return [
            'document' => $this->faker->unique()->numberBetween(10000000, 99999999),
            'name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'address' => $this->faker->address(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $this->faker->unique()->phoneNumber(),
            'gender' => $this->faker->randomElement($genders),
            'document_type' => $this->faker->randomElement($documentTypes),
            'birth_date' => $birthDateObject->format('Y-m-d'),
        ];
    }
}
