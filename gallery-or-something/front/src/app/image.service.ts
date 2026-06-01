import { Injectable } from '@angular/core';
import { Product } from './Model/Product';
import { HttpClient } from '@angular/common/http';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  images: Product[] = [];
  private images$?: Observable<Product[]>;
  constructor(private http: HttpClient) {}

  getImages() {
    return this.http.get<any[]>('http://localhost:3000/api/images').pipe(
      take(1),
      map((items) => {
        const imageMap = new Map<string, Product>(
          items.map((item) => [
            item.name,
            {
              imgUrl: item.url,
              title: item.name,
            },
          ]),
        );

        return imageMap;
      }),
    );
  }
}
