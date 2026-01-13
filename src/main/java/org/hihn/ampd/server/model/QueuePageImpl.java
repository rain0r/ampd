package org.hihn.ampd.server.model;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class QueuePageImpl<MPDPlaylistSong> extends PageImpl<MPDPlaylistSong> {

	private final int totalPlayTime;

	public QueuePageImpl(List<MPDPlaylistSong> content, Pageable pageable, long total, int totalPlayTime) {
		super(content, pageable, total);
		this.totalPlayTime = totalPlayTime;
	}

	public int getTotalPlayTime() {
		return totalPlayTime;
	}

}