import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

export interface DialogData {
  coverUrl: string;
}

@Component({
  selector: 'app-cover-modal',
  templateUrl: './cover-modal.component.html',
  styleUrls: ['./cover-modal.component.css'],
})
export class CoverModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CoverModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public ngOnInit() {}
}
