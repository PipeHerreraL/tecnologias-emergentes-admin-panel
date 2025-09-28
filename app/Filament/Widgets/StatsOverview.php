<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends StatsOverviewWidget
{
    protected ?string $heading = 'Stats Overview';

    protected function getStats(): array
    {
        return [
            Stat::make('Total Page Views', '442,236')
                ->description('You made an extra 35,000 this year')
                ->descriptionIcon('heroicon-o-arrow-trending-up')
                ->color('info'),

            Stat::make('Total Users', '78,250')
                ->description('You made an extra 8,900 this year')
                ->descriptionIcon('heroicon-o-arrow-trending-up')
                ->color('info'),

            Stat::make('Total Orders', '18,800')
                ->description('You made an extra 1,943 this year')
                ->descriptionIcon('heroicon-o-arrow-trending-down')
                ->color('warning'),

            Stat::make('Total Sales', '$35,078')
                ->description('You made an extra 20,395 this year')
                ->descriptionIcon('heroicon-o-arrow-trending-down')
                ->color('warning'),
        ];
    }
}
