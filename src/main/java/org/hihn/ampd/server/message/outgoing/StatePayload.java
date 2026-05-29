package org.hihn.ampd.server.message.outgoing;

import org.bff.javampd.server.ServerStatus;
import org.bff.javampd.song.MPDSong;
import org.hihn.ampd.server.message.incoming.MpdModesPanelMsg;

/**
 * Represents the structure of a state returned to the frontend.
 *
 * @param serverStatus ServerStatus provided by MPD.
 * @param currentTrack The currently played track.
 * @param mpdModesPanelMsg Representation of the current state of the MPD modes.
 */
public record StatePayload(MpdModesPanelMsg mpdModesPanelMsg, MPDSong currentTrack, ServerStatus serverStatus) {
}
