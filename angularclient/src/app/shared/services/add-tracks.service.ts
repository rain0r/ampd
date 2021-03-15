import {Injectable} from '@angular/core';
import {RxStompService} from "@stomp/ng2-stompjs";

@Injectable({
  providedIn: 'root'
})
export class AddTracksService {

  constructor(private rxStompService: RxStompService) {
  }

  addTracks(filePaths: string[]) {
    this.rxStompService.publish({
      destination: "/app/add-tracks",
      body: JSON.stringify(filePaths)
    });
  }
}
