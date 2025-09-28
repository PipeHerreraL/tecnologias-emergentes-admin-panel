<?php

namespace App\Filament\Resources\Students\RelationManagers;

use Filament\Actions\AttachAction;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DetachAction;
use Filament\Actions\DetachBulkAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SubjectsRelationManager extends RelationManager
{
    protected static string $relationship = 'subjects';

    public function isReadOnly(): bool
    {
        return false;
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('code')
                    ->searchable(),
                TextColumn::make('credits')
                    ->searchable(),
            ])
            ->recordTitleAttribute('name')
            ->headerActions([
                AttachAction::make(),
            ])
            ->recordActions([
                DetachAction::make()
                    ->iconButton()
                    ->icon(Heroicon::OutlinedMinusCircle),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DetachBulkAction::make()
                        ->icon(Heroicon::OutlinedMinusCircle),
                ]),
            ]);
    }
}
