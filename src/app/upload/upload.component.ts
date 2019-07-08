import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  current: number;
  result: number;
  objects: Map<string, any> = new Map<string, any>();
  size: number;
  mapLevels: Map<string, number[]>;
  mapConcepts: Map<string, string[]>;
  mapConceptsEng: Map<string, string[]>;
  mapSubjects: Map<string, string[]>;
  mapTool: Map<string, string>;
  resultEntries: number;
  entries: number;
  mapEntries: Map<string, any>;

  constructor(
    private db: AngularFirestore,
    private snackbar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.db.collection('games').ref.get().then(collection => {
      this.result = collection.size;
    });
    this.db.collection('entries').ref.get().then(collection => {
      this.resultEntries = collection.size;
    });
  }

  onEntriesFile(files: FileList) {
    const fileReader = new FileReader();
    fileReader.readAsText(files[0]);
    fileReader.onload = () => {
      const objects = JSON.parse(fileReader.result.toString());
      this.mapEntries = new Map<string, any>();
      for (const objectsKey in objects) {
        if (objects.hasOwnProperty(objectsKey)) {
          this.mapEntries.set(objects[objectsKey].title, objects[objectsKey]);
        }
      }
    };
    this.entries = this.mapEntries.size;
  }

  async uploadEntries() {
    let error = false;
    let reason = '';
    this.snackbar.open('Uploading...', '', {
      duration: 2500
    });
    await this.db.collection('entries').ref.get().then(
      async (collection) => {
        await collection.forEach(async (document) => {
          await document.ref.delete().then(null);
        });
      });
    let i = 0;
    await this.mapEntries.forEach(async (value) => {
      await this.db.collection('entries').add(value).then(null).catch(reason1 => {
        error = true;
        reason = 'Entry no: ' + i + '\n' + reason1;
      });
      i += 1;
      if (i === this.mapEntries.size - 1) {
        if (error) {
          this.snackbar.open(reason, 'OK');
        } else {
          this.snackbar.open('Done!', 'OK');
        }
      }
    });
  }

  download() {
    const object = {};
    this.db.collection('entries').ref.get().then(
      (collection) => {
        collection.forEach(
          (document) => {
            object[document.id] = document.data();
          });
      }).then(async () => {
      console.log();
      const replacer = (k, v) => {
        if (v === undefined) {
          return null;
        }
        return v;
      };
      const blob = new Blob([JSON.stringify(object, replacer).toString()]);
      await FileSaver.saveAs(blob, 'entries.json');
      await new Promise(r => setTimeout(r, 1000));

    });

    const objectGames = {};
    const conceptsEnglish = {};
    const concepts = {};
    const levels = {};
    const tools = {};
    const subjects = {};
    let i = 0;
    this.db.collection('games').ref.get().then(
      (collection) => {
        collection.forEach(
          (document) => {
            i += 1;
            objectGames[document.id] = {};
            objectGames[document.id] = document.data();
            tools[document.id] = {
              tool: objectGames[document.id].tools
            };
            objectGames[document.id].subjects.forEach(
              (sub) => {
                subjects[i] = {
                  sn: i,
                  title: document.id,
                  subjects: sub
                };
              });
            objectGames[document.id].concepts.forEach(
              (hindi) => {
                concepts[i] = {
                  sn: i,
                  title: document.id,
                  concepts: hindi
                };
              });
            objectGames[document.id].conceptsEng.forEach(
              (conceptEng) => {
                conceptsEnglish[i] = {
                  sn: i,
                  title: document.id,
                  conceptsEng: conceptEng
                };
              });
            objectGames[document.id].levels.forEach(
              (lvl) => {
                levels[i] = {
                  sn: i,
                  title: document.id,
                  levels: lvl
                };
              });
            tools[i] = {
              sn: i,
              title: document.id,
              tools: objectGames[document.id].tool
            };
            delete objectGames[document.id].subjects;
            delete objectGames[document.id].concepts;
            delete objectGames[document.id].conceptsEng;
            delete objectGames[document.id].levels;
            delete objectGames[document.id].tools;
          });
      }).then(async () => {
      console.log();
      // MAIN
      const blobMain = new Blob([JSON.stringify(objectGames).toString()]);
      FileSaver.saveAs(blobMain, 'games.json');
      await new Promise(r => setTimeout(r, 1000));
      // SUBJECTS
      const blobSub = new Blob([JSON.stringify(subjects).toString()]);
      FileSaver.saveAs(blobSub, 'subjects.json');
      await new Promise(r => setTimeout(r, 1000));
      // CONCEPTS
      const blobConcepts = new Blob([JSON.stringify(concepts).toString()]);
      FileSaver.saveAs(blobConcepts, 'conceptsHindi.json');
      await new Promise(r => setTimeout(r, 1000));
      // CONCEPTS ENGLISH
      const blobConceptsEnglish = new Blob([JSON.stringify(conceptsEnglish).toString()]);
      FileSaver.saveAs(blobConceptsEnglish, 'conceptsEnglish.json');
      await new Promise(r => setTimeout(r, 1000));
      // LEVELS
      const blobLevels = new Blob([JSON.stringify(levels).toString()]);
      FileSaver.saveAs(blobLevels, 'levels.json');
      await new Promise(r => setTimeout(r, 1000));
      // TOOLS
      const blobTools = new Blob([JSON.stringify(tools).toString()]);
      FileSaver.saveAs(blobTools, 'subjects.json');
      await new Promise(r => setTimeout(r, 1000));
    });
  }

  onMainFile(files: FileList) {
    const fileReader = new FileReader();
    fileReader.readAsText(files[0]);
    fileReader.onload = () => {
      const objects = JSON.parse(fileReader.result.toString());
      console.log(objects);
      this.size = this.objects.size;
      this.objects = new Map(Object.entries(objects));
      console.log(this.objects);
    };
  }

  async upload() {
    this.snackbar.open('Uploading...', '', {
      duration: 1000
    });
    const games = this.db.collection('games');
    await games.ref.get().then(documents => {
      documents.forEach((document) => {
        document.ref.delete().then(null);
      });
    });
    let noAdded = 0;
    console.log(this.objects);
    this.objects.forEach((value) => {
      const obj = value;
      const key = value.title;
      if (!(typeof this.mapSubjects.get(key) === 'undefined')) {
        obj.subjects = this.mapSubjects.get(key);
      } else {
        obj.subjects = [];
      }

      if (!(typeof this.mapTool.get(key) === 'undefined')) {
        obj.tools = this.mapTool.get(key);
      } else {
        obj.tools = '';
      }


      if (!(typeof this.mapConcepts.get(key) === 'undefined')) {
        obj.concepts = this.mapConcepts.get(key);
      } else {
        obj.concepts = [];
      }

      if (!(typeof this.mapConceptsEng.get(key) === 'undefined')) {
        obj.conceptsEng = this.mapConceptsEng.get(key);
      } else {
        obj.conceptsEng = [];
      }

      if (!(typeof this.mapLevels.get(key) === 'undefined')) {
        obj.levels = this.mapLevels.get(key);
      } else {
        obj.levels = [];
      }
      console.log(obj);
      games.doc(key).ref.set(obj).then(
        () => {
          noAdded += 1;
        }).catch((reason) => {
        console.log(reason);
      });
    });
  }

  onLevelsFile(files: FileList) {
    const fileReader = new FileReader();
    fileReader.readAsText(files[0]);
    fileReader.onload = () => {
      const objects = JSON.parse(fileReader.result.toString());
      this.mapLevels = new Map<string, number[]>();
      for (const objectsKey in objects) {
        if (objects.hasOwnProperty(objectsKey)) {
          this.mapLevels.set(objects[objectsKey].title, []);
        }
      }
      for (const objectsKey in objects) {
        if (objects.hasOwnProperty(objectsKey)) {
          this.mapLevels.get(objects[objectsKey].title).push(objects[objectsKey].level);
        }
      }
      console.log(this.mapLevels);
    };
  }

  onConceptsFile(files: FileList) {
    const fileReader = new FileReader();
    fileReader.readAsText(files[0]);
    fileReader.onload = () => {
      const objects = JSON.parse(fileReader.result.toString());
      this.mapConcepts = new Map<string, string[]>();
      this.mapConceptsEng = new Map<string, string[]>();
      for (const objectsKey in objects) {
        if (objects.hasOwnProperty(objectsKey)) {
          if (!this.mapConcepts.has(objects[objectsKey].title)) {
            this.mapConcepts.set(objects[objectsKey].title, []);
          }
          if (!this.mapConceptsEng.has(objects[objectsKey].title)) {
            this.mapConceptsEng.set(objects[objectsKey].title, []);
          }
          this.mapConceptsEng.get(objects[objectsKey].title).push(objects[objectsKey].conceptEng);
          this.mapConcepts.get(objects[objectsKey].title).push(objects[objectsKey].conceptHindi);
        }
      }
      console.log(this.mapConcepts);
    };
  }

  onSubjectsFile(files: FileList) {
    const fileReader = new FileReader();
    fileReader.readAsText(files[0]);
    fileReader.onload = () => {
      const objects = JSON.parse(fileReader.result.toString());
      this.mapSubjects = new Map<string, string[]>();
      for (const objectsKey in objects) {
        if (objects.hasOwnProperty(objectsKey)) {
          if (!this.mapSubjects.has(objects[objectsKey].title)) {
            this.mapSubjects.set(objects[objectsKey].title, []);
          }
          this.mapSubjects.get(objects[objectsKey].title).push(objects[objectsKey].subject);
        }
      }
      console.log(this.mapSubjects);
    };
  }

  onToolsFile(files: FileList) {
    const fileReader = new FileReader();
    fileReader.readAsText(files[0]);
    fileReader.onload = () => {
      const objects = JSON.parse(fileReader.result.toString());
      this.mapTool = new Map<string, string>();
      for (const objectsKey in objects) {
        if (objects.hasOwnProperty(objectsKey)) {
          if (!this.mapTool.has(objects[objectsKey].title)) {
            this.mapTool.set(objects[objectsKey].title, '');
          }
          this.mapTool.set(objects[objectsKey].title, objects[objectsKey].tool);
        }
      }
      console.log(this.mapTool);
    };
  }
}
