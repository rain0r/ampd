package org.hihn.ampd.server.message.incoming;

/**
 * Message that contains the old and the new position of a track in the queue when mvoed
 * around.
 */
public class MoveTrackMsg {

	private int oldPos;

	private int newPos;

	public MoveTrackMsg() {
	}

	public int getOldPos() {
		return oldPos;
	}

	public void setOldPos(int oldPos) {
		this.oldPos = oldPos;
	}

	public int getNewPos() {
		return newPos;
	}

	public void setNewPos(int newPos) {
		this.newPos = newPos;
	}

}
