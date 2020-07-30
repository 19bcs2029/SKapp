import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'
import { AuthService } from '../auth.service';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';

import 'firebase/firestore';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  myForm: FormGroup;
  message: string = "";
  colour: string = "";
  userError: any;

  constructor(public fb: FormBuilder, public authService: AuthService, public router : Router) {
    this.myForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validator: this.checkIfMatchingPasswords("password", "confirmPassword")
    })
  }

  checkIfMatchingPasswords(passwordKey: string, confirmPasswowrdKey: string) {
    return (group: FormGroup) => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswowrdKey]

      if (password.value == confirmPassword.value) {
        return;
      }
      else {
        confirmPassword.setErrors({
          notEqualToPassword: true
        })
      }
    }
  }

  onSubmit(signupform) {
    let email: string = signupform.value.email;
    let password: string = signupform.value.password;
    let firstName: string = signupform.value.firstName;
    let lastName: string = signupform.value.lastName;



    this.authService.signup(email, password, firstName, lastName).then((user: any) => {

      firebase.firestore().collection("users").doc(user.uid).set({

        firstName: signupform.value.firstName,
        lastName: signupform.value.lastName,
        email: signupform.value.email,
        photoURL: user.photoURL,
        accountType:"customer"
      }).then(() => {
        this.colour = "success";
        this.message = "You have been signed up successfully. Please login."
        firebase.auth().signOut();
        this.myForm.reset();
        this.router.navigate(['/']);
      })

    }).catch((error) => {
      console.log(error);
      this.userError = error;
    })
  }

  ngOnInit(): void {
  }

}
