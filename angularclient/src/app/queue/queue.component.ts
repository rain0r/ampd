import {Component, HostListener, OnInit} from '@angular/core';

import {MatDialog} from '@angular/material';
import {Observable} from 'rxjs';
import {AmpdBlockUiService} from '../shared/block/ampd-block-ui.service';
import {ControlPanelImpl, IControlPanel,} from '../shared/messages/incoming/control-panel';
import {ServerStatusRootImpl} from '../shared/messages/incoming/state-messages';
import {StateMsgPayload} from '../shared/messages/incoming/state-msg-payload';
import {QueueTrack} from '../shared/models/queue-track';
import {MpdCommands} from '../shared/mpd/mpd-commands';
import {WebSocketService} from '../shared/services/web-socket.service';
import {HttpClient} from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';

@Component({
    selector: 'app-queue',
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.css'],
})
export class QueueComponent implements OnInit {
    private controlPanel: IControlPanel = new ControlPanelImpl();
    private currentSong: QueueTrack = new QueueTrack();
    private volume: number = 0;
    private stateSubs: Observable<ServerStatusRootImpl>;
    private currentState: string = '';

    constructor(private webSocketService: WebSocketService,
                private ampdBlockUiService: AmpdBlockUiService,
                private http: HttpClient,
                public dialog: MatDialog) {
        this.ampdBlockUiService.start();

        this.stateSubs = this.webSocketService.getStateSubs();
        this.buildStateReceiver();
        this.webSocketService.send(MpdCommands.GET_QUEUE);
    }

    @HostListener('document:visibilitychange', ['$event'])
    public onKeyUp(ev: KeyboardEvent) {
        if (document.visibilityState === 'visible') {
            this.webSocketService.send(MpdCommands.GET_QUEUE);
        }
    }

    public getFormattedElapsedTime(elapsedTime: number): string {
        if (isNaN(this.currentSong.length)) {
            return '';
        }
        const elapsedMinutes = Math.floor(elapsedTime / 60);
        const elapsedSeconds = elapsedTime - elapsedMinutes * 60;
        return (
            elapsedMinutes + ':' + (elapsedSeconds < 10 ? '0' : '') + elapsedSeconds
        );
    }

    public ngOnInit() {
        this.webSocketService.send(MpdCommands.GET_QUEUE);
    }

    private buildState(pMessage: StateMsgPayload): void {
        let callBuildQueue = false;
        this.ampdBlockUiService.stop();

        /* Call buildQueue once if there is no current track set */
        if ('id' in this.currentSong === false) {
            callBuildQueue = true;
        }

        const serverStatus = pMessage.serverStatus;
        this.currentSong = new QueueTrack(pMessage.currentSong);
        this.controlPanel = pMessage.controlPanel;
        sessionStorage.setItem('currentSong', JSON.stringify(this.currentSong));
        this.currentSong.elapsedFormatted = this.getFormattedElapsedTime(
            serverStatus.elapsedTime
        );
        this.currentSong.progress = serverStatus.elapsedTime;
        this.currentState = serverStatus.state;
        this.volume = serverStatus.volume;

        this.buildCoverUrl();

        if (callBuildQueue) {
            this.webSocketService.send(MpdCommands.GET_QUEUE);
        }
    }

    private buildStateReceiver() {
        this.stateSubs.subscribe((message: ServerStatusRootImpl) => {
            try {
                this.buildState(message.payload);
            } catch (error) {
                console.error(`Error handling message:`, message);
            }
        });
    }

    private buildCoverUrl() {
        this.http.get(this.currentSong.coverUrl())
            .pipe(
                catchError( error => {
                    if ( !(error.error instanceof ErrorEvent)) {
                        // The backend returned an unsuccessful response code.
                        // The response body may contain clues as to what went wrong,
                        if (error.status === 404) {
                            return of(true);
                        }
                        console.error(
                            `Backend returned code ${error.status}, ` +
                            `body was: ${error.error}`);
                    }
                    return of(false);
                }),
                map(rule => rule ? true : false)
            );
    }
}
