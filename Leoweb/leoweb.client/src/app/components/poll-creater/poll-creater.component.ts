import {Component, inject} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
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
import {HttpClient} from "@angular/common/http";

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
  choices: string[] = [];
  readonly formControl = new FormControl(['angular']);

  announcer = inject(LiveAnnouncer);
  constructor(private apiService: ApiService, private _formBuilder: FormBuilder, private http: HttpClient) {}

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

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.choices.push(value);
    }
    event.chipInput!.clear();
  }

  removeKeyword(choice: string): void {
    const index = this.choices.indexOf(choice);
    if (index >= 0) {
      this.choices.splice(index, 1);
    }
  }

  createPoll(): void{
    const url = this.apiService.getApiUrl('Poll');
    if(this.dateFormGroup.value.startdate && this.dateFormGroup.value.enddate) {
      const pollData = {
        headline: this.titleFormGroup.value.title,
        description: this.descriptionFormGroup.value.description,
        release: new Date(this.dateFormGroup.value.startdate).toISOString(),
        close: new Date(this.dateFormGroup.value.enddate).toISOString(),
        choices: this.choices,
        year: [
          0
        ],
        branch: [
          "ok"
        ]
      }

      this.http.post(url, pollData).subscribe({
        next: (response) => {
          console.log('Creation successful!', response);
          alert("Creation successful!");
        },
        error: (err) => {
          console.error("Error creating your poll", err);
        },
      });
    }
  }

  reset(stepper: MatStepper):void{
    stepper.reset();
    this.choices = [];
  }
}
