import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatChipInput, MatChipRemove, MatChipRow, MatChipGrid, MatChipInputEvent } from '@angular/material/chips';
import { MatDatepickerCancel, MatDatepickerApply, MatDatepickerActions, MatDateRangePicker, MatDatepickerToggle, MatEndDate, MatStartDate, MatDateRangeInput } from '@angular/material/datepicker';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatStep, MatStepperPrevious, MatStepperNext, MatStepLabel, MatStepper } from '@angular/material/stepper';
import { ApiService } from '../../../services/api.service';
import { HttpClient } from "@angular/common/http";
import { PollName } from '../../../models/pollNameModel';
import { PollService } from '../../../services/poll.service';

@Component({
  selector: 'app-poll-editor',
  standalone: true,

  templateUrl: './poll-editor.component.html',
  styleUrl: './poll-editor.component.css',
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
  ]
})
export class PollEditorComponent {
  choices: string[] = [];
  readonly formControl = new FormControl(['angular']);
  pollNames: PollName[] = [];


  announcer = inject(LiveAnnouncer);
  constructor(private pollService: PollService, private apiService: ApiService, private _formBuilder: FormBuilder, private http: HttpClient) { }

  async ngOnInit() {
    this.pollNames = await this.pollService.getPollNames();
  }

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


  reset(stepper: MatStepper): void {
    stepper.reset();
    this.choices = [];
  }

}
