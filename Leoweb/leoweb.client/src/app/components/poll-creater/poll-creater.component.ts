import {Component, inject, OnInit} from '@angular/core';
import {MatInput} from "@angular/material/input";
import {MatCard} from "@angular/material/card";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {
  FormBuilder, FormControl,
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
import {MatOption, provideNativeDateAdapter} from "@angular/material/core";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from "@angular/material/chips";
import {HttpClient} from "@angular/common/http";
import {MatSelect, MatSelectModule} from "@angular/material/select";
import {getAllBranches} from "../../leo-library/leo-library-helper";
import { PollName } from '../../../models/pollNameModel';
import { PollService } from '../../../services/poll.service';
import { PollOverview } from '../../../models/pollOverviewModel';
import { CommonModule } from '@angular/common';
import { first, firstValueFrom } from 'rxjs';
import {RefreshService} from "../../../services/refresh.service";

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
    MatChipGrid,
    MatOption,
    MatSelect,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule, CommonModule
  ],
  providers: provideNativeDateAdapter(),
  styleUrl: './poll-creater.component.css'
})
export class PollCreaterComponent implements OnInit {
  choices: string[] = [];
  readonly formControl = new FormControl(['angular']);
  years: number[] = [1,2,3,4,5];
  branches: string[] = [];
  pollNames: PollName[] = [];
  poll: PollOverview | null = null;

  announcer = inject(LiveAnnouncer);
  constructor(private pollService: PollService, private apiService: ApiService, private _formBuilder: FormBuilder, private http: HttpClient, private refreshService: RefreshService) {}

  async ngOnInit() {
    this.branches = capitalizeFirstLetter(await getAllBranches(this.http, this.apiService));
    this.pollNames = await this.pollService.getPollNames();
  }

  pollSelectorGroup = this._formBuilder.group({
    title: [this.pollNames, Validators.required],
  });
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
    choices: [this.choices, Validators.required],
  });
  branchFormGroup = this._formBuilder.group({
    yearsCtrl: [this.years, Validators.required],
    branchesCtrl: [this.branches, Validators.required],
  })
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
        year: this.branchFormGroup.value.yearsCtrl,
        branch: this.branchFormGroup.value.branchesCtrl,
      }

      this.http.post(url, pollData).subscribe({
        next: (response) => {
          console.log('Creation successful!', response);
          this.refreshService.triggerRefresh();
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

  async loadPoll(id: number): Promise<void> {
    console.log("Loading poll");
    const url = this.apiService.getApiUrl(`Poll/${id}/overview`);
    this.poll = await firstValueFrom(this.http.get<PollOverview>(url));

    console.log(this.poll);

    this.titleFormGroup.setValue({ title: this.poll?.headline ?? null });
    this.descriptionFormGroup.setValue({ description: this.poll?.description ?? null });
    this.dateFormGroup.setValue({ startdate: this.poll?.release ?? null, enddate: this.poll?.close ?? null });
    //this.choicesFormGroup.setValue({ choices: Array.from(this.poll?.votes.keys()) ?? [] });
    this.branchFormGroup.setValue({ branchesCtrl: this.poll?.branch ?? [], yearsCtrl: this.poll?.year ?? [] });
  }
}

function capitalizeFirstLetter(arr: string[]): string[] {
  return arr.map(str => str.charAt(0).toUpperCase() + str.slice(1));
}
