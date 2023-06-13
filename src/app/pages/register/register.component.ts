
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  private _jsonURL = 'assets/json/state.json';

  customStylesValidated = false;
  regForm!: FormGroup;
  dtOptions: any = {};
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  response: any;

  fcountryDial!: string;
  states!: any;
  cities!: any;
  postcode!: any;
  fPhoneNo: string = '';
  fICNo: string = '';

  pipe = new DatePipe('en-US'); // Use your own locale
  territories: any;

  backClicked() {
    this.location.back();
  }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private location: Location,
    private http: HttpClient,
  ) {

  }

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  ngOnInit() {
    this.getDist();
    this.fcountryDial = "+6";
    // <<<<<<<<<<<<Malaysia State >>>>>>>>>>
    this.getJSON().subscribe(data => {
      this.states = data;
      //  console.log(data);
    });
    // <<<<<<<<<<<<END Malaysia State >>>>>>>>>>
    this.futureDateDisabled();
  }

  getDist() {
    this.pipe = new DatePipe('en-US'); // Use your own locale

    this.regForm = this.formBuilder.group({
      fusername: ['', Validators.required],
      fpassword: ['', [Validators.required, createPasswordStrengthValidator()]],
      fname: ['', Validators.required],
      fdob: [this.pipe.transform('', 'yyyy-MM-dd'), [Validators.required, createDateValidator()]],
      fic: ['', Validators.required],
      fhptel: ['', [Validators.required, createPhoneValidator()]],
      fsex: ['M', Validators.required],
      femail: ['', [Validators.required, createCustomEmailValidator()]],
      faddr1: ['', Validators.required],
      faddr2: [''],
      fstate: ['Please Select', Validators.required],
      fcity: [{ value: 'Please Select', disabled: true }, Validators.required],
      fpostcode: [{ value: 'Please Select', disabled: true }, Validators.required],
    });
  }

  get f() { return this.regForm.controls; }

  maxDate: any;
  minDate: any;

  futureDateDisabled() {
    var date: any = new Date();
    var todayDate: any = date.getDate();
    var month: any = date.getMonth() + 1
    var year: any = date.getFullYear();
    if (todayDate < 10) {
      todayDate = '0' + todayDate;
    }
    if (month < 10) {
      month = '0' + month;
    }

    this.maxDate = year + "-" + month + "-" + todayDate
    this.minDate = "1930-01-01"
    // console.log(this.maxDate);
  }

  checkState(event: any) {
    this.f['fpostcode'].setValue("Please Select");
    this.f['fpostcode'].disable();
    this.f['fcity'].enable();
    var stateABB = event.target.value;

    if (this.f['fcity'].value != "Please Select") {
      this.f['fcity'].setValue("Please Select");
      this.getJSON().subscribe(data => {
        var stateLength = data.length;
        for (let i = 0; i < stateLength; i++) {
          var abb = data[i].abbreviation;
          if (stateABB == abb) {
            var city = data[i].city;
            this.cities = city;
          }
        }
      });
    }
    else {
      if (stateABB != null) {
        this.getJSON().subscribe(data => {
          var stateLength = data.length;
          for (let i = 0; i < stateLength; i++) {
            var abb = data[i].abbreviation;
            if (stateABB == abb) {
              var city = data[i].city;
              this.cities = city;
            }
          }
        });
      }
    }
    return false;
  }


  checkCity(event: any) {
    var abbName = this.regForm.controls['fstate'].value;
    //console.log(abbName);
    var cityName = event.target.value;
    this.f['fpostcode']?.enable();
    if (cityName != null) {
      this.getJSON().subscribe(data => {
        var stateLength = data.length;
        for (let i = 0; i < stateLength; i++) {
          var abb = data[i].abbreviation;
          if (abbName == abb) {
            var city = data[i].city;
            var cityLength = city.length;
            for (let j = 0; j < cityLength; j++) {
              var checkCityName = city[j].name;
              if (checkCityName == cityName) {
                var postcode = city[j].postcode;
                this.postcode = postcode;
              }
            }
          }
        }
      });
    }
  }

  ValidateEmail(mail: any) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.f['femail'].value)) {
      return (true)
    }
    //alert("You have entered an invalid email address!")
    return (false)
  }

  ValidatePhoneNo(event: any) {
    this.fPhoneNo = event.target.value;
    // console.log(this.fPhoneNo);
    if (this.fPhoneNo != '') {
      var cleanFhptel = this.fPhoneNo;
      cleanFhptel = cleanFhptel.replace(/[^0-9]+/g, "");
      const PhoneLength = this.fPhoneNo.length;
      if (PhoneLength > 12 || PhoneLength < 10) {
        // (<HTMLInputElement>document.getElementById("fhptel")).focus();
        // alert("Phone Number Invalid");
      }
    }
    else {
      // alert('Phone No. Cannot be empty');
    }
  }

  checkDate(event: any) {
    var getDate = event.target.value;

    var checkDate: any = new Date(getDate);
    var checkYear: any = checkDate.getFullYear();

    var currentdate: any = new Date();
    var currentYear: any = currentdate.getFullYear();

    const ValidAge = 18;
    const ValidYear = currentYear - ValidAge;

    if (ValidYear > checkYear || 1930 > checkYear) {
      //console.log("Valid");

    }
    else {
      // console.log("Invalid");

    }
  }

  ValidateICNo(event: any) {
    //this.fICNo = event.target.value;
    this.fICNo = event.target.value;
    // console.log(this.fICNo);

    if (this.fICNo != '') {
      var cleanFIC = this.fICNo;

      cleanFIC = cleanFIC.replace(/[^0-9]+/g, "");

      this.regForm.controls['fic'].setValue(cleanFIC.toUpperCase());

    }
    else {
      //alert('Phone No. Cannot be empty');
    }
  }


  onSubmit() {


    if (this.username.invalid) {
      alert('Please insert the Username');
      (<HTMLInputElement>document.getElementById("fusername")).focus();
      return;
    }

    if (this.f['fpassword'].invalid) {
      alert('Please insert the Password');
      (<HTMLInputElement>document.getElementById("fpassword")).focus();
      return;
    }

    if (this.f['fname'].invalid) {
      alert('Please insert the Name');
      (<HTMLInputElement>document.getElementById("fname")).focus();
      return;
    }

    if (this.f['fic'].invalid) {
      alert('Please insert  I/C No.');
      (<HTMLInputElement>document.getElementById("fic")).focus();
      return;
    }

    if (this.f['femail'].invalid) {
      alert('Please insert the Email');
      (<HTMLInputElement>document.getElementById("femail")).focus();
      return;
    }

    if (this.f['fdob'].invalid) {
      alert('Please insert the DOB');
      (<HTMLInputElement>document.getElementById("fdob")).focus();
      return;
    }

    if (this.f['fhptel'].invalid) {
      alert('Please insert the Phone (Mobile)');
      (<HTMLInputElement>document.getElementById("fhptel")).focus();
      return;
    }

    if (this.f['fsex'].invalid) {
      alert('Please select the DOB');
      (<HTMLInputElement>document.getElementById("fsex")).focus();
      return;
    }

    if (this.f['faddr1'].invalid) {
      alert('Please insert the Address');
      (<HTMLInputElement>document.getElementById("faddr1")).focus();
      return;
    }

    if (this.f['fstate'].value == "Please Select") {
      alert('Please select the State');
      (<HTMLInputElement>document.getElementById("fstate")).focus();
      return;
    }

    if (this.f['fcity'].value == "Please Select") {
      alert('Please select the City');
      (<HTMLInputElement>document.getElementById("fcity")).focus();
      return;
    }

    if (this.f['fpostcode'].value == "Please Select") {
      alert('Please select the Postcode');
      (<HTMLInputElement>document.getElementById("fpostcode")).focus();
      return;
    }


    console.log('Form data : ', this.regForm.value);

    alert("Success");

    return;
  }


  get username() {
    return this.f['fusername'];
  }

}

export function createPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const phoneValid = value.match(/^(01)/)

    return !phoneValid ? { phoneStrength: true } : null;
  }
}

export function createDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    var checkDate: any = new Date(value);
    var checkYear: any = checkDate.getFullYear();

    var currentdate: any = new Date();
    var currentYear: any = currentdate.getFullYear();

    const ValidAge = 18;
    const ValidYear = currentYear - ValidAge;

    var dateValid = false;

    if (ValidYear >= checkYear || 1930 > checkYear) {
      // console.log("Valid");
      dateValid = true;
    }
    else {
      // console.log("Invalid");
      dateValid = false;
    }
    return !dateValid ? { dateStrength: true } : null;
  }
}

export function createCustomEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const emailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);

    return !emailValid ? { emailStrength: true } : null;
  }
}


export function createPasswordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);

    const hasLowerCase = /[a-z]+/.test(value);

    const hasNumeric = /[0-9]+/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

    return !passwordValid ? { passwordStrength: true } : null;
  }
}