import {Component, Inject, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

class Playlist {
  title: string;
  cards = 0;
}

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  lists = Array<Playlist>();
  constructor(
    private db: AngularFirestore,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.db.collection('play-lists').ref.get().then(
      (lists) => {
        lists.forEach(
          (list) => {
            const title = list.id;
            this.db.collection('play-lists').doc(title).collection('cards').ref.get().then(
              (cardx) => {
                const cards = cardx.size;
                const listx = new Playlist();
                listx.title = title;
                listx.cards = cards;
                this.lists.push(listx);
              });
          });
      });
  }

  gotoList(title: string) {
    this.router.navigate(['list', title]);
  }
}
