import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from "@angular/core";

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
  currentIndex = -1;
  displayList = [];

  ngOnInit() {
    this.dropdownWidth = this.overlayOrigin.getBoundingClientRect().width;
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

  // ngDoCheck() {
  //   console.log("ng do check fired");
  // }

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
  }

  handleDropdownBlur(e: Event) {
    //this.isOpen = false;
  }

  handleItemClick(e: MouseEvent, currentItem: any, index: number) {
    this.textbox.value = currentItem[this.dataKey];
    this.currentIndex = index;
    this.isOpen = false;
  }

  handleOverlayOutsideClick(e) {
    console.log("overlay outside clicked", e);
    //this.isOpen = false;
  }

  handleOverlayKeydown(e) {
    console.log("overlay keydown", e);
  }

  handleDropdownOptionsVisible() {
    if (this.currentIndex !== -1) {
      setTimeout((_) => {
        this.scrollViewport.scrollToIndex(this.currentIndex);
      });
    }
  }

  handleClearIconClick(e: MouseEvent) {
    e.stopPropagation();
    this.clearTextBox();
    this.clearSelection();
    this.resetDisplayList();
    this.openDropdown();
  }

  clearSelection() {
    this.currentIndex = -1;
  }

  clearTextBox() {
    this.textbox.value = "";
  }

  resetDisplayList() {}
}
