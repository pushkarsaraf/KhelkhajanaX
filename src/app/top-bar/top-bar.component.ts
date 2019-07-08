import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  isLoggedIn = false;

  constructor(
    private router: Router,
    private auth: AngularFireAuth
  ) {
  }

  ngOnInit() {
    this.auth.user.subscribe(
      (user) => {
        this.isLoggedIn = user !== null;
      }
    );
  }
  nav(id: number) {
    this.router.navigate(['info', id]).then(null);
  }

  gotoHome() {
    this.router.navigate(['home']).then(null);
  }

  gotoPlaylists() {
    this.router.navigate(['play-lists']).then(null);
  }

  logIn() {
    this.router.navigate(['auth', 'back-to-home']).then(null);
  }

  logOut() {
    this.auth.auth.signOut();
  }
}
