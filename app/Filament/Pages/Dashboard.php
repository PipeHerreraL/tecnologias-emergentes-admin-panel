<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\IncomeOverviewChart;
use App\Filament\Widgets\StatsOverview;
use App\Filament\Widgets\UniqueVisitorChart;
use BackedEnum;
use Filament\Pages\Dashboard as BaseDashboard;
use Filament\Support\Icons\Heroicon;

class Dashboard extends BaseDashboard
{
    protected static string | BackedEnum | null $navigationIcon = Heroicon::OutlinedHome;

    protected static string | BackedEnum | null $activeNavigationIcon = Heroicon::Home;

    public function getWidgets(): array
    {
        return [
            StatsOverview::class,
            UniqueVisitorChart::class,
            IncomeOverviewChart::class,
        ];
    }
}
