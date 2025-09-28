<?php

namespace App\Filament\Resources\Students\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class StudentInfolist
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
                    ])->columns(2),
                Section::make('Identity')
                    ->schema([
                        TextEntry::make('document_type')
                            ->formatStateUsing(fn (string $state): string => match ($state) {
                                'id_card' => 'ID Card',
                                'passport' => 'Passport',
                                default => ucfirst($state),
                            }),
                        TextEntry::make('document'),
                        TextEntry::make('birth_date')
                            ->date(),
                    ])->columns(3),
            ])->columns(1);
    }
}
