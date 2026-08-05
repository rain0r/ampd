export interface Column {
  name: string;
  showMobile: boolean;
}

export const COLUMNS: Column[] = [
  { name: "position", showMobile: false },
  { name: "artistName", showMobile: true },
  { name: "albumName", showMobile: false },
  { name: "title", showMobile: true },
  { name: "add-title", showMobile: true },
  { name: "length", showMobile: false },
  { name: "play-title", showMobile: true },
  { name: "remove", showMobile: true },
];
