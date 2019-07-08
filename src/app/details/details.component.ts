import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatBottomSheet, MatSnackBar} from '@angular/material';
import {AngularFirestore} from '@angular/fire/firestore';
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";
import {AngularFireAuth} from "@angular/fire/auth";

class Card {
  activityType = 0;
  title = '';
  titleEng = '';
  img = 'http://placekitten.com/500/500';
  concepts = '';
  conceptsEng = '';
  subjects = [];
  levels: string;
  how2Play = '';
  how2PlayEng = '';
  videoLink: string;
  maxAge = 15;
  minAge = 3;
  rating = 5;
  ratingInterest = 7;
  ratingAttention = 7;
  ratingEngagement = 7;
  tools = '';
  id: string;
  gameId: number;
  comments = [];
}


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  card = new Card();
  cards = Array<Card>();
  title: string;
  activityType = ['गतिविधि', 'वर्कशीट', 'पाठ योजना'];
  private index: number;
  isTitle = false;
  rate: number;
  comment: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private  snackbar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private db: AngularFirestore,
    private sanitizer: DomSanitizer,
    private auth: AngularFireAuth
  ) {
  }

  ngOnInit() {
    this.cards = this.data.cards;
    this.index = this.data.index;
    this.card = this.data.cards[this.index];
    this.snackbar.open('Press arrow keys to navigate...', null, {
      duration: 500,
    });
  }

  generateArray(n: number): number[] {
    n = Math.round(n);
    return Array.from(Array(n).keys());
  }

  generateArrayBordered(n: number): number[] {
    n = 5 - Math.round(n);
    return Array.from(Array(n).keys());
  }


  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.code === 'ArrowRight') {
      if (this.index < this.cards.length - 1) {
        this.index += 1;
      }
    }
    if (event.code === 'ArrowLeft') {
      if (this.index > 0) {
        this.index -= 1;
      }
    }
    this.card = this.cards[this.index];

  }

  addToPlaylist() {
    this.db.collection('play-lists').doc(this.title).set({exists: true});
    this.db.collection('play-lists').doc(this.title).collection('cards')
      .doc(this.card.title)
      .set(this.card).then(
      () => {
        this.snackbar.open('Added successfully!', null, {
          duration: 1000
        });
      }).catch(
      (error) => {
        this.snackbar.open(`Error: ${error}`);
      });
  }

  sanitize(videoLink: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(videoLink);
  }

  rateIt() {
    if (this.auth.auth.currentUser === null) {
      this.snackbar.open('Please log in to rate', 'OK', { duration: 1000});
    }
    this.db.collection('games').doc(this.card.title)
      .collection('ratings').doc(this.auth.auth.currentUser.email).set(
      {value: this.rate}
    );
  }

  commentIt() {
    this.card.comments.unshift(this.comment);
    this.db.collection('games').doc(this.card.title).collection('comments').add({
      value: this.comment
    }).then(
      () => {
        this.comment = '';
      }).catch(
      (error) => {
        this.snackbar.open(error, 'OK', {duration: 1000});
      });
  }
}
