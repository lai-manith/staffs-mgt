import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { DoughnutChartComponent } from './components/doughnut-chart/doughnut-chart.component';
import { OverlappedDoughnut } from './overlapped-doughnut';
import { Chart } from 'chart.js';
import { HoveringLine } from './hovering-line';

Chart.register(OverlappedDoughnut, HoveringLine);

@NgModule({
  declarations: [LineChartComponent, DoughnutChartComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [LineChartComponent, DoughnutChartComponent]
})
export class ChartModule {}
