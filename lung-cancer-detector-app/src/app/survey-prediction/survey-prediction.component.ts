import {Component} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HttpClient, HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-survey-prediction',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './survey-prediction.component.html',
  styleUrl: './survey-prediction.component.css'
})
export class SurveyPredictionComponent {
  public surveyForm: any;
  public errorMessage: string = '';
  public prediction: string = '';
  public isFormSubmitted: boolean = false;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.surveyForm = this.formBuilder.group({
      gender: ['', Validators.required],
      age: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      smoking: ['', Validators.required],
      yellowFingers: ['', Validators.required],
      anxiety: ['', Validators.required],
      peerPressure: ['', Validators.required],
      chronicDisease: ['', Validators.required],
      fatigue: ['', Validators.required],
      allergy: ['', Validators.required],
      wheezing: ['', Validators.required],
      alcoholConsumption: ['', Validators.required],
      coughing: ['', Validators.required],
      shortnessOfBreath: ['', Validators.required],
      swallowingDifficulty: ['', Validators.required],
      chestPain: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.isFormSubmitted = true;

    if (this.surveyForm?.valid) {
      const formData = this.surveyForm.value;
      this.errorMessage = '';

      this.http.post<any>('http://127.0.0.1:3000/survey-predict', formData).subscribe({
        next: (response) => { this.prediction = response.prediction; },
        error: (error) => { console.error('Error occurred while predicting the response:', error); }
      });
    } else {
      this.errorMessage = 'All fields are required. Please fill out the form.';
    }
  }
}
