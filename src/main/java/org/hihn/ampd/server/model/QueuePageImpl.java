package org.hihn.ampd.server.model;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class QueuePageImpl<T> extends PageImpl {

	private int totalPlayTime = -1;

	public QueuePageImpl(List content, Pageable pageable, long total) {
		super(content, pageable, total);
	}

	public int getTotalPlayTime() {
		return totalPlayTime;
	}

	public void setTotalPlayTime(int totalPlayTime) {
		this.totalPlayTime = totalPlayTime;
	}

}