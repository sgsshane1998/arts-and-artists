import { Component, OnInit, ViewChild } from '@angular/core';
import { ResultListComponent } from './components/result-list/result-list.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cs571 hw8';
  userInput = '';
  @ViewChild(ResultListComponent, {static:true}) child?: ResultListComponent;
  engageChild() {
    this.child?.search_artist();
  }
  clearField() {
    this.child?.clearAll();
  }
}

