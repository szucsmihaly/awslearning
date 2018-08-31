import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ISignUpResult } from 'amazon-cognito-identity-js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({
    username: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    password: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    email: new FormControl(null, [Validators.required, Validators.email])
  })

  constructor(public userService: UserService) { }

  ngOnInit() {
  }

  registerFormSubmit() {

    if (!this.registerForm.valid) {
      return;
    }

    let username: string = this.registerForm.get("username").value;
    let password: string = this.registerForm.get("password").value;
    let email: string = this.registerForm.get("email").value;

    this.userService.registration(username, password, email).subscribe({
      next: (signUpResult: ISignUpResult) => {
        console.log(signUpResult);
      },
      error: (error: string) => {
        console.log(error);
      }
    })

  }

}
