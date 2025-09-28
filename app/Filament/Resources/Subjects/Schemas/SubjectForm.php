<?php

namespace App\Filament\Resources\Subjects\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SubjectForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Details')
                    ->schema([
                        TextInput::make('name')
                            ->required(),
                        TextInput::make('code')
                            ->required(),
                        TextInput::make('credits')
                            ->required()
                            ->numeric(),
                    ]),
                Section::make('Teacher')
                    ->schema([
                        Select::make('teacher_id')
                            ->relationship('teacher', 'name')
                            ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->name} {$record->last_name}"
                            )
                            ->searchable(['name', 'last_name', 'document'])
                            ->preload()
                            ->nullable(),
                    ]),
            ]);
    }
}
