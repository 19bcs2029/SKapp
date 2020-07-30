import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  query: any = {};
  colour: string;
  message: string;
  name: string;
  email: string;
  feedback: string;
  user: any;
  loggedIn = false;

  constructor(public fb: FormBuilder) {
    this.query = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      feedback: ['', [Validators.required]]
    });

    this.user = firebase.auth().currentUser;

    if (this.user) {
      this.loggedIn = true;
    }
    else{
      this.loggedIn = false;
    }

    firebase.auth().onAuthStateChanged((user) => {
      this.user = user;
      if (user){
        this.loggedIn = true;
      }
      else{
        this.loggedIn = false;
      }
    });
   }

  ngOnInit(): void {
  }

  send(form){
    const name: string = form.value.name;
    const email: string = form.value.email;
    const feedback: string = form.value.feedback;

    this.message = 'Sending Feedback...';

    firebase.firestore().collection('feedbacks').add({

      name: form.value.name,
      email: form.value.email,
      feedback: form.value.feedback,
      created: firebase.firestore.FieldValue.serverTimestamp()

    }).then((data) => {
      console.log(data);
      this.colour = 'success';
      this.message = 'Feedback sent successfully!';
      this.query.reset();
    }).catch((error) => {
      console.log(error);
      this.colour = 'warning';
      this.message = 'Feedback sending failed!';
    });
  }

}
