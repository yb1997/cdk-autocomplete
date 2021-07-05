import { trigger, transition, style, animate } from "@angular/animations";

export const DropdownAnimation = trigger("dropdownAnim", [
  transition(":enter", [
    style({ position: "relative", transform: "scale(0.97)", opacity: 0 }),
    animate("{{duration}} ease-in", style({ transform: "scale(1)", opacity: 1 }))
  ]),
  transition(":leave", [
    style({ position: "relative" }),
    animate("{{duration}} ease-out", style({  opacity: 0 }))
  ])
]);
