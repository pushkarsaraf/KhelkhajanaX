import {Component, HostListener, OnInit} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatDialog} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {DetailsComponent} from '../details/details.component';
import { Router } from '@angular/router';

class Card {
  activityType = 0;
  title = '';
  titleEng = '';
  img = 'http://placekitten.com/200/200';
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
  comments = [];
  gameId: number;
}


enum Sort {
  RATING = 3,
  INTEREST = 1,
  ATTENTION = 0,
  RELEVANCE = 4,
  POPULARITY = 2
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  terms = [];
  activityType = ['गतिविधि', 'वर्कशीट', 'पाठ योजना'];
  subjects = [
    'अच्छी आदतें और शारीरिक स्वास्थ्य',
    'शिक्षा-पूरक क्षमताएं - ध्यान देना; सहभाग लेना',
    'भाषा', 'गणित',
    'निरीक्षण-विश्लेषण-तर्क-निर्णय-कल्पना क्षमता',
    'अभिव्यक्ती',
    'सामान्यज्ञान – स्व;परिवार; गांव; जिला',
    'सहकार्य-सामुहिकता',
    'उद्योगशीलता'
  ];
  subject: string = null;

  mathConcepts = [
    'गणित और व्यवहार का संबंध समझना',
    'गिनती',
    'संख्या परिचय और गिनती',
    'मुलभुत गणितीय क्रिया के अपने खुदके तरीके बनाना',
    'गणितीय क्रिया से संबंधित परिभाषा और चिन्ह समझना',
    'जोड़ना',
    'घटाना',
    'गुना',
    'भाग',
    'वर्गीकरण',
    'मुलभुत भुमितीय आकार समझना और उनकी समानताएं और अंतर बता पाना',
    'आकार और संख्या से संबंधित पैटर्न देख पाना'
  ];
  math: string = null;

  englishConcepts = [
    'सुनना-बोलना',
    'वाचन पूर्वतैयारी',
    'अक्षर परिचय',
    'शब्दवाचन',
    'शब्दसंग्रह/शब्दार्थ समझना',
    'पढ़कर समझना',
    'लेखन पूर्वतैयारी',
    'देखकर लिखना',
    'सुनकर लिखना',
    'समझकर लिखना',
    'लिखकर व्यक्त होना'
  ];
  english: string = null;
  kg: boolean;
  class: number = null;
  age: number = null;
  interest: number = null;
  rating: number = null;
  ratingAttn: number = null;
  ratingInterest: number = null;
  sadhan = 0;
  cards = new Array<Card>();
  sortedCards = new Array<Card>();
  filteredSortedCards = new Array<Card>();

  filters = new FormGroup({
    subject: new FormControl(null),
    math: new FormControl(null),
    eng: new FormControl(null),
    class: new FormControl(null),
    activityType: new FormControl(0),
    age: new FormControl(null),
    ratingAttn: new FormControl(null),
    ratingInterest: new FormControl(null),
    rating: new FormControl(null)
  });
  filteredCards: Card[];
  sortX = 0;
  comment: string;

  constructor(
    private db: AngularFirestore,
    private dialog: MatDialog,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.sadhan = 0;
    this.db.collection('games').ref.get().then(
      (collection) => {
        collection.forEach(
          (document) => {
            const card = document.data() as Card;
            if (!card.hasOwnProperty('img')) {
              card.img = 'http://placekitten.com/500/500';
            }
            const commentx = [];
            this.db.collection('games').doc(card.title).collection('comments').ref.get().then(
              (comments) => {
                comments.forEach(
                  (comment) => {
                    commentx.push(comment.data().value);
                  });
                card.comments = commentx;
                this.cards.push(card);
              });
            // console.log(card);
          });
        this.sortedCards = this.cards;
        this.filteredCards = this.cards;
        this.filteredSortedCards = this.cards;
      });
  }

  detailsOf(index: number) {
    this.dialog.open(DetailsComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        cards: this.filteredSortedCards,
        index
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.terms.push(value.trim());
      this.db.collection('Util').doc('keywords').ref.get().then(
        (result) => {
          const val: Array<string> = result.data().value;
          val.push(value.trim());
          this.db.collection('Util').doc('keywords').ref.set(
            {value: val}
          );
        });
    }

    if (input) {
      input.value = '';
    }
    this.sortedCards = this.sortCards(this.cards);
    this.filteredSortedCards = this.sortCards(this.filteredCards);
    console.log('fileredSize: ' + this.filteredSortedCards.length);
  }

  remove(term: string): void {
    const index = this.terms.indexOf(term);
    if (index >= 0) {
      this.terms.splice(index, 1);
    }
    this.sortedCards = this.sortCards(this.cards);
    this.filteredSortedCards = this.sortCards(this.filteredCards);
  }

