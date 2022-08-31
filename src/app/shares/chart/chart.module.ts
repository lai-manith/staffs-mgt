import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { NgChartsModule } from 'ng2-charts';
import { DoughnutChartComponent } from './components/doughnut-chart/doughnut-chart.component';
import { OverlappedDoughnut } from './overlapped-doughnut';
import { Chart } from 'chart.js';
import { HoveringLine } from './hovering-line';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { BarChartReportComponent } from './components/bar-chart-report/bar-chart-report.component';
import { DoughnutChartReportComponent } from './components/doughnut-chart-report/doughnut-chart-report.component';

Chart.register(OverlappedDoughnut, HoveringLine);

@NgModule({
  declarations: [LineChartComponent, DoughnutChartComponent, BarChartComponent, BarChartReportComponent, DoughnutChartReportComponent],
  imports: [CommonModule, NgChartsModule],
  exports: [LineChartComponent, DoughnutChartComponent, BarChartComponent, BarChartReportComponent, DoughnutChartReportComponent]
})
export class ChartModule {}
