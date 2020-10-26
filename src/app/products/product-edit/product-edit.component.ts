import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../messages/message.service';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  pageTitle: string = 'Product Edit';
  product: Product;
  errorMessage: string;
  private dataIsValid: { [key: string]: boolean } = {};
  constructor(private route: ActivatedRoute,private productService:ProductService,
              private router: Router,private messageService: MessageService) { }

  ngOnInit(): void {
    let id = +this.route.snapshot.paramMap.get('id'); 
    this.getProduct(id);    
  }

  getProduct(productId: number): void {
    this.productService.getProduct(productId).subscribe({
      next: product => this.onProductRetrieved(product),
     // error: err => this.errorMessage = err
    });
  }

  onProductRetrieved(product: Product): void {
  
    this.product = product;

    if (!this.product) {
      this.pageTitle = 'No product found';
    } else {
      if (this.product.id === 0) {
        this.pageTitle = 'Add Product';
      } else {
        this.pageTitle = `Edit Product: ${this.product.productName}`;
      }
    }
  }
 
  onProductSave(): void {
    if (true===true) {
      if (this.product.id === 0) {
        this.productService.createProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The new ${this.product.productName} was saved`),
          error: err => this.errorMessage = err
        });
      } else {
        this.productService.updateProduct(this.product).subscribe({
          next: () => this.onSaveComplete(`The updated ${this.product.productName} was saved`),
          error: err => this.errorMessage = err
        });
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(message?: string): void {
    if (message) {
      this.messageService.addMessage(message);
    }   
    // Navigate back to the product list
    this.router.navigate(['/products']);
  }

  
  
}