  sortCards(cards): Card[] {
    return cards.filter(
      (card) => {
        let result = true;
        this.terms.forEach((termx) => {
          let titleYes = true;
          if (card.titleEng !== null) {
            titleYes = card.titleEng.includes(termx);
          }
          let titleHiYes = true;
          if (card.title !== null) {
            titleHiYes = card.titleEng.includes(termx);
          }
          let howToPlayYes = true;
          if (card.howToPlay !== null) {
            howToPlayYes = card.how2Play.includes(termx);
          }
          let howToPlayEngYes = true;
          if (card.howToPlayEng !== null) {
            howToPlayEngYes = card.how2PlayEng.includes(termx);
          }
          let conceptYes = true;
          if (card.concept !== null) {
            conceptYes = card.concepts.includes(termx);
          }
          let conceptEngYes = true;
          if (card.conceptEng !== null) {
            conceptEngYes = card.conceptsEng.includes(termx);
          }
          result = result && (titleYes || titleHiYes || howToPlayYes || howToPlayEngYes || conceptYes || conceptEngYes);
        });
        return result;
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

  clearAll() {
    this.subject = null;
    this.english = null;
    this.math = null;
    this.class = null;
    this.age = null;
    this.rating = null;
    this.ratingAttn = null;
    this.ratingInterest = null;
    this.filteredSortedCards = this.sortedCards;
  }

  submit() {
    this.filteredCards = this.filterCards(this.cards);
    this.filteredSortedCards = this.filterCards(this.sortedCards);
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  filterCards(cards: Card[]): Card[] {
    return this.filteredCards = cards.filter(
      (card: Card) => {
        let subjectYes = true;
        if (this.subject !== null) {
          subjectYes = card.subjects.includes(this.subject);
        }
        let conceptEngYes = true;
        if (this.english !== null) {
          conceptEngYes = card.concepts.includes(this.english);
        }
        let conceptMathYes = true;
        if (this.math !== null) {
          conceptMathYes = card.concepts.includes(this.math);
        }
        let levelsYes = true;
        if (this.class !== null) {
          levelsYes = card.levels.includes(this.class.toString());
        }
        const activityTypeYes = this.sadhan === card.activityType;
        let ageYes = true;
        if (this.age !== null) {
          ageYes = this.age < card.maxAge && this.age > card.minAge;
        }
        let ratingYes = true;
        if (this.rating !== null) {
          ratingYes = card.rating > this.rating;
        }
        let interestYes = true;
        if (this.rating !== null) {
          interestYes = card.ratingInterest > this.ratingInterest;
        }
        let attentionYes = true;
        if (this.rating !== null) {
          attentionYes = card.ratingAttention > this.ratingAttn;
        }
        // console.log('subject: ' + subjectYes);
        // console.log('concept: ' + conceptEngYes);
        // console.log('math: ' + conceptMathYes);
        // console.log('activityType: ' + activityTypeYes);
        // console.log('levelsYes: ' + levelsYes);
        // console.log('ages: ' + ageYes);
        const result = subjectYes && conceptEngYes && conceptMathYes && activityTypeYes && levelsYes && ageYes
          && ratingYes && interestYes && attentionYes;
        console.log(result);
        return result;
      });
  }

  removeSubject() {
    this.subject = null;
    this.filteredCards = this.filterCards(this.cards);
    this.filteredSortedCards = this.sortCards(this.filterCards(this.sortedCards));
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeMath() {
    this.math = null;
    this.filteredSortedCards = this.sortCards(this.filterCards(this.sortedCards));
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeEnglish() {
    this.english = null;
    this.filteredCards = this.filterCards(this.cards);
    this.filteredSortedCards = this.sortCards(this.filterCards(this.sortedCards));
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeClass() {
    this.class = null;
    this.filteredCards = this.filterCards(this.cards);
    this.filteredSortedCards = this.sortCards(this.filterCards(this.sortedCards));
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeInterest() {
    this.rating = null;
    this.ratingAttn = null;
    this.ratingInterest = null;
    this.filteredCards = this.filterCards(this.cards);
    this.filteredSortedCards = this.sortCards(this.filterCards(this.sortedCards));
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeAge() {
    this.age = null;
    this.filteredCards = this.filterCards(this.cards);
    this.filteredSortedCards = this.sortCards(this.filterCards(this.sortedCards));
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeSadhan() {
    this.sadhan = 0;
    this.filteredCards = this.filterCards(this.cards);
    this.filteredSortedCards = this.sortCards(this.filterCards(this.sortedCards));
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  changed() {
    console.log(this.sortX);
    if (this.sortX === Sort.INTEREST) {
      this.filteredSortedCards = this.filteredSortedCards.sort(
        (a: Card, b: Card) => {
          if (a.ratingInterest < b.ratingInterest) {
            return 1;
          } else if (a.ratingInterest === b.ratingInterest) {
            return 0;
          } else {
            return -1;
          }
        });
    } else if (this.sortX === Sort.ATTENTION) {
      this.filteredSortedCards = this.filteredSortedCards.sort(
        (a: Card, b: Card) => {
          if (a.ratingAttention < b.ratingAttention) {
            return 1;
          } else if (a.ratingAttention === b.ratingAttention) {
            return 0;
          } else {
            return -1;
          }
        });
    } else if (this.sortX === Sort.RATING) {
      this.filteredSortedCards = this.filteredSortedCards.sort(
        (a: Card, b: Card) => {
          if (a.rating < b.rating) {
            return 1;
          } else if (a.rating === b.rating) {
            return 0;
          } else {
            return -1;
          }
        });
    } else if (this.sortX === Sort.RELEVANCE) {
      this.filteredSortedCards = this.filteredSortedCards.sort(
        (a: Card, b: Card) => {
          if (a.title < b.title) {
            return 1;
          } else if (a.title === b.title) {
            return 0;
          } else {
            return -1;
          }
        });
    }
  }

  gotoVolunteer() {
    this.router.navigate(['volunteer']);
  }
}


