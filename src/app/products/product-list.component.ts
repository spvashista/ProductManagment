import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  pageTitle = 'Product List';
  imageWidth = 50;
  imageMargin = 2;
  showImage = false;
  errorMessage = '';

  _listFilter = '';
  get listFilter(): string {
    return this._listFilter;
  }
  set listFilter(value: string) {
    this._listFilter = value;
    this.filteredProducts = this.listFilter ? this.performFilter(this.listFilter) : this.products;
  }

  filteredProducts: Product[] = [];
  products: Product[] = [];

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.GetAll();  
  }
  GetAll=()=>{
    this.productService.getProducts().subscribe({
      next: products => {
        console.log(products);
        this.products = products;
        this.filteredProducts = this.performFilter(this.listFilter);
      },
      // error: err => this.errorMessage = err
    });

  }

  performFilter(filterBy: string): Product[] {
    filterBy = filterBy.toLocaleLowerCase();
    return this.products.filter((product: Product) =>
      product.productName.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  toggleImage(): void {
    this.showImage = !this.showImage;
  }

  OnProductRemove(productId) : void {
   
    this.productService.deleteProduct(productId).subscribe({
      next: product => {
        console.log(product);
        this.GetAll();  
      
      },
      // error: err => this.errorMessage = err
    });

  //  this.filteredProducts=this.products = this.productService.products.filter(x=>x.productId!=productId);
   
 }

}
