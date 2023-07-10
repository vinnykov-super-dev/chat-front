import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorsService {
  private colors = [
    '#084c9e',
    '#002880',
    '#303c49',
    '#040d3c',
    '#022e3e',
    '#271e4b',
    '#20123c',
    '#241056',
    '#3b2763',
    '#55417b',
    '#2F3133',
  ];

  public getColor(): string {
    const index = Math.floor(Math.random() * this.colors.length);
    return this.colors[index];
  }
}
