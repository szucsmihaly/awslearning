import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    password: new FormControl(null, [Validators.required, Validators.minLength(3)])
  });

  constructor(public userService: UserService) { }

  loginFormSubmit() {

    if (!this.loginForm.valid) {
      console.log(this.loginForm.errors);
      return;
    }

    console.log("Login submit");

    this.userService.login(this.loginForm.get("username").value, this.loginForm.get("password").value).subscribe({
      next: (session: CognitoUserSession) => {
        console.log(session);
      },
      error: (error: {mode: number, message: string}) => {
        console.log(error);
      }
    })

  }

  ngOnInit() {
  }

}
