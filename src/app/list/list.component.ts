import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {DetailsComponent} from '../details/details.component';
import {MatDialog} from '@angular/material';

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
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  cards = new Array<Card>();
  activityType = ['गतिविधि', 'वर्कशीट', 'पाठ योजना'];
  title: string;

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params) => {
        this.title = params.title;
        this.db.collection('play-lists').doc(params.title)
          .collection('cards').ref.get().then(
          (cards) => {
            cards.forEach(
              (document) => {
                const card = document.data() as Card;
                if (!card.hasOwnProperty('img')) {
                  card.img = 'http://placekitten.com/500/500';
                }
                // console.log(card);
                this.cards.push(card);
              });
            console.log(this.cards);
          });
      });
  }

  detailsOf(index: number) {
    this.dialog.open(DetailsComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        cards: this.cards,
        index
      }
    });
  }

  generateArray(n: number): number[] {
    n = Math.round(n);
    if (n === null || isNaN(n)) {
      n = 3;
    }
    return Array.from(Array(n).keys());
  }


  generateArrayBordered(n: number): number[] {
    n = 5 - Math.round(n);
    if (n === null || isNaN(n)) {
      n = 2;
    }
    return Array.from(Array(n).keys());
  }

  gotoPlaylists() {
    this.router.navigate(['play-list']).then(null);
  }
}
