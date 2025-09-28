<?php

namespace App\Filament\Resources\Subjects\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class SubjectInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Details')
                    ->schema([
                        TextEntry::make('name'),
                        TextEntry::make('code'),
                        TextEntry::make('credits'),
                    ])->columns(3),
                Section::make('Teacher')
                    ->schema([
                        TextEntry::make('teacher.name')
                            ->label('Teacher')
                            ->formatStateUsing(fn ($state, $record) => $record->teacher
                                ? $record->teacher->name.' '.$record->teacher->last_name
                                : 'N/A'),
                    ]),
            ]);
    }
}
