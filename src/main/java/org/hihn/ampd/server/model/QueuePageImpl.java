package org.hihn.ampd.server.model;

import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

public class QueuePageImpl<T> extends PageImpl<T> {

	private static final long serialVersionUID = -8458526312980512803L;

	private int totalPlayTime = -1;

	public QueuePageImpl(List<T> content, Pageable pageable, long total) {
		super(content, pageable, total);
	}

	public int getTotalPlayTime() {
		return totalPlayTime;
	}

	public void setTotalPlayTime(int totalPlayTime) {
		this.totalPlayTime = totalPlayTime;
	}

	@Override
	public boolean equals(Object obj) {
		return super.equals(obj);
	}

	@Override
	public int hashCode() {
		return super.hashCode();
	}

}