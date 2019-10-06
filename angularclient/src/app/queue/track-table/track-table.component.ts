import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {StompService} from '@stomp/ng2-stompjs';
import {Observable} from 'rxjs/index';
import {AppComponent} from '../../app.component';
import {AmpdBlockUiService} from '../../shared/block/ampd-block-ui.service';
import {IMpdTrack} from '../../shared/messages/incoming/mpd-track';
import {QueueRootImpl} from '../../shared/messages/incoming/queue';
import {QueueTrack} from '../../shared/models/queue-track';
import {MpdCommands} from '../../shared/mpd/mpd-commands';
import {WebSocketService} from '../../shared/services/web-socket.service';
import {QueueService} from "../../shared/services/queue.service";

@Component({
    selector: 'app-track-table',
    templateUrl: './track-table.component.html',
    styleUrls: ['./track-table.component.css'],
})
export class TrackTableComponent implements OnInit {
    // @Input() private queue: QueueTrack[] = [];
    private queue: QueueTrack[] = [];
    @Input() private currentSong: QueueTrack = new QueueTrack();
    private queueSubs: Observable<QueueRootImpl>;
    private displayedColumns = [
        {name: 'pos', showMobile: false},
        {name: 'artist', showMobile: true},
        {name: 'album', showMobile: false},
        {name: 'title', showMobile: true},
        {name: 'length', showMobile: false},
        {name: 'remove', showMobile: true},
    ];

    constructor(private appComponent: AppComponent,
                private stompService: StompService,
                private webSocketService: WebSocketService,
                private ampdBlockUiService: AmpdBlockUiService,
                private queueService: QueueService,
                public dialog: MatDialog) {
        this.queueSubs = this.webSocketService.getQueueSubs();
        this.buildQueueMsgReceiver();
    }

    ngOnInit() {

    }

    public onClearQueue(): void {
        this.queueService.clear();
        this.webSocketService.send(MpdCommands.RM_ALL);
    }

    public getDisplayedColumns(): string[] {
        const isMobile = this.appComponent.isMobile();
        return this.displayedColumns
            .filter(cd => !isMobile || cd.showMobile)
            .map(cd => cd.name);
    }

    public onRemoveTrack(position: number): void {
        this.webSocketService.sendData(MpdCommands.RM_TRACK, {
            position,
        });
        this.webSocketService.send(MpdCommands.GET_QUEUE);
    }

    /**
     * Play the track from the queue which has been clicked.
     *
     * @param {string} pFile
     */
    public onRowClick(pFile: string): void {
        this.webSocketService.sendData(MpdCommands.PLAY_TRACK, {path: pFile});
    }

    private buildQueue(message: IMpdTrack[]): void {
        this.queueService.clear();
        let posCounter = 1;

        for (const item of message) {
            const track: QueueTrack = new QueueTrack(item);
            track.pos = posCounter;

            if (this.currentSong.id === item.id) {
                track.playing = true;
            }

            // this.queue.push(track);
            // console.log(`Pushing ${track.title}`);
            this.queueService.addTrack(track);
            posCounter += 1;
        }
        this.queueService.resultList$
            .subscribe(resultList => console.log(resultList));
    }

    private buildQueueMsgReceiver() {
        this.queueSubs.subscribe((message: QueueRootImpl) => {
            try {
                this.buildQueue(message.payload);
            } catch (error) {
                console.error(`Error handling message:`);
                console.error(message);
            }
        });
    }
}
