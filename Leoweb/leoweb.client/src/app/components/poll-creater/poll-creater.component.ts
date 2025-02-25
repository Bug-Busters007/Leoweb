import {Component, inject, signal, WritableSignal} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {MatCard} from "@angular/material/card";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {
  FormBuilder, FormControl, FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";
import {ApiService} from "../../../services/api.service";
import {
  MatDatepickerActions,
  MatDatepickerApply,
  MatDatepickerCancel,
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker, MatEndDate, MatStartDate
} from "@angular/material/datepicker";
import {provideNativeDateAdapter} from "@angular/material/core";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from "@angular/material/chips";

@Component({
  selector: 'app-poll-creater',
  standalone: true,

  templateUrl: './poll-creater.component.html',
  imports: [
    MatInput,
    MatLabel,
    MatFormField,
    MatCard,
    MatButton,
    MatIcon,
    MatFabButton,
    MatStep,
    ReactiveFormsModule,
    MatStepperPrevious,
    MatStepperNext,
    MatStepLabel,
    MatStepper,
    FormsModule,
    MatDatepickerCancel,
    MatDatepickerApply,
    MatDatepickerActions,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatEndDate,
    MatStartDate,
    MatDateRangeInput,
    MatHint,
    MatSuffix,
    MatChipInput,
    MatChipRemove,
    MatChipRow,
    MatChipGrid
  ],
  providers: provideNativeDateAdapter(),
  styleUrl: './poll-creater.component.css'
})
export class PollCreaterComponent{
  keywords:WritableSignal<string[]> = signal([]);
  readonly formControl = new FormControl(['angular']);

  announcer = inject(LiveAnnouncer);
  constructor(private apiService: ApiService, private _formBuilder: FormBuilder) {}

  titleFormGroup = this._formBuilder.group({
    title: ['', Validators.required],
  });
  descriptionFormGroup = this._formBuilder.group({
    description: ['', Validators.required],
  });
  dateFormGroup = this._formBuilder.group({
    startdate: ['', Validators.required],
    enddate: ['', Validators.required],
  })
  choicesFormGroup = this._formBuilder.group({
    choices: ['', Validators.required],
  });
  isLinear = false;

  removeKeyword(keyword: string) {
    this.keywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`removed ${keyword}`);
      return [...keywords];
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.keywords.update(keywords => [...keywords, value]);
    }
    event.chipInput!.clear();
  }

  createPoll(): void{
    const url = this.apiService.getApiUrl('Poll');

  }

  reset(stepper: MatStepper):void{
    stepper.reset();
    this.keywords = signal([]);
  }

}
