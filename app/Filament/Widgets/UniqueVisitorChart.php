<?php

namespace App\Filament\Widgets;

use Filament\Support\RawJs;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Arr;

class UniqueVisitorChart extends ChartWidget
{
    protected ?string $heading = 'Unique Visitor Chart';
    protected static ?int $sort = 1;

    public ?string $filter = 'week';

    protected function getFilters(): ?array
    {
        return [
            'week' => 'Semana',
            'month' => 'Mes',
        ];
    }

    protected function getData(): array
    {
        $activeFilter = $this->filter;

        $pageViewsData = $activeFilter === 'month'
            ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35]
            : [31, 40, 28, 51, 42, 109, 100];

        $sessionsData = $activeFilter === 'month'
            ? [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41]
            : [11, 32, 45, 32, 34, 52, 41];

        $labels = $activeFilter === 'month'
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        return [
            'datasets' => [
                [
                    'label' => 'Page Views',
                    'data' => $pageViewsData,
                    'backgroundColor' => 'rgba(54, 162, 235, 0.2)',
                    'borderColor' => 'rgba(54, 162, 235, 1)',
                    'borderWidth' => 2,
                    'tension' => 0.4,
                    'fill' => true,
                    'pointRadius' => 0,
                    // Colores de los puntos en estado normal
                    'pointBackgroundColor' => 'rgba(54, 162, 235, 0.2)',
                    'pointBorderColor' => 'rgba(54, 162, 235, 0.2)',
                    'pointBorderWidth' => 2,
                    // Colores de los puntos en HOVER
                    'pointHoverColor' => 'rgba(54, 162, 235, 0.2)',
                    'pointHoverBackgroundColor' => 'rgba(54, 162, 235, 0.2)',
                    'pointHoverBorderColor' => 'rgba(54, 162, 235, 0.2)',
                    'pointHoverBorderWidth' => 2,
                    'pointHoverRadius' => 2,
                ],
                [
                    'label' => 'Sessions',
                    'data' => $sessionsData,
                    'backgroundColor' => 'rgba(54, 162, 235, 0.5)',
                    'borderColor' => 'rgba(54, 162, 235, 1)',
                    'borderWidth' => 2,
                    'tension' => 0.4,
                    'fill' => true,
                    'pointRadius' => 0,
                    // Colores de los puntos en estado normal
                    'pointBackgroundColor' => 'rgba(54, 162, 235, 0.8)',
                    'pointBorderColor' => 'rgba(54, 162, 235, 0.8)',
                    'pointBorderWidth' => 2,
                    // Colores de los puntos en HOVER
                    'pointHoverColor' => 'rgba(54, 162, 235, 0.8)',
                    'pointHoverBackgroundColor' => 'rgba(54, 162, 235, 0.8)',
                    'pointHoverBorderColor' => 'rgba(54, 162, 235, 0.8)',
                    'pointHoverBorderWidth' => 2,
                    'pointHoverRadius' => 2,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function createDataset(string $label, array $data, string $color, string $hoverColor): array
    {
        return [
            'label' => $label,
            'data' => $data,
            'backgroundColor' => Arr::get($this->getColors(), "{$label}.background", $color),
            'borderColor' => Arr::get($this->getColors(), "{$label}.border", $color),
            'borderWidth' => 2,
            'tension' => 0.4,
            'fill' => 'start',
            'pointRadius' => 0,
            'pointHoverRadius' => 4,
            'pointHitRadius' => 10,
            'pointHoverBackgroundColor' => $hoverColor,
            'pointHoverBorderColor' => '#ffffff',
            'pointHoverBorderWidth' => 2,
            'pointBackgroundColor' => $color,
            'pointHoverColor' => $hoverColor,
        ];
    }

    protected function getColors(): array
    {
        $primary = '54, 162, 235';
        return [
            'Page Views' => [
                'background' => "rgba({$primary}, 0.2)",
                'border' => "rgb({$primary})",
            ],
            'Sessions' => [
                'background' => "rgba({$primary}, 0.5)",
                'border' => "rgb({$primary})",
            ],
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
