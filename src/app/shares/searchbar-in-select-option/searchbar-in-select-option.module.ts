import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchbarInSelectOptionComponent } from './components/searchbar-in-select-option/searchbar-in-select-option.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SearchbarInSelectOptionComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  exports: [SearchbarInSelectOptionComponent]
})
export class SearchbarInSelectOptionModule {}
