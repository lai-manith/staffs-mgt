import { Staff } from "./staff";

export interface ManageSalary {
    _id?: string;
    createAt?: Date;
    status?: any;
    staff?: Staff;
    last_salary: number;
}