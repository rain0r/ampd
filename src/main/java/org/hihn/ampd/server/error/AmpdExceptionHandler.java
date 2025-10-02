package org.hihn.ampd.server.error;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class AmpdExceptionHandler {

	private static final Logger LOG = LoggerFactory.getLogger(AmpdExceptionHandler.class);

	@ExceptionHandler(ResponseStatusException.class)
	@ResponseBody
	public ResponseEntity<Object> handleResourceNotFoundException(Exception exception) {
		LOG.warn("Resource not found: {}", exception.getMessage());
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponse(exception.getMessage()));
	}

	@ExceptionHandler(Exception.class)
	@ResponseBody
	public ResponseEntity<Object> handleAllOtherErrors(Exception exception) {
		LOG.error("Uncaught exception in service layer: {}", exception.getMessage(), exception);
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponse(exception.getMessage()));
	}

}
