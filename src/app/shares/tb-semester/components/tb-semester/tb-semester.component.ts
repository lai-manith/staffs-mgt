import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Semester } from 'src/app/models/semester';

@Component({
  selector: 'app-tb-semester',
  templateUrl: './tb-semester.component.html',
  styleUrls: ['./tb-semester.component.scss']
})
export class TbSemesterComponent implements OnInit {

  displayedColOne: string[] = ['_id', 'name', 'start_date', 'end_date', 'subject', 'fee', 'action'];

  @Input() dataSource: MatTableDataSource<Semester> = new MatTableDataSource([]);;
  @Output() onEditDialog: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();
  @Output() onView: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {

  }

  editSemesterDialog(id: string) {
    this.onEditDialog.emit({ id: id });
  }

  deleteSemester(id: string) {
    this.onDelete.emit({ id: id });
  }

  viewSemesterDialog(id: string) {
    this.onView.emit({ id: id });
  }

}
