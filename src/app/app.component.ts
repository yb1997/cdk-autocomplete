import { Component } from '@angular/core';

const randomInt = max => Math.floor(Math.random() * max);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cdk-dropdown';
  items = [
    { id: 1, name: "Red"},
    { id: 2, name: "Blue" },
    { id: 3, name: "Orange" },
    { id: 4, name: "Cyan" },
    { id: 5, name: "Yellow" },
    { id: 6, name: "Black" },
    { id: 7, name: "White" }
  ];

  constructor() {
    this.items = [
      ...this.items,
      ...Array
        .from({length: 10000})
        .map(_ => ({
          id: randomInt(10000),
          name: this.items[randomInt(this.items.length)].name
        }))
    ];
  }
}
