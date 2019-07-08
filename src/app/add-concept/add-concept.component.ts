import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {FormControl, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {map, startWith} from 'rxjs/operators';
import {Observable} from 'rxjs';

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
  submittedBy: string;
  image: string;
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
  doc: string;
  submittedBy: string;
  // id: string;
  // gameId: number;
}

@Component({
  selector: 'app-add-concept',
  templateUrl: './add-concept.component.html',
  styleUrls: ['./add-concept.component.scss']
})
export class AddConceptComponent implements OnInit {

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
  }

  toggle = true;
  subjects = [];
  mathConcepts = [];
  englishConcepts = [];
  classes = [
    {value: 0, display: 'KG 1'},
    {value: 0.5, display: 'KG 2'},
    {value: 1, display: '1'},
    {value: 2, display: '2'},
    {value: 3, display: '3'},
    {value: 4, display: '4'},
    {value: 5, display: '5'},
    {value: 6, display: '6'},
    {value: 7, display: '7'},
    {value: 8, display: '8'},
    {value: 9, display: '9'},
    {value: 10, display: '10'},
  ];
  tools = [];
  ages = [];
  centers = [];
  authName: string;

  oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  activityTypeCtrl = new FormControl(0, Validators.required);
  titleCtrl = new FormControl('', Validators.required);
  titleEngCtrl = new FormControl('', Validators.required);
  conceptsCtrl = new FormControl('');
  subjectsCtrl = new FormControl([], Validators.required);
  levelsCtrl = new FormControl('');
  how2PlayCtrl = new FormControl('');
  how2PlayEngCtrl = new FormControl('');
  videoLinkCtrl = new FormControl('');
  imgCtrl = new FormControl('');
  printCtrl = new FormControl('', Validators.required);
  toolCtrl = new FormControl('', Validators.required);
  documentLinkCtrl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  private volunteers = [];
  titlexCtrl = new FormControl('', Validators.required);
  dateCtrl = new FormControl('', Validators.required);
  imageCtrl = new FormControl('');
  centerCtrl = new FormControl('', Validators.required);
  volunteerCtrl = new FormControl('', Validators.required);
  attendanceCtrl = new FormControl(0, Validators.required);
  ageOldestCtrl = new FormControl(16, Validators.required);
  ageYoungestCtrl = new FormControl(0, Validators.required);
  interestCtrl = new FormControl(7, Validators.required);
  attentionCtrl = new FormControl(7, Validators.required);
  facCtrl = new FormControl(7, Validators.required);
  selfCtrl = new FormControl(7, Validators.required);
  mathCtrl = new FormControl('');
  engCtrl = new FormControl('');

  static hasHindiCharacters(str) {
    return str.split('').filter((char) => {
      const charCode = char.charCodeAt(0);
      return charCode >= 2309 && charCode <= 2361;
    }).length > 0;
  }

  ngOnInit() {
    this.filteredOptions = this.titlexCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.db.collection('games').ref.get().then(
      (cards) => {
        cards.forEach(
          (card) => {
            this.options.push(card.data().title);
          });
      });
    if (this.afAuth.auth.currentUser === null) {
      this.router.navigate(['/auth', 'back-to-add']).then(null);
    }
    this.authName = this.afAuth.auth.currentUser.email;
    for (let i = 3; i < 16; i++) {
      this.ages.push(i);
    }
    this.db.collection('Util').doc('tools').ref.get().then(
      (document) => {
        this.tools = document.data().value;
      });
    this.db.collection('Util').doc('volunteers').ref.get().then(
      (document) => {
        this.volunteers = document.data().value;
      });
    this.db.collection('Util').doc('centres').ref.get().then(
      (document) => {
        this.centers = document.data().value;
      });
    this.db.collection('Util').doc('subjects').ref.get().then(
      (document) => {
        this.subjects = document.data().value;
      });
    this.db.collection('Util').doc('math').ref.get().then(
      (document) => {
        this.mathConcepts = document.data().value;
      });
    this.db.collection('Util').doc('eng').ref.get().then(
      (document) => {
        this.englishConcepts = document.data().value;
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  submitActivity() {
    if (
      !(this.titleCtrl.valid &&
        this.titleEngCtrl.valid &&
        this.conceptsCtrl.valid &&
        this.subjectsCtrl.valid &&
        this.levelsCtrl.valid &&
        this.documentLinkCtrl.valid &&
        this.videoLinkCtrl.valid &&
        this.how2PlayCtrl.valid &&
        this.how2PlayEngCtrl.valid &&
        this.imgCtrl.valid &&
        this.printCtrl.valid &&
        this.toolCtrl.valid &&
        this.activityTypeCtrl.valid)
    ) {
      this.snackbar.open('Please fix errors and submit again', 'OK', {duration: 1000});
    } else if (!AddConceptComponent.hasHindiCharacters(this.titleCtrl.value)) {
      this.snackbar.open('Title needs to be in hindi', 'OK', {duration: 1000});
    } else {
      const card = new Card();
      card.activityType = this.activityTypeCtrl.value;
      card.title = this.titleCtrl.value;
      card.titleEng = this.titleEngCtrl.value;
      if (this.imgCtrl.value.lenght > 1) {
        card.img = this.imgCtrl.value;
      }
      card.conceptsEng = '';
      try {
        card.conceptsEng += this.arrayToString(this.mathCtrl.value);
      } catch (ex) {}
      try {
        card.conceptsEng += this.arrayToString(this.engCtrl.value);
      } catch (ex) {}
      card.subjects = this.subjectsCtrl.value;
      card.levels = this.arrayToString(this.levelsCtrl.value);
      card.videoLink = this.videoLinkCtrl.value;
      card.how2Play = this.how2PlayCtrl.value;
      card.how2PlayEng = this.how2PlayEngCtrl.value;
      card.tools = this.toolCtrl.value;
      card.doc = this.documentLinkCtrl.value;
      card.submittedBy = this.authName;
      this.db.collection('games').doc(card.title).set(Object.assign({}, card)).then(
        () => {
          this.snackbar.open('Added successfully!', 'OK', {duration: 1000});
        }).catch(
        (error) => {
          this.snackbar.open(`Error: ${error}`, 'OK', {duration: 1000});
        });
    }
  }

  arrayToString(array: Array<string>): string {
    let result = '';
    array.forEach(
      (str) => {
        result += str + ', ';
      });
    result.substring(0, result.length - 2);
    return result;
  }

  submitFeedback() {
    if (
      !(
        this.selfCtrl.valid &&
        this.imageCtrl.valid &&
        this.attentionCtrl.valid &&
        this.volunteerCtrl.valid &&
        this.titlexCtrl.valid &&
        this.interestCtrl.valid &&
        this.dateCtrl.valid &&
        this.centerCtrl.valid &&
        this.ageOldestCtrl.valid &&
        this.ageYoungestCtrl.valid &&
        this.attendanceCtrl.valid &&
        this.facCtrl.valid)
      ) {
      this.snackbar.open('Please fix errors and submit again!');
    } else {
      const entry = new EntryX();
      entry.image = this.imageCtrl.value;
      entry.ratingEngagement = this.selfCtrl.value;
      entry.ratingAttention = this.attentionCtrl.value;
      entry.volunteer = this.volunteerCtrl.value;
      entry.title = this.titlexCtrl.value;
      entry.interest = this.interestCtrl.value;
      entry.date = this.dateCtrl.value;
      entry.centre = this.centerCtrl.value;
      entry.bestAgeMax = this.ageOldestCtrl.value;
      entry.bestAgeMin = this.ageYoungestCtrl.value;
      entry.attendance = this.attendanceCtrl.value;
      entry.attention = this.facCtrl.value;
      entry.submittedBy = this.authName;
      this.db.collection('entries').add(Object.assign({}, entry)).then(
        () => {
          this.snackbar.open('Added successfully!', 'OK', {duration: 1000});
        }).catch(
        (error) => {
          this.snackbar.open(`Error: ${error}`, 'OK', {duration: 1000});
        });
    }
  }

  close() {
    this.router.navigate(['/home']).then(null);
  }
}
