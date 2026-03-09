import {
  Component,
  inject,
  input,
  linkedSignal,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductService } from '@shared/services/product.service';
import { CartService } from '@shared/services/cart.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { environment } from '@envs/environment';
import { MetaTagsService } from '@shared/services/meta-tags.service';
import { RelatedComponent } from '@products/components/related/related.component';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, NgOptimizedImage, RelatedComponent],
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProductDetailComponen {
  slug = input.required<string>();
  $cover = linkedSignal(() => this.productRs.value()?.images[0] || '');
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private readonly metaTagsService = inject(MetaTagsService);

  constructor() {
    effect(() => {
      const product = this.productRs.value();

      if (product) {
        this.metaTagsService.updateMetaTags({
          title: product.title,
          description: product.description,
          image: product.images[0],
          url: `${environment.domain}/products/${product.slug}`,
        });
      }
    });
  }

  productRs = rxResource({
    params: () => ({
      slug: this.slug(),
    }),
    stream: ({ params }) => this.productService.getOneBySlug(params.slug),
  });

  changeCover(newImg: string) {
    this.$cover.set(newImg);
  }

  addToCart() {
    const product = this.productRs.value();
    if (product) {
      this.cartService.addToCart(product);
    }
  }
}
