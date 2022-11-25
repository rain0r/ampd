package org.hihn.ampd.server.util.error;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class JsonExceptionHandler {

	private static final Logger LOG = LoggerFactory.getLogger(JsonExceptionHandler.class);

	@ExceptionHandler(Exception.class)
	@ResponseBody
	public ResponseEntity<Object> handleAllOtherErrors(Exception exception) {

		if (!(exception instanceof ResponseStatusException
				&& ((ResponseStatusException) exception).getStatus().equals(HttpStatus.NOT_FOUND))) {
			// Don't log 404 errors
			LOG.error(exception.getMessage(), exception);
		}

		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).contentType(MediaType.APPLICATION_JSON)
				.body(new ErrorResponse(exception.getMessage()));
	}

}
