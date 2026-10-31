import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from "@angular/core";
import { Company } from "@modules/compagnies/companies.types";

@Component({
  standalone: false,

  selector: "app-companies-list-item",
  templateUrl: "./companies-list-item.component.html",
})
export class CompaniesListItemComponent implements AfterViewInit, OnDestroy {
  @Input() item!: Company;
  @Output("onView") onView$: EventEmitter<Company> = new EventEmitter();

  @ViewChild("descriptionRef") descriptionRef!: ElementRef;

  isDescriptionShort = false;
  layoutReady = false;
  private resizeObserver!: ResizeObserver;
  private readonly SHORT_THRESHOLD = 50;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.evaluate();
        this.layoutReady = true;
        this.cdr.detectChanges();

        if (this.descriptionRef?.nativeElement) {
          this.resizeObserver = new ResizeObserver(() => {
            this.evaluate();
            this.cdr.detectChanges();
          });
          this.resizeObserver.observe(this.descriptionRef.nativeElement);
        }
      });
    });
  }

  private evaluate(): void {
    const h = this.descriptionRef?.nativeElement?.scrollHeight ?? 0;
    this.isDescriptionShort = h < this.SHORT_THRESHOLD;
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  onView(item: Company): void {
    this.onView$.emit(item);
  }
}
