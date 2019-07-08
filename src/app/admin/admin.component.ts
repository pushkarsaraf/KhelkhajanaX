import {Component, OnInit} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatBottomSheet, MatChipInputEvent, MatSnackBar} from '@angular/material';
import {AddConceptComponent} from '../add-concept/add-concept.component';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
class EntryX {
  bestAgeMax = 15;
  bestAgeMin = 3;
  ratingAttention = 7;
  remark = '';
  ratingEngagement: number;
  ageOldest = 15;
  ageYoungest = 3;
  attendance = 0;
  attention = 7;
  centre: string;
  date: string = new Date().toDateString();
  details: string;
  gameId: number;
  title: string;
  interest: number;
  volunteer: string;
}

class Card {
  activityType = 0;
  title = '';
  titleEng = '';
  img = 'http://placekitten.com/301/201';
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

enum Sort {
  RATING = 3,
  INTEREST = 1,
  ATTENTION = 0,
  RELEVANCE = 4,
  POPULARITY = 2
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit {
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
  entries = new Array<EntryX>();
  private filteredCards: Card[];

  constructor(
    private db: AngularFirestore,
    private bottomSheet: MatBottomSheet,
    private snackbar: MatSnackBar,
    private auth: AngularFireAuth,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.sadhan = 0;
    this.db.collection('games').ref.get().then(
      (collection) => {
        collection.forEach(
          (document) => {
            const card: Card = document.data() as Card;
            if (!card.hasOwnProperty('img')) {
              card.img = 'http://placekitten.com/301/201';
            }
            this.cards.push(card);
          });
        this.sortedCards = this.cards;
        this.filteredCards = this.cards;
        this.filteredSortedCards = this.cards;
      });
  }

  openDialog() {
    this.bottomSheet.open(AddConceptComponent, {
      panelClass: 'panel'
    });
  }


  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.terms.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
    this.filteredSortedCards = this.sortCards(this.filteredCards);
    console.log('fileredSize: ' + this.filteredSortedCards.length);
  }

  remove(term: string): void {
    const index = this.terms.indexOf(term);
    if (index >= 0) {
      this.terms.splice(index, 1);
    }
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
            howToPlayYes = card.howToPlay.includes(termx);
          }
          let howToPlayEngYes = true;
          if (card.howToPlayEng !== null) {
            howToPlayEngYes = card.howToPlayEng.includes(termx);
          }
          let conceptYes = true;
          if (card.concept !== null) {
            conceptYes = card.concept.includes(termx);
          }
          let conceptEngYes = true;
          if (card.conceptEng !== null) {
            conceptEngYes = card.conceptEng.includes(termx);
          }
          result = result && (titleYes || titleHiYes || howToPlayYes || howToPlayEngYes || conceptYes || conceptEngYes);
        });
        return result;
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

  submit() {
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
          conceptEngYes = card.conceptsEng.includes(this.english);
        }
        let conceptMathYes = true;
        if (this.math !== null) {
          conceptMathYes = card.conceptsEng.includes(this.math);
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
    this.filteredSortedCards = this.filterCards(this.sortedCards);
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeMath() {
    this.math = null;
    this.filteredSortedCards = this.filterCards(this.sortedCards);
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeEnglish() {
    this.english = null;
    this.filteredSortedCards = this.filterCards(this.sortedCards);
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeClass() {
    this.class = null;
    this.filteredSortedCards = this.filterCards(this.sortedCards);
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeInterest() {
    this.rating = null;
    this.ratingAttn = null;
    this.ratingInterest = null;
    this.filteredSortedCards = this.filterCards(this.sortedCards);
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeAge() {
    this.age = null;
    this.filteredSortedCards = this.filterCards(this.sortedCards);
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  removeSadhan() {
    this.sadhan = 0;
    this.filteredSortedCards = this.filterCards(this.sortedCards);
    console.log('Size: ' + this.filteredSortedCards.length);
  }

  updateConceptsWithEntries() {
    this.db.collection('entries').ref.get().then(
      (entries) => {
        entries.forEach(
          (entry) => {
            this.entries.push(entry.data() as EntryX);
          }
        );
        this.cards.forEach(
          (card: Card) => {
            let maxAge = 0;
            let minAge = 0;
            let ratingInterest = 0;
            let ratingAttention = 0;
            let ratingEngagement = 0;
            let N = 0;
            this.entries.forEach(
              (entry: EntryX) => {
                if (entry.title === card.title) {
                  N += 1;
                  maxAge += entry['Best age (Max)'];
                  minAge += entry['Best age (min)'];
                  ratingInterest += entry.interest;
                  ratingAttention += entry.attention;
                  ratingEngagement += Number(entry['Self driven engagment possibility']);
                }
              });
            maxAge = Math.round(card.maxAge / N);
            minAge = Math.round(card.minAge / N);
            ratingInterest = Math.round(card.ratingInterest / N);
            ratingAttention = Math.round(card.ratingAttention / N);
            ratingEngagement = Math.round(card.ratingEngagement / N);
            this.db.collection('games').doc(card.id).update({
              maxAge,
              minAge,
              ratingInterest,
              ratingAttention,
              ratingEngagement
            });
          });
      }).catch(
      (error) => {
        this.snackbar.open('Error' + error.message, 'OK');
      });
  }
}
