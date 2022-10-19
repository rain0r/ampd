import { ShortcutService } from "src/app/service/shortcut.service";

export enum Category {
  PlayerControls,
  Navigation,
  Modes,
  General,
}

export interface ShortCut {
  category: Category;
  action: (this: ShortcutService) => void;
  helpText: string;
  trigger: string[];
}
