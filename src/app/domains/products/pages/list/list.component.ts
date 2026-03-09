import {
  Component,
  input,
  inject,
  resource,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';
import { ProductComponent } from '@products/components/product/product.component';

import { Product } from '@shared/models/product.model';
import { CartService } from '@shared/services/cart.service';
import { ProductService } from '@shared/services/product.service';
import { CategoryService } from '@shared/services/category.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ProductComponent, RouterLinkWithHref],
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ListComponent {
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  readonly slug = input<string>();

  // products = signal<Product[]>([]);
  // loadingProducts = signal(false);
  // errorProducts = signal<string>('');

  // productsResource = rxResource();
  // $categories = toSignal(this.categoryService.getAll(), {
  //   initialValue: [],
  // });
  categoriesResource = resource({
    loader: () => this.categoryService.getAllPromise(),
  });

  productsResource = rxResource({
    params: () => ({
      category_slug: this.slug(),
    }),
    stream: ({ params }) => this.productService.getProducts(params),
  });

  // ngOnInit() {
  //   this.getCategories();
  // }

  // ngOnChanges() {
  //   this.getProducts();
  // }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  // private getProducts() {
  //   this.loadingProducts.set(true);
  //   this.productService.getProducts({ category_slug: this.slug() }).subscribe({
  //     next: products => {
  //       this.products.set(products);
  //       this.loadingProducts.set(false);
  //     },
  //     error: err => {
  //       this.errorProducts.set(err.message);
  //       this.loadingProducts.set(false);
  //       this.products.set([]);
  //     },
  //   });
  // }

  resetCategories() {
    this.categoriesResource.set([]);
  }

  reloadCategories() {
    this.categoriesResource.reload();
  }

  reloadProducts() {
    this.productsResource.reload();
  }

  // private getCategories() {
  //   this.categoryService.getAll().subscribe({
  //     next: data => {
  //       this.categories.set(data);
  //     },
  //   });
  // }
}
