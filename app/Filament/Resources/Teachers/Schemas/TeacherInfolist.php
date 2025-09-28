<?php

namespace App\Filament\Resources\Teachers\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class TeacherInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Basic Details')
                    ->schema([
                        TextEntry::make('name'),
                        TextEntry::make('last_name'),
                        TextEntry::make('email'),
                        TextEntry::make('phone'),
                        TextEntry::make('address'),
                        TextEntry::make('age'),
                        TextEntry::make('gender')
                            ->formatStateUsing(fn (string $state): string => ucfirst($state)),
                    ]),
                Section::make('Identity')
                    ->schema([
                        TextEntry::make('document_type')
                            ->formatStateUsing(fn (string $state): string => ucfirst($state)),
                        TextEntry::make('document'),
                        TextEntry::make('birth_date')
                            ->date(),
                    ]),
            ]);
    }
}
