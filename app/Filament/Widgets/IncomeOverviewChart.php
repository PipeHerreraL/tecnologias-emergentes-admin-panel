<?php

namespace App\Filament\Widgets;

use Filament\Support\RawJs;
use Filament\Widgets\ChartWidget;

class IncomeOverviewChart extends ChartWidget
{
    protected ?string $heading = 'Income Overview Chart';

    protected function getData(): array
    {
        return [
            'datasets' => [
                [
                    'data' => [80, 95, 70, 42, 65, 55, 78],
                    'backgroundColor' => ['rgba(0, 255, 255, 1)'],
                    'borderColor' => ['rgba(0, 255, 255, 1)'],
                    'borderWidth' => 1,
                ],
            ],
            'labels' => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }

    protected function getOptions(): array|RawJs|null
    {
        return [
            'plugins' => [
                'title' => [
                    'display' => true,
                    'text' => 'This week Statistics',
                    'align' => 'start',
                    'padding' => [
                        'bottom' => 20,
                    ],
                    'color' => '#000',
                    'font' => [
                        'weight' => 'normal',
                    ]
                ],
                'subtitle' => [
                    'display' => true,
                    'text' => '$7,650',
                    'align' => 'start',
                    'padding' => [
                        'bottom' => 32,
                    ],
                    'color' => '#000',
                    'font' => [
                        'size' => 28,
                        'weight' => 'bold',
                    ],
                ],
                'legend' => [
                    'display' => false,
                ],
            ],
            'elements' => [
                'bar' => [
                    'borderRadius' => 4,
                ],
            ],
        ];
    }
}
