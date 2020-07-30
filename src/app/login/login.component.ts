import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import * as firebase from 'firebase/app';
import { ActivatedRoute } from '@angular/router';
import 'firebase/auth';
import 'firebase/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  myForm: FormGroup;
  message: string = "";
  colour: string = "";
  user: any;

  constructor(public fb: FormBuilder, public authService: AuthService
    ,public router : Router, public activatedRoute: ActivatedRoute) {

    this.myForm = this.fb.group({
      email: ['',[Validators.email,Validators.required]],
      password: ['',[Validators.required]]
    })
   }

  ngOnInit(): void {
  }


  onSubmit(form){
    this.authService.login(form.value.email, form.value.password).then((data) => {
      this.colour = "success";
      this.message = "You have been logged in successfully.";
      this.router.navigate(['/home']);

    }).catch((error) => {
      this.colour = "danger";
      this.message = "Wrong Password!";
    })
  }

}
