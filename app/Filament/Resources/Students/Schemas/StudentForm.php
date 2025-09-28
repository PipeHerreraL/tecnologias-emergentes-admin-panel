<?php

namespace App\Filament\Resources\Students\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Radio;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class StudentForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Details')
                    ->schema([
                        TextInput::make('name'),
                        TextInput::make('last_name'),
                        TextInput::make('email'),
                        TextInput::make('phone'),
                        TextInput::make('address'),
                        Radio::make('gender')
                            ->options([
                                'male' => 'Male',
                                'female' => 'Female',
                                'other' => 'Other',
                            ]),
                    ]),
                Section::make('Identity')
                    ->schema([
                        Select::make('document_type')
                            ->options([
                                'passport' => 'Passport',
                                'id_card' => 'ID Card',
                            ]),
                        TextInput::make('document'),
                        DatePicker::make('birth_date'),
                    ]),
            ]);
    }
}
