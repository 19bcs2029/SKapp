import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

@Component({
  selector: 'app-sellproduct',
  templateUrl: './sellproduct.component.html',
  styleUrls: ['./sellproduct.component.css']
})
export class SellproductComponent implements OnInit {

  imgSrc: string = 'assets/img/default.jpg';
  selectedImage: any = null;
  isSubmitted: boolean = false;
  myForm: FormGroup;
  message: string = "";
  colour: string = "";

  private basePath = '/images';
  file: File;
  url = '';

  constructor(private storage: AngularFireStorage, public fb: FormBuilder, public activateRoute: ActivatedRoute) {
    this.myForm = this.fb.group({
      productName: ['', [Validators.required]],
      material: ['', [Validators.required]],
      size: ['', [Validators.required]],
      price: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.resetForm();
  }

  //Shows preview before uploading
  showPreview(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imgSrc = e.target.result;
      this.selectedImage = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);

    }
    else {
      this.imgSrc = 'assets/img/default.jpg';
      this.selectedImage = null;
    }
  }

  addProduct(form) {

    let productName: string = form.value.productName;
    let material: string = form.value.material;
    let size: string = form.value.size;
    let price: number = form.value.price;

    this.colour = "warning";
    this.message = "Upload in progress... Please wait."
    //Uploading Image
    this.isSubmitted = true;
    if (this.myForm.valid) {
      var filePath = `product-images/${this.selectedImage.name.split('.').slice(0, -1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            form['imageUrl'] = url;

            //Storing the form inputs
            firebase.firestore().collection("products").add({
              productName: form.value.productName,
              material: form.value.material,
              size: form.value.size,
              price: form.value.price,
              imageUrl: form['imageUrl'],
              productCreatedOn: firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
              this.colour = "success";
              this.message = "Product added successfully.";
              this.isSubmitted = true;
              this.resetForm();
            }).catch((error) => {
              this.colour = "danger";
              this.message = "Product addition failed. Please retry."
              console.log(error);
            });
          });
        })
      ).subscribe();
    }
  }

  get formControls() {
    return this.myForm;
  }

  resetForm() {
    this.myForm.reset();

    this.imgSrc = "assets/img/default.jpg";
    this.selectedImage = null;
    this.isSubmitted = false;
  }

}
