import { trigger, state, style, transition, animate } from '@angular/animations';
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { StaffDayOff } from 'src/app/models/calendar';
import { Staff } from 'src/app/models/staff';
import { CalendarService } from 'src/app/services/calendar.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { StaffService } from 'src/app/services/staff.service';
import { SnackbarComponent } from 'src/app/shares/snackbar/components/snackbar/snackbar.component';
import { AddingDayOffComponent } from '../adding-day-off/adding-day-off.component';
import { StudentListDialogComponent } from '../student-list-dialog/student-list-dialog.component';

export class CalendarDay {
  public date: Date;
  public dateTime: number;
  public title: string;
  public isPastDate: boolean;
  public isToday: boolean;
  public isActiveMonth: boolean = false;
  public contact: Staff[];
  public isMatch: boolean = false;
  public dateString: string;
  public day_off: StaffDayOff[];

  public getDateString() {
    return this.date.toISOString().split('T')[0];
  }

  constructor(d: Date) {
    this.date = d;
    this.dateTime = d.setHours(0, 0, 0, 0);
    this.dateString = formatDate(d, 'MM-dd-yyyy', 'en-US');
    this.isPastDate = d.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
    this.isToday = d.setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
    this.contact = [];
    this.day_off = [];
  }
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [style({ opacity: 0, transform: 'translateY(-50%)' }), animate(300)]),
      transition('* => void', [animate(300, style({ opacity: 0, transform: 'translateY(-50%)' }))])
    ])
  ]
})
export class CalendarComponent implements OnInit {
  calendar: CalendarDay[] = [];
  monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  displayDate = {
    month: null,
    year: 0
  };
  monthIndex: number = 0;
  isDate: boolean = false;
  activeMonth: number;
  isLastIndexMonth: boolean = false;
  selected: number = 0;
  @ViewChild('staffListTrigger') trigger: MatMenuTrigger;
  imgDefault = 'https://res.cloudinary.com/dxrkctl9c/image/upload/v1638865473/image/user-icon_n2sii7.svg';
  staff: Staff[];

  params = {
    page: 1,
    limit: 0,
    search: '',
    image_size: 150,
    status: true,
    gender: null,
    position: null
  };
  date: Date;

  constructor(
    private staffService: StaffService,
    private snackBarService: SnackbarService,
    private readonly calendarService: CalendarService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.generateCalendarDays(new Date());

    this.route.params.subscribe(params => {
      if (Object.keys(params).length > 0) {
        this.generateCalendarDays(new Date(params.date));
      }
    });
  }

  onGetStaffDayOff() {
    this.calendarService
      .getMany({
        start_date: this.formateDateString(this.calendar[0].date),
        end_date: this.formateDateString(this.calendar[this.calendar.length - 1].date)
      })
      .subscribe(
        res => {
          res.list.forEach(element => {
            this.calendar
              .filter(fil => fil.dateTime === new Date(element.day_off_date).setHours(0, 0, 0, 0))
              .map(m => {
                //!Show staff name
                m.isMatch = true;

                //* get staff to show on calendar
                m.day_off.unshift(element);

                //TODO: remove duplicated item in array
                m.day_off = [...new Map(m.day_off.map(item => [item['_id'], item])).values()];
              });
          });
        },
        err =>
          this.snackBarService.onShowSnackbar({
            message: err.error.message ?? err,
            component: SnackbarComponent,
            isError: true
          })
      );
  }

  dateString: string;
  onCardHover(date): void {
    this.dateString = date;
  }

  formateDateString(date: Date) {
    return formatDate(date, 'MM-dd-yyyy', 'en-US');
  }

