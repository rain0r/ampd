import { MatTableDataSource } from "@angular/material/table";
import { QueueTrack } from "../model/queue-track";
import { ClickActions } from "./click-actions.enum";

/**
 * When including the track table in a view, some parameters are needed. Too much, to insert them
 * from the template.
 */
export class TrackTableOptions {
  /**
   * If true, the table as an 'add title' column.
   */
  private _addTitleColumn = true;

  /**
   * If true, the rows of the table are clickable and a click adds the track to the queue.
   */
  private _clickable = true;

  /**
   * The tracks that will be displayed in the track table.
   */
  private _dataSource = new MatTableDataSource<QueueTrack>();

  /**
   *  Reordering tracks via drag & drop
   * */
  private _dragEnabled = false;

  /**
   * Which columns this track table will have.
   */
  private _displayedColumns: string[] = [];

  /**
   * If true, a notification will be shown after a click action.
   */
  private _notify = true;

  /**
   * The action that will be triggered on a row click.
   */
  private _onRowClick = ClickActions.AddTrack;

  /**
   * If true, the table has pagination elements.
   */
  private _pagination = false;

  /**
   * If pagination is enabled, this is the default page size.
   */

  private _pageSize = 100;

  /**
   * The action that will be triggered on a click on the play button.
   */
  private _onPlayClick = ClickActions.PlayTrack;

  /**
   * If true, the table as a 'play title' colum.
   */
  private _playTitleColumn = true;

  /**
   * * If true, the columns of the table are orderable.
   */
  private _sortable = true;

  private _pageSizeOptions = [10, 20, 50, 100];

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

  get dataSource(): MatTableDataSource<QueueTrack> {
    return this._dataSource;
  }

  set dataSource(value: MatTableDataSource<QueueTrack>) {
    this._dataSource = value;
  }

  get displayedColumns(): string[] {
    return this._displayedColumns;
  }

  set displayedColumns(value: string[]) {
    this._displayedColumns = value;
  }

  get dragEnabled(): boolean {
    return this._dragEnabled;
  }

  set dragEnabled(value: boolean) {
    this._dragEnabled = value;
  }

  get notify(): boolean {
    return this._notify;
  }

  set notify(value: boolean) {
    this._notify = value;
  }

  get onRowClick(): ClickActions {
    return this._onRowClick;
  }

  set onRowClick(value: ClickActions) {
    this._onRowClick = value;
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

  get onPlayClick(): ClickActions {
    return this._onPlayClick;
  }

  set onPlayClick(value: ClickActions) {
    this._onPlayClick = value;
  }

  get pageSize(): number {
    return this._pageSize;
  }

  set pageSize(v: number) {
    this._pageSize = v;
  }

  public get pageSizeOptions(): Array<number> {
    return this._pageSizeOptions;
  }

  public set pageSizeOptions(value: Array<number>) {
    this._pageSizeOptions = value;
  }
}
