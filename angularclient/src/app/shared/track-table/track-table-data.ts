import { MatTableDataSource } from "@angular/material/table";
import { MpdTrack } from "../messages/incoming/mpd-track";
import { RowClickActions } from "./row-click-actions.enum";

/**
 * When including the track table in a view, some parameters are needed. Too much, to insert them
 * from the template.
 */
export class TrackTableData {
  /**
   * If true, the table as an 'add title' colum.
   */
  private _addTitleColumn = false;

  /**
   * If true, the rows of the table are clickable and a click adds the track to the queue.
   */
  private _clickable = false;

  /**
   * The tracks that will be displayed in the track table.
   */
  private _dataSource = new MatTableDataSource<MpdTrack>();

  /**
   * Which columns this track table will have.
   */
  private _displayedColumns: string[] = [];

  /**
   * If true, a notification will be shown after a click action.
   */
  private _notify = false;

  /**
   * The action that will be triggered on a row click.
   */
  private _onRowClick = RowClickActions.AddTrack;

  /**
   * The action that will be triggered on a row double click.
   */
  private _onRowDoubleClick = RowClickActions.PlayTrack;

  /**
   * If true, the table has pagination elements.
   */
  private _pagination = false;

  /**
   * If true, the table as a 'play title' colum.
   */
  private _playTitleColumn = false;

  /**
   * * If true, the columns of the table are orderable.
   */
  private _sortable = false;

  get addTitleColumn(): boolean {
    return this._addTitleColumn;
  }

  set addTitleColumn(value: boolean) {
    this._addTitleColumn = value;
  }

  get clickable(): boolean {
    return this._clickable;
  }

  set clickable(value: boolean) {
    this._clickable = value;
  }

  get dataSource(): MatTableDataSource<MpdTrack> {
    return this._dataSource;
  }

  set dataSource(value: MatTableDataSource<MpdTrack>) {
    this._dataSource = value;
  }

  get displayedColumns(): string[] {
    return this._displayedColumns;
  }

  set displayedColumns(value: string[]) {
    this._displayedColumns = value;
  }

  get notify(): boolean {
    return this._notify;
  }

  set notify(value: boolean) {
    this._notify = value;
  }

  get onRowClick(): RowClickActions {
    return this._onRowClick;
  }

  set onRowClick(value: RowClickActions) {
    this._onRowClick = value;
  }

  get onRowDoubleClick(): RowClickActions {
    return this._onRowDoubleClick;
  }

  set onRowDoubleClick(value: RowClickActions) {
    this._onRowDoubleClick = value;
  }

  get pagination(): boolean {
    return this._pagination;
  }

  set pagination(value: boolean) {
    this._pagination = value;
  }

  get playTitleColumn(): boolean {
    return this._playTitleColumn;
  }

  set playTitleColumn(value: boolean) {
    this._playTitleColumn = value;
  }

  get sortable(): boolean {
    return this._sortable;
  }

  set sortable(value: boolean) {
    this._sortable = value;
  }
}
