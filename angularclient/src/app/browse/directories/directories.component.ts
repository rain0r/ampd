import {Component, HostListener, Input} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Directory} from '../../shared/messages/incoming/directory';
import {BrowseService} from '../../shared/services/browse.service';

@Component({
  selector: 'app-directories',
  templateUrl: './directories.component.html',
  styleUrls: ['./directories.component.css'],
})
export class DirectoriesComponent {
  @Input() public dirQueue: Directory[] = [];
  public getParamDir = '/';

  constructor(private browseService: BrowseService,
              private activatedRoute: ActivatedRoute,
              private router: Router,) {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if ('dir' in params) {
        this.getParamDir = params.dir;
      }
    });
  }

  @HostListener('click', ['$event'])
  public onDirClick(directory: string): void {
    if (event) {
      event.stopPropagation();
    }

    console.log(`Clicked on ${directory}`);

    this.browseService.sendBrowseReq(directory);
    const splittedPath: string = this.splitDir(directory);
    const targetDir: string = this.getParamDir
        ? this.getParamDir + '/' + splittedPath
        : splittedPath;
    this.router.navigate(['browse'], {queryParams: {dir: directory}});
  }

  /**
   * Returns the last element of a path.
   * @param {string} dir
   * @returns {string}
   */
  public splitDir(dir: string): string {
    const splitted: string =
        dir
        .trim()
        .split('/')
        .pop() || '';
    return splitted;
  }
}
