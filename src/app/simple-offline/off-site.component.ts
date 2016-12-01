import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {AngularIndexedDB} from 'angular2-indexeddb';

@Component({
    selector: 'off-site',
    template: `

    <img height="84" width="175" alt="home" [src]="angularclassLogo">
    
    <form #f="ngForm" (ngSubmit)="add(f)" novalidate>
      <input name="first" ngModel required #first="ngModel">
      <input name="last" ngModel>
      <button>Submit</button>
    </form> 
    <!--p>First name value: {{ first.value }}</p>
    <p>Form value: {{ f.value | json }}</p-->
    <p>-------------------</p>
    <li *ngFor="let item of items; let i = index; ">
        <span>{{item.first}} {{item.last}}</span>
        <button (click)="getByKey(item.id)">Get by key: {{item.id}} </button>
        <button (click)="getByIndex(item.last)">Get by index "Last" : {{item.last}} </button>
        <button (click)="delete(item.id)">Delete {{item.id}}</button>
    </li>
    <p>-------------------</p>
    <button (click)="cursor()">Cursor</button>
    <button (click)="getAll()">get all</button>
  `,
})

export class OffSiteComponent implements OnInit{
  angularclassLogo = 'assets/img/angularclass-avatar.png';

  db : any;
  items : any[] = [];

  ngOnInit() {
    this.db  = new AngularIndexedDB('myDb', 1);
    this.db.createStore(1, (evt) => {
      let objectStore = evt.currentTarget.result.createObjectStore(
        'people', { keyPath: "id", autoIncrement: true });
      objectStore.createIndex("first", "first", { unique: false });
      objectStore.createIndex("last", "last", { unique: true });
    });
  }

  add(f: NgForm) {
      this.db.add('people', { first: f.value['first'], last: f.value['last'] }).then(() => {
        // Do something after the value was added
        console.log('value added: ' + f.value['first']);  // { first: '', last: '' }
        this.cursor();
      }, (error) => {
        console.log(error);
      });
  }

  delete(i: number){
    this.db.delete('people',i).then(() => {
      // Do something after the value was added
      console.log('ID deleted: '+i);  // { first: '', last: '' }
      this.cursor();
    }, (error) => {
      console.log(error);
    });
  }

  getByIndex(last: string) {
    this.db.getByIndex('people', 'last', last).then((result) => {
      console.log('getByIndex '+JSON.stringify(result));  // {"isTrusted":true}
    }, (error) => {
      console.log(error);
    });
  }

  getAll() {
    this.db.getAll('people').then((result) => {
      console.log('getAll: '+result); //undefined
    }, (error) => {
      console.log(error);
    });
  }

  getByKey(i: number){
    this.db.getByKey('people', i).then((result) => {
      console.log('getByKey '+JSON.stringify(result)); // {"isTrusted":true}
    }, (error) => {
      console.log(error);
    });
  }

  cursor(){
    this.items.splice(0, this.items.length);
    this.db.openCursor('people', (evt) => {
      var cursor = evt.target.result;
      if(cursor) {
        console.log(cursor.value);
        this.items.push(cursor.value);
        //this.items.splice(0, 0, cursor.value);
        cursor.continue();
      } else {
        console.log('Entries all displayed.');
      }
    });
  }


}
