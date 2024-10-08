import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { UtilityService } from '../../services/utility.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message = '';
  constructor(
    private fb: FormBuilder,
    private navigationService: NavigationService,
    private utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      pwd: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(15),
        ],
      ],
    });
  }

  login() {
    console.log("1")
    console.log(this.Email.value, this.PWD.value);
    this.navigationService
      .loginUser(this.Email.value, this.PWD.value)
      .subscribe((res: any) => {
        console.log("5");
        console.log(res.toString());
        if (res.toString() !== 'invalid') {
          this.message = 'Logged In Successfully.';
          this.utilityService.setUser(res.toString());
          console.log(this.utilityService.getUser());
          console.log("2")
        } else {
          this.message = 'Invalid Credentials!';
          console.log("3")
        }
      });
      console.log(4);
  }

  get Email(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }
  get PWD(): FormControl {
    return this.loginForm.get('pwd') as FormControl;
  }
}
