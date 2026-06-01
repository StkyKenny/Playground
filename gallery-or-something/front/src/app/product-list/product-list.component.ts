import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ImageService } from '../image.service';
import { Product } from '../Model/Product';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, ProductCardComponent, ScrollingModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  imgsName: string[] = [];
  images: Map<string, Product>;
  filteredImgs: string[];
  imgurl: string;
  rows: string[][] = [];

  easterFound: string = '';

  text1 = '';

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    console.log('ini');
    this.imageService.getImages().subscribe((result) => {
      this.images = result;
      this.imgsName = Array.from(result.keys());
      this.filteredImgs = this.imgsName;
      this.imgurl = this.images.get(this.imgsName[0])?.imgUrl!;
      this.chunking();
      this.easterFound = this.imgurl;
      console.log(this.easterFound);
    });
  }

  chunking() {
    const result: string[][] = [];
    let size = 5;
    for (let i = 0; i < this.filteredImgs.length; i += size) {
      result.push(this.filteredImgs.slice(i, i + size));
    }

    this.rows = result;
  }

  @HostListener('window:keydown.r', ['$event'])
  bigFont(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    this.randomizeImg();
  }
  randomizeImg() {
    this.imgurl = this.images.get(
      this.imgsName[Math.floor(Math.random() * this.imgsName.length)],
    )?.imgUrl!;
  }

  filterList() {
    this.filteredImgs = this.imgsName.filter((imgsName) =>
      imgsName.toLowerCase().includes(this.text1.toLowerCase()),
    );
    this.chunking();
  }

  clickFilterList(input: HTMLInputElement) {
    this.text1 = input.value;
    this.filteredImgs = this.imgsName.filter((imgsName) =>
      imgsName.includes(input.value),
    );
  }

  selectChange(value: string) {
    this.imgurl = value;
  }

  /*onTextChanged(event: any) {
    console.log(event);
    console.log(typeof event);
    this.text1 = event.target.value;
  }*/
}
