<?php

namespace App\Filament\Widgets;

use Filament\Support\RawJs;
use Filament\Widgets\ChartWidget;

class UniqueVisitorChart extends ChartWidget
{
    protected ?string $heading = 'Unique Visitor Chart';

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'label' => 'Page Views',
                    'data' => [31, 40, 28, 51, 42, 109, 100],
                    'backgroundColor' => 'rgba(54, 162, 235, 0.2)',
                    'borderColor' => 'rgba(54, 162, 235, 1)',
                    'borderWidth' => 2,
                    'tension' => 0.4,
                    'fill' => true,
                    'pointRadius' => 0,
                    'pointHoverColor' => 'rgba(54, 162, 235, 0.2)',
                    'pointHoverBackgroundColor' => 'rgba(54, 162, 235, 0.2)',
                    'pointHoverBorderColor' => 'rgba(54, 162, 235, 0.2)',
                    'pointHoverBorderWidth' => 2,
                    'pointBackgroundColor' => 'rgba(54, 162, 235, 0.2)',
                    'pointBorderColor' => 'rgba(54, 162, 235, 0.2)',
                    'pointBorderWidth' => 2,
                    'pointHoverRadius' => 2,
                ],
                [
                    'label' => 'Sessions',
                    'data' => [11, 32, 45, 32, 34, 52, 41],
                    'backgroundColor' => 'rgba(54, 162, 235, 0.5)',
                    'borderColor' => 'rgba(54, 162, 235, 1)',
                    'borderWidth' => 2,
                    'tension' => 0.4,
                    'fill' => true,
                    'pointRadius' => 0,
                    'pointHoverColor' => 'rgba(54, 162, 235, 0.8)',
                    'pointHoverBackgroundColor' => 'rgba(54, 162, 235, 0.8)',
                    'pointHoverBorderColor' => 'rgba(54, 162, 235, 0.8)',
                    'pointHoverBorderWidth' => 2,
                    'pointBackgroundColor' => 'rgba(54, 162, 235, 0.8)',
                    'pointBorderColor' => 'rgba(54, 162, 235, 0.8)',
                    'pointBorderWidth' => 2,
                    'pointHoverRadius' => 2,
                ],
            ],
            'labels' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array|RawJs|null
    {
        return [
            'interaction' => [
                'mode' => 'nearest',
                'intersect' => false,
                'axis' => 'x',
            ],
        ];
    }
}
