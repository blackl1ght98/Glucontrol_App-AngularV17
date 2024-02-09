import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appLazyLoadImage]',
  standalone: true,
})
export default class LazyLoadImageDirective implements AfterViewInit {
  @Input() set lazyLoad(source: string) {
    this.updateImageSource(source);
  }

  private observer: IntersectionObserver;

  constructor(private el: ElementRef) {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImage(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01 }
    );
  }

  ngAfterViewInit(): void {
    // Intenta cargar la imagen en caso de que sea un atributo estático
    const staticSrc = this.el.nativeElement.getAttribute('lazyload');
    if (staticSrc) {
      this.updateImageSource(staticSrc);
    }

    // Observa el elemento
    this.observer.observe(this.el.nativeElement);
  }

  private updateImageSource(source: string): void {
    if (source) {
      this.el.nativeElement.dataset.src = source;
    }
  }

  private loadImage(imageElement: any): void {
    const src = imageElement.dataset.src;
    if (src) {
      imageElement.src = src;
    }
  }
}