  onAddDayOff(date: Date) {
    const dialogRef = this.dialog.open(StudentListDialogComponent, {
      width: '1050px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: StaffDayOff) => {
      if (result) {
        result.day_off_date = date;
        this.calendarService.create(result).subscribe(
          res => {
            this.snackBarService.onShowSnackbar({ message: 'add', component: SnackbarComponent });
            this.onGetStaffDayOff();
          },
          err => {
            this.snackBarService.onShowSnackbar({
              message: err.error.message ?? err,
              component: SnackbarComponent,
              isError: true
            });
          }
        );
      }
    });
  }

  dateDayOff: Date;
  // onAddDayOff(date: Date) {
  //   this.dateDayOff = date;
  //   this.selected = -1;
  // }

  onDeleteDayOff(id: string) {
    this.calendarService.delete(id).subscribe(
      res => {
        this.snackBarService.onShowSnackbar({ message: 'delete', component: SnackbarComponent });
        this.generateCalendarDays(new Date(this.date));
        this.onCardHover(null);
      },
      err =>
        this.snackBarService.onShowSnackbar({
          message: err.error.message ?? err,
          component: SnackbarComponent,
          isError: true
        })
    );
  }

  // onSaveDayOff() {
  //   const data = {
  //     day_off_date: this.dateDayOff,
  //     staff: this.staffSelected,
  //   };
  //   this.calendarService.create(data).subscribe(
  //     (res) => {
  //       this.snackBarService.onShowSnackbar('add', true, SnackbarComponent);
  //       this.onGetStaffDayOff();
  //       this.onCardHover(null);
  //     },
  //     (err) =>
  //       this.snackBarService.onShowSnackbar(
  //         err.error.message ?? err,
  //         false,
  //         SnackbarComponent
  //       )
  //   );
  // }

  onGetActiveMonth() {
    this.calendar.forEach((element, i) => {
      if (element.date.getDay() == 0) element['isHoliday'] = true;
      if (+element.date.getMonth() === this.activeMonth) {
        element.isActiveMonth = true;
      }
    });
  }

  generateCalendarDays(date: Date): void {

    //* we reset our calendar
    this.calendar = [];

    //* we set the date
    let day: Date = new Date(date);
    this.date = date;
    this.activeMonth = day.getMonth();

    //* set the display month for UI
    this.displayDate = {
      month: formatDate(day, 'MM-dd-yyyy', 'en-US'),
      year: day.getFullYear()
    };

    let startingDateOfCalendar = this.getStartDateForCalendar(day);
    let dateToAdd = startingDateOfCalendar;
    for (var i = 0; i < 42; i++) {
      this.calendar.push(new CalendarDay(new Date(dateToAdd)));
      dateToAdd = new Date(dateToAdd.setDate(dateToAdd.getDate() + 1));
    }
    this.onGetActiveMonth();
    //* this.onLoadStaffExpiredContact();
    this.onGetStaffDayOff();
  }

  getStartDateForCalendar(selectedDate: Date) {
    //* for the day we selected let's get the previous month last day
    let lastDayOfPreviousMonth = new Date(selectedDate.setDate(0));

    //* start by setting the starting date of the calendar same as the last day of previous month
    let startingDateOfCalendar: Date = lastDayOfPreviousMonth;

    //* but since we actually want to find the last Monday of previous month
    //* we will start going back in days intil we encounter our last Monday of previous month
    if (startingDateOfCalendar.getDay() != 1) {
      do {
        startingDateOfCalendar = new Date(startingDateOfCalendar.setDate(startingDateOfCalendar.getDate() - 1));
      } while (startingDateOfCalendar.getDay() != 1);
    }
    return startingDateOfCalendar;
  }

  increaseMonth() {
    this.generateCalendarDays(new Date(new Date(this.date).setMonth(new Date(this.date).getMonth() + 1)));
  }

  decreaseMonth() {
    this.generateCalendarDays(new Date(new Date(this.date).setMonth(new Date(this.date).getMonth() - 1)));
  }

  setCurrentMonth() {
    this.monthIndex = 0;
    this.generateCalendarDays(new Date());
  }

  onSetEvent(date: CalendarDay) {
    this.isDate = false;
  }
}
