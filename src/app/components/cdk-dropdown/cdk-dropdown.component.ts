import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  selector: "cdk-dropdown",
  templateUrl: "./cdk-dropdown.component.html",
  styleUrls: ["./cdk-dropdown.component.scss"],
})
export class CdkDropdownComponent implements OnInit, OnChanges {
  constructor() {}

  @Input()
  items: any[];

  @Input()
  identifierKey: string;

  @Input()
  dataKey: string;

  @Input()
  placeholder = "";

  @ViewChild("textbox", { static: true })
  textboxRef: ElementRef<HTMLInputElement>;

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOriginRef: CdkOverlayOrigin;

  @ViewChild(CdkVirtualScrollViewport)
  scrollViewport: CdkVirtualScrollViewport;

  isOpen = false;
  dropdownWidth: number;
  selectedItem = null;
  displayList = [];
  private resizeObserver = new ResizeObserver((entries) => {
    const newWidth = entries[0].borderBoxSize[0].inlineSize;
    if (newWidth !== this.dropdownWidth) {
      this.dropdownWidth = newWidth;
    }
  });

  ngOnInit() {
    this.dropdownWidth = this.overlayOrigin.getBoundingClientRect().width;
    this.resizeObserver.observe(this.overlayOrigin);

    fromEvent(this.textbox, "input")
      .pipe(debounceTime(200))
      .subscribe({
        next: (e: KeyboardEvent) => {
          const inputText = this.textbox.value.toUpperCase();

          this.displayList = this.items.filter((item) =>
            (item[this.dataKey] as string).toUpperCase().includes(inputText)
          );

          this.scrollToTop();
        },
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let prop in changes) {
      const propChange = changes[prop] as SimpleChange;

      if (propChange.currentValue !== propChange.previousValue) {
        this[prop] = propChange.currentValue;

        if (prop === "items") {
          this.displayList = this.items;
        }
      }
    }
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
  }

  get textbox() {
    return this.textboxRef.nativeElement;
  }

  get overlayOrigin() {
    return this.overlayOriginRef.elementRef.nativeElement as HTMLElement;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  openDropdown() {
    this.isOpen = true;
  }

  handleDropdownFocus(e: Event) {
    this.openDropdown();
    this.textbox.select();
  }

  handleDropdownBlur(e: Event) {
    //this.isOpen = false;
  }

  handleItemClick(e: MouseEvent, currentItem: any) {
    this.textbox.value = currentItem[this.dataKey];
    this.selectedItem = currentItem;
    this.isOpen = false;
  }

  handleOverlayOutsideClick(e) {
    //console.log("overlay outside clicked", e);
    //this.isOpen = false;
  }

  handleOverlayKeydown(e) {
    //console.log("overlay keydown", e);
  }

  handleDropdownOptionsVisible() {
    if (this.selectedItem) {
      setTimeout((_) => {
        const currentIndex = this.displayList.indexOf(this.selectedItem);
        this.scrollViewport.scrollToIndex(currentIndex);
      });
    }
  }

  handleClearIconClick(e: MouseEvent) {
    e.stopPropagation();
    this.clearTextBox();
    this.clearSelection();
    this.resetDisplayList();
    this.textbox.focus();
  }

  clearSelection() {
    this.selectedItem = null;
  }

  clearTextBox() {
    this.textbox.value = "";
  }

  resetDisplayList() {
    this.displayList = this.items;
    setTimeout(() => {
      this.scrollToTop();
    });
  }

  scrollToTop() {
    this.scrollViewport.scrollTo({ top: 0 });
  }
}
