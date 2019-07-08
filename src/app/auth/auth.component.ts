import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  exists = true;
  emailFC = new FormControl('', [Validators.required, Validators.email]);
  passwordFC = new FormControl('', [Validators.required, Validators.minLength(8)]);
  firstNameFC = new FormControl('', [Validators.required]);
  lastNameFC = new FormControl('', [Validators.required]);
  emailFC1 = new FormControl('', [Validators.required, Validators.email]);
  passwordFC1 = new FormControl('', [Validators.required, Validators.minLength(8)]);
  whereTo = '';

  constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    private db: AngularFirestore
  ) {
  }

  getErrorMessageEmail() {
    return this.emailFC.hasError('required') ? 'You must enter a value' :
      this.emailFC.hasError('email') ? 'Not a valid email' :
        '';
  }

  getErrorMessagePassword() {
    return this.passwordFC.hasError('required') ? 'You must enter a value' :
      this.passwordFC.hasError('length') ? 'Length must be greater than 8' :
        '';
  }

  getErrorMessageEmail1() {
    return this.emailFC1.hasError('required') ? 'You must enter a value' :
      this.emailFC1.hasError('email') ? 'Not a valid email' :
        '';
  }

  getErrorMessagePassword1() {
    return this.passwordFC1.hasError('required') ? 'You must enter a value' :
      this.passwordFC1.hasError('length') ? 'Length must be greater than 8' :
        '';
  }

  getErrorMessageFirstName() {
    return this.firstNameFC.hasError('required') ? 'You must enter a value' : '';
  }

  getErrorMessageLastName() {
    return this.firstNameFC.hasError('required') ? 'You must enter a value' : '';
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params) => {
        if (params['back-to'] === 'back-to-admin') {
          this.whereTo = 'admin';
        } else if (params['back-to'] === 'back-to-admin') {
          this.whereTo = 'add';
        } else if (params['back-to'] === 'back-to-admin') {
          this.whereTo = 'home';
        }
      });
  }

  loginWithEmail() {
    if (this.whereTo === 'admin') {
      if (this.emailFC.value === 'Admin' && this.passwordFC.value === 'pASSWORD@123kHEL!!') {
        this.router.navigate(['admin']).then(null);
      }
    } else if (this.whereTo === 'add') {
      const result = this.afAuth.auth.signInWithEmailAndPassword(this.emailFC.value, this.passwordFC.value);
      result.then(() => {
        this.router.navigate(['/volunteer']).then(null);
      });
      result.catch((error) => {
        this.snackbar.open(`Error: ${error}`);
      });
    } else {
      const result = this.afAuth.auth.signInWithEmailAndPassword(this.emailFC.value, this.passwordFC.value);
      result.then(() => {
        this.router.navigate(['/home']).then(null);
      });
      result.catch((error) => {
        this.snackbar.open(`Error: ${error}`);
      });
    }
  }

  forgotLogin() {
  }

  requestWithEmail() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.emailFC1.value, this.passwordFC1.value).then(
      (user) => {
        user.user.displayName = this.firstNameFC.value + this.lastNameFC.value;
        this.snackbar.open('Account Created!', 'OK');
      }).catch(
      (error) => {
        this.snackbar.open('Error' + error);
      }).finally(
      () => {
        this.exists = true;
      });
  }
}
