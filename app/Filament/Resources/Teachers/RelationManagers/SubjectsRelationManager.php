<?php

namespace App\Filament\Resources\Teachers\RelationManagers;

use Filament\Actions\AssociateAction;
use Filament\Actions\DissociateAction;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

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
                AssociateAction::make()
                    ->recordSelectOptionsQuery(fn (Builder $query) => $query->whereNull('teacher_id')
                    ),
            ])
            ->recordActions([
                DissociateAction::make()
                    ->iconButton()
                    ->icon(Heroicon::OutlinedMinusCircle),
            ]);
    }
}
