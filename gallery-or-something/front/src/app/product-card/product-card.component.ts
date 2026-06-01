import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Product } from '../Model/Product';

@Component({
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css',
})
export class ProductCardComponent {
  selectedProduct: Product;

  @Input() productImgUrl: string = '';
  @Input() product: Product;

  @Output() onSelectedCard = new EventEmitter<string>();

  selectCard() {
    this.selectedProduct = this.product;

    this.onSelectedCard.emit(this.product.imgUrl);
  }
}
