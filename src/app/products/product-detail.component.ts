import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  pageTitle: string = 'Product Detail';
  product: Product;

  constructor(private route: ActivatedRoute,private productService:ProductService,
              private router: Router) { }

  ngOnInit(): void {
    let productId = +this.route.snapshot.paramMap.get('productId');
    alert(this.pageTitle);
    this.pageTitle += `: ${productId}`;
    
   /* this.product = {
      'productId': id,
      'productName': 'Leaf Rake',
      'productCode': 'GDN-0011',
      'releaseDate': 'March 19, 2019',
      'description': 'Leaf rake with 48-inch wooden handle.',
      'price': 19.95,
      'starRating': 3.2,
      'imageUrl': 'assets/images/leaf_rake.png'
    };*/
    this.getProduct(productId);
  }

  getProduct(productId: number): void {
    this.productService.getProduct(productId).subscribe({
      next: product => this.onProductRetrieved(product),
      // error: err => this.errorMessage = err
    });
  }

  onProductRetrieved(product: Product): void {
    this.product = product;

    if (this.product) {
      this.pageTitle = `Product Detail: ${this.product.productName}`;
    } else {
      this.pageTitle = 'No product found';
    }
  }

  onBack(): void {
    this.router.navigate(['/products']);
  }
}
