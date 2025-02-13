import {Component, inject} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatCard} from "@angular/material/card";
import {MatButton, MatFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from "@angular/material/stepper";

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
    FormsModule
  ],
  styleUrl: './poll-creater.component.css'
})
export class PollCreaterComponent {
  private _formBuilder = inject(FormBuilder);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  isLinear = false;
}
