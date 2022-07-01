import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Staff } from "../models/staff";

@Injectable({
    providedIn: 'root'
})
export class UserDataService {
    private UserDataSubject = new BehaviorSubject<Staff>(null);
    public currentUserData = this.UserDataSubject.asObservable();

    constructor() {
     }
     changeUserData(userData): void{
        this.UserDataSubject.next(userData)
    }
}
