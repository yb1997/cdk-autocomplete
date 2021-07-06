import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
  UP_ARROW,
  DOWN_ARROW,
  ENTER,
  TAB,
  ESCAPE,
  P,
} from "@angular/cdk/keycodes";
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { DropdownAnimation } from "./dropdown.anim";

type NavigationKey = typeof UP_ARROW | typeof DOWN_ARROW;

@Component({
  selector: "cdk-dropdown",
  templateUrl: "./cdk-dropdown.component.html",
  styleUrls: ["./cdk-dropdown.component.scss"],
  animations: [DropdownAnimation],
})
export class CdkDropdownComponent implements OnInit, OnChanges, OnDestroy {
  constructor() {}

  @Input()
  items: any[];

  @Input()
  identifierKey: string;

  @Input()
  dataKey: string;

  @Input()
  placeholder = "";

  @Input()
  defaultValue;

  @ViewChild("textbox", { static: true })
  textboxRef: ElementRef<HTMLInputElement>;

  @ViewChild(CdkOverlayOrigin, { static: true })
  overlayOriginRef: CdkOverlayOrigin;

  @ViewChild(CdkVirtualScrollViewport)
  scrollViewport: CdkVirtualScrollViewport;

  isOpen = false;
  dropdownWidth: number;
  selectedItem = null;
  highlightedItem = null;
  displayList = [];
  private readonly resizeObserver = new ResizeObserver((entries) => {
    // borderBoxSize is instance of ResizeObserverSize in firefox but it's an array of ResizeObserverSize in chromium based browsers
    const boxSize = Array.isArray(entries[0].borderBoxSize)
      ? entries[0].borderBoxSize[0]
      : entries[0].borderBoxSize;

    const newWidth = boxSize.inlineSize;
    if (newWidth !== this.dropdownWidth) {
      this.dropdownWidth = newWidth;
    }
  });
  private subscription: Subscription;
  private keyHandlers: Map<number, (e: KeyboardEvent) => void> = new Map();

  ngOnInit() {
    this.dropdownWidth = this.overlayOrigin.getBoundingClientRect().width;
    this.resizeObserver.observe(this.overlayOrigin);

    this.subscription = fromEvent(this.textbox, "input")
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

    this.keyHandlers.set(UP_ARROW, this.onKeyboardNavigation);
    this.keyHandlers.set(DOWN_ARROW, this.onKeyboardNavigation);
    this.keyHandlers.set(TAB, this.onTabPressInOverlay);
    this.keyHandlers.set(ESCAPE, this.onEscapePressInOverlay);
    this.keyHandlers.set(ENTER, this.onEnterPressInOverlay);
  }

  ngOnChanges(changes: SimpleChanges) {
    for (let prop in changes) {
      const propChange = changes[prop] as SimpleChange;

      if (prop === "items") {
        this.displayList = this.items;
      }
    }
  }

  ngOnDestroy() {
    this.resizeObserver.disconnect();
    this.subscription?.unsubscribe();
  }

  get textbox() {
    return this.textboxRef.nativeElement;
  }

  get overlayOrigin() {
    return this.overlayOriginRef.elementRef.nativeElement as HTMLElement;
  }

  isValidKeyPressed(keyPressed: number) {
    return [UP_ARROW, DOWN_ARROW, ENTER, TAB, ESCAPE].some(
      (k) => k === keyPressed
    );
  }

  toggleDropdown() {
    if (!this.isOpen) {
      this.textbox.focus();
    } else {
      this.dismiss();
    }
    this.highlightedItem = null;
  }

  openDropdown() {
    this.isOpen = true;
  }

  handleDropdownFocus(e: Event) {
    this.openDropdown();
    this.textbox.select();
  }

  handleItemClick(e: MouseEvent, currentItem: any) {
    this.selectItem(currentItem);
  }

  handleOverlayOutsideClick(e: MouseEvent) {
    if (!this.overlayOrigin.contains(e.target as HTMLElement)) {
      this.dismiss();
    }
  }

  handleOverlayKeydown(e: KeyboardEvent) {
    // even though keyCode is deprecated, it does have better cross-browser compatibility
    if (!this.isValidKeyPressed(e.keyCode)) return;

    const keyHandler = this.keyHandlers.get(e.keyCode);
    keyHandler?.call(this, e);
  }

  handleDropdownOptionsVisible() {
    if (this.selectedItem) {
      setTimeout((_) => {
        const currentIndex = this.displayList.indexOf(this.selectedItem);
        this.scrollViewport.scrollToIndex(currentIndex);
      });
    }
  }

  handleListItemMouseEnter(item) {
    this.highlightedItem = item;
  }

  handleListItemMouseLeave(item) {
    this.highlightedItem = null;
  }

  handleClearIconClick(e: MouseEvent) {
    e.stopPropagation();

    // maybe create a value reader so that dropdown can support list of ints, strings, and objects
    const defaultItem = this.defaultValue && this.items.find(i => i[this.dataKey] === this.defaultValue[this.dataKey]);

    if (defaultItem) {
      this.selectItem(defaultItem);
    } else {
      this.clearSelection();
    }

    this.closeDropdown();
  }

  clearSelection() {
    this.selectedItem = null;
    this.resetDisplayList();
    this.clearTextBox();
  }

  clearTextBox() {
    this.textbox.value = "";
  }

  resetDisplayList() {
    this.displayList = this.items;
  }

  onTabPressInOverlay(e: KeyboardEvent) {
    this.dismiss();
  }

  onEscapePressInOverlay(e: KeyboardEvent) {
    this.dismiss();
  }

  onEnterPressInOverlay(e: KeyboardEvent) {
    const item = this.highlightedItem || this.selectedItem;
    if (item) this.selectItem(item);
  }

  onKeyboardNavigation(e: KeyboardEvent) {
    const keyPressed = e.keyCode as NavigationKey;
    const item = this.highlightedItem || this.selectedItem;
    const newIndex = this.calculateNewIndex(item, keyPressed === DOWN_ARROW ? 1 : -1);
    this.highlightItem(newIndex);
    this.scrollItemIntoView(newIndex);
  }

  calculateNewIndex(currItem, offset: 1 | -1) {
    return this.displayList.indexOf(currItem) + offset;
  }

  highlightItem(index) {
    const newHightlightedItem = this.displayList[index];
    this.highlightedItem = newHightlightedItem;
  }

  scrollItemIntoView(itemIndex: number) {
    if (itemIndex < 0 || itemIndex >= this.displayList.length) return;

    const el = this.scrollViewport.elementRef.nativeElement.querySelector(
      `[data-item-id='${itemIndex}']`
    );
    el?.scrollIntoView({ block: "nearest" });
  }

  selectItem(newItem) {
    this.textbox.value = newItem[this.dataKey];
    this.selectedItem = newItem;
    this.closeDropdown();
    this.textbox.blur();
  }

  scrollToTop() {
    setTimeout(() => {
      this.scrollViewport.scrollTo({ top: 0 });
    });
  }

  closeDropdown() {
    this.isOpen = false;
    this.highlightedItem = null;
  }

  dismiss() {
    this.closeDropdown();
    this.textbox.blur();
    this.displayList = this.items;
    if (this.selectedItem) {
      this.textbox.value = this.selectedItem[this.dataKey];
    }
  }
}
