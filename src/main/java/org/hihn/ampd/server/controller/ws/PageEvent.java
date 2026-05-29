package org.hihn.ampd.server.controller.ws;

import org.springframework.data.domain.Pageable;

import static org.hihn.ampd.server.util.Constants.DEFAULT_PAGE_SIZE_REQ_PARAM;

/**
 * {@link Pageable}-like object for Websocket-Endpoints.
 *
 * @param pageIndex
 * @param pageSize
 */
public record PageEvent(int pageIndex, int pageSize) {
	public PageEvent(int pageIndex, int pageSize) {
		this.pageIndex = Math.max(pageIndex, 0);
		this.pageSize = (pageSize < 20) ? Integer.parseInt(DEFAULT_PAGE_SIZE_REQ_PARAM) : pageSize;
	}
}
