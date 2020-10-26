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
  //product: Product;
  errorMessage: string;
  private dataIsValid: { [key: string]: boolean } = {};
  get isDirty(): boolean {
    return JSON.stringify(this.originalProduct) !== JSON.stringify(this.currentProduct);
  }
  
  private currentProduct: Product;
  private originalProduct: Product;

  get product(): Product {
    return this.currentProduct;
  }
  set product(value: Product) {
    this.currentProduct = value;
    // Clone the object to retain a copy
    this.originalProduct = value ? { ...value } : null;
  }
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

  
  validate(): void {
    // Clear the validation object
    this.dataIsValid = {};


    if (this.product.productName &&
      this.product.productName.length >= 3 &&
      this.product.productCode) {
      this.dataIsValid['productName'] = true;
    } else {
      this.dataIsValid['productName'] = false;
    }

    
    if (this.product.productCode &&
      this.product.productCode.length >= 3) {
      this.dataIsValid['productCode'] = true;
    } else {
      this.dataIsValid['productCode'] = false;
    }
  }

  isValid(path?: string): boolean {
    this.validate();
    if (path) {
      return this.dataIsValid[path];
    }
    return (this.dataIsValid &&
      Object.keys(this.dataIsValid).every(d => this.dataIsValid[d] === true));
  }
  onProductSave(): void {
    if (this.isValid()) {
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
