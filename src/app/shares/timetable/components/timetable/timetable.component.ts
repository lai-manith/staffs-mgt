import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'src/app/models/subject';
import { Schedule, ScheduleHeader, ScheduleUI, TimeBlock, TimeDetail, TimetableData } from 'src/app/models/timetable';
import { TimePipe } from 'src/app/shares/static-time/pipe/time.pipe';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'src/assets/fonts/vfs_fonts';
import { FullNamePipe } from 'src/app/shares/name/pipes/full-name.pipe';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit, OnChanges {
  @Input() columnHeight: number = 50;
  @Input() days: ScheduleHeader[] = [];
  @Input() displayedColumns: ScheduleHeader[] = [
    'time',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ];
  @Input() times: TimeBlock[] = [];
  @Input() timetableDataList: TimetableData[];
  @Input() isEdit: boolean;
  dataSource: MatTableDataSource<any>;
  private element_data: any = [
    { time: '6:00 AM' },
    { time: '' },
    { time: '7:00 AM' },
    { time: '' },
    { time: '8:00 AM' },
    { time: '' },
    { time: '9:00 AM' },
    { time: '' },
    { time: '10:00 AM' },
    { time: '' },
    { time: '11:00 AM' },
    { time: '' },
    { time: '12:00 PM' },
    { time: '' },
    { time: '1:00 PM' },
    { time: '' },
    { time: '2:00 PM' },
    { time: '' },
    { time: '3:00 PM' },
    { time: '' },
    { time: '4:00 PM' },
    { time: '' },
    { time: '5:00 PM' },
    { time: '' }
  ];
  @Output() actionEvent = new EventEmitter<{ timetable: ScheduleUI; type: 'edit' | 'delete' }>();
  private timetableData: Schedule[] = [];

  ngOnInit(): void {
    this.element_data = this.times?.length ? [...this.times] : this.element_data;
    this.displayedColumns = this.days?.length ? [...this.days] : this.displayedColumns;
    this.dataSource = this.element_data;
    const formattedData = this.reformatData();
    this.renderScheduleData(formattedData);
  }

  ngOnChanges({ timetableDataList }: SimpleChanges): void {
    const formattedData = this.reformatData();
    this.renderScheduleData(formattedData);
  }

  private clearScheduleData(): void {
    for (const value of this.timetableData) {
      const startTimeHour = value.time.start_time.hour;
      const timetableIndex = startTimeHour - 6;
      for (let n = 0; n < this.element_data.length; n++) {
        if (n === timetableIndex) {
          n = timetableIndex * 2;
          const weekday = this.displayedColumns[value.weekday];
          this.element_data[n][weekday] = null;
        }
      }
    }
  }

  private reformatData(): any {
    let preparedTimetable: Schedule[][] = [];
    if (this.timetableDataList?.length) {
      preparedTimetable = this.timetableDataList.map(timetableData =>
        timetableData.time_tables.map(timetable => ({
          id: timetable._id,
          time: {
            start_time: this.to24Hours(timetable.start_time + ''),
            end_time: this.to24Hours(timetable.end_time + ''),
            interval: timetable.end_time - timetable.start_time
          },
          weekday: timetableData._id,
          subject: { _id: timetable.subjects._id, name: timetable.subjects.name, color: timetable.subjects.color },
          staff: timetable.staffs,
          room: timetable.rooms
        }))
      );
    }
    return preparedTimetable.reduce((accumulator, value) => accumulator.concat(value), []);
  }

  private renderScheduleData(timetableData: any): void {
    this.clearScheduleData();
    this.timetableData = timetableData;
    for (const value of this.timetableData as any) {
      const startTimeHour = value.time.start_time.hour;
      const timetableIndex = startTimeHour - 6;
      for (let n = 0; n < this.element_data.length; n++) {
        if (n === timetableIndex) {
          n = timetableIndex * 2;
          const weekday = this.displayedColumns[value.weekday];
          if (!this.element_data[n][weekday]?.subject) {
            this.element_data[n][weekday] = {
              id: value.id,
              subject: value.subject,
              staff: value.staff,
              time: value.time,
              weekday: value.weekday,
              room: value.room,
              top: this.startTimeTopPercentage(value.time.start_time.minute),
              height: { percentage: this.timeSpanPercentage(value.time.interval), interval: value.time.interval }
            } as ScheduleUI;
          } else {
            let hasSameClass = this.element_data[n][weekday].class.includes(value.class);
            if (hasSameClass) {
              continue;
            }
            (this.element_data[n][weekday].subject as Subject[]).push(value.subject);
            (this.element_data[n][weekday].staff as string[]).push(value.staff);
          }
        }
      }
    }
  }

  private startTimeTopPercentage(startTimeMinutes: number): number {
    const HALF_AN_HOUR_MINUTE = 30;
    const topPercentage = (startTimeMinutes / HALF_AN_HOUR_MINUTE) * 100;
    return topPercentage;
  }

  private timeSpanPercentage(interval: number): number {
    const HALF_AN_HOUR_SECOND = 1800;
    const PIXEL_BORDER_SECOND = (1 / this.columnHeight) * HALF_AN_HOUR_SECOND;
    const percentageNumber = (interval / (HALF_AN_HOUR_SECOND - PIXEL_BORDER_SECOND)) * 100;
    return percentageNumber;
  }

  private to24Hours(value: string): TimeDetail {
    const d = new Date(parseInt(value, 10) * 1000);
    if (isNaN(+d)) {
      return;
    }
    const hm = d.toISOString().substr(11, 5);
    const a = hm.split(':');
    const h = parseInt(a[0], 10);
    return { hour: h, minute: +a[1], originalSecond: +value };
  }

  emitAction(timetable: ScheduleUI, type: 'edit' | 'delete'): void {
    this.actionEvent.emit({ timetable, type });
  }

  mapTableBody(tableHeaders: object[], rows: object[], lang: string): Array<Array<any>> {
    const tbData = [];
    let titleKey = 'title';
    if (lang === 'km') {
      titleKey = 'title_km';
    }

    // Apply header
    const th: any = [];
    tableHeaders.forEach((val: any) => {
      th.push(val[titleKey]);
    });
    tbData.push(th);

    // map body of table
    rows.forEach((vr: any, i) => {
      const tmpRow: any = [];
      tableHeaders.forEach((vc: any) => {
        const colData = vr[vc['dataKey']] ? vr[vc['dataKey']] : '';
        tmpRow.push(colData);
      });
      tbData.push(tmpRow);
    });
    return tbData;
  }
  makePdf(tableHeaders: any, rows: any): void {
    const data = this.mapTableBody(tableHeaders, rows, 'en');
    console.log(data);

    const styledData = data.map((_, rIndex) =>
      data[rIndex].map((columnValue, cIndex) => {
        if (rIndex === 0) {
          return {
            text: columnValue,
            color: 'black',
            margin: [0, 20, 0, 0],
            fillColor: 'white',
            border: [false, false, false, false]
          };
        } else if (cIndex === 0) {
          return {
            text: columnValue?.subject ? columnValue.subject.name : columnValue,
            color: 'black',
            margin: [0, -10, 0, 0],
            fillColor: 'white',
            border: [false, false, false, false]
          };
        } else {
          return {
            layout: {
              paddingLeft: () => 0,
              paddingRight: () => 0,
              paddingTop: () => 0,
              paddingBottom: () => 0
            },
            table: {
              margin: [0, 0, 0, 0],
              widths: ['100%'],
              heights: [columnValue.height ? (columnValue.height.interval / 35 / 100) * 70 : 35],
              body: [
                [
                  {
                    style: 'columnData',
                    border: [false, false, false, false],
                    text: columnValue
                      ? new TimePipe().transform(columnValue.time.start_time.originalSecond) +
                        ' - ' +
                        new TimePipe().transform(columnValue.time.end_time.originalSecond) +
                        '\n' +
                        columnValue.subject.name +
                        '\n' +
                        new FullNamePipe().transform(columnValue.staff)
                      : '',
                    color: 'black',
                    fillColor: columnValue
                      ? columnValue.subject?.color === '#ffffff'
                        ? '#868686'
                        : columnValue.subject.color
                      : 'white',
                    fillOpacity: columnValue ? 0.7 : 0
                  }
                ]
              ]
            },
            relativePosition: { x: 0, y: columnValue?.top ? (columnValue.top / 100) * 35 : -1 }
          };
        }
      })
    );

    (pdfMake as any).fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf'
      },
      Battambang: {
        normal: 'Battambang-Regular.ttf',
        bold: 'Battambang-Bold.ttf',
        italics: 'Battambang-Regular.ttf',
        bolditalics: 'Battambang-Regular.ttf'
      }
    };

    let title: string;

    title = 'Class Schedule';
    const widths = [50, 105, 105, 105, 105, 105, 105, 105];
    const heights = [
      50, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35, 35
    ];
    const pageOrientation = 'landscape';

    const docDefinition = {
      pageSize: 'A4',
      pageOrientation,
      content: [
        { text: title, style: ['header', 'alignCenter'] },
        {
          style: ['alignCenter', 'ml15'],
          layout: {
            paddingLeft: () => 0,
            paddingRight: () => 0,
            paddingTop: () => 0,
            paddingBottom: () => 0,
            fillColor(rowIndex: number): string | undefined {
              return rowIndex === 0 ? 'white' : null;
            },
            hLineColor(): string {
              return '#eaeaea';
            },
            vLineColor(): string {
              return '#eaeaea';
            },
            hLineStyle: function (i: number) {
              if (i === 0) {
                return null;
              }
              return { dash: { length: 2 } };
            },
            vLineStyle: function (i: number) {
              if (i === 0) {
                return null;
              }
              return { dash: { length: 2 } };
            }
          },

          table: {
            headerRows: 1,
            dontBreakRows: true,
            keepWithHeaderRows: true,
            widths,
            heights,
            body: styledData
          }
        }
      ],
      defaultStyle: {
        font: 'Battambang',
        fontSize: 10
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, -15, 0, 0]
        },
        subheader: {
          fontSize: 16,
          bold: true
        },

        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'white'
        },
        alignCenter: {
          alignment: 'center'
        },
        columnData: {
          alignment: 'left',
          margin: [3, 0, 0, 0]
        },
        ml15: {
          margin: [-15, 0, 0, 0]
        }
      }
    };
    pdfMake.createPdf(docDefinition as any).print();
  }
  printSchedulePdf(): void {
    const tableHeaders = [
      { title: 'Time', title_km: 'ម៉ោង', dataKey: 'time' },
      { title: 'Monday', title_km: 'ច័ន្ទ', dataKey: 'monday' },
      { title: 'Tuesday', title_km: 'អង្គារ៏', dataKey: 'tuesday' },
      { title: 'Wednesday', title_km: 'ពុធ', dataKey: 'wednesday' },
      { title: 'Thursday', title_km: 'ព្រហស្បត្តិ៏', dataKey: 'thursday' },
      { title: 'Friday', title_km: 'សុក្រ', dataKey: 'friday' },
      { title: 'Saturday', title_km: 'សៅរ៏', dataKey: 'saturday' },
      { title: 'Sunday', title_km: 'អាទិត្យ', dataKey: 'sunday' }
    ];
    this.makePdf(tableHeaders, this.element_data);
  }
}
