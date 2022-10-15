package org.hihn.ampd.server.controller;

import org.hihn.ampd.server.model.db.RadioStream;
import org.hihn.ampd.server.service.RadioService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * Endpoint to manage radio streams.
 */
@RestController
@RequestMapping("/api/radio-streams")
public class RadioStreamController {

	private final RadioService radioService;

	public RadioStreamController(RadioService radioService) {
		this.radioService = radioService;
	}

	@GetMapping("")
	public List<RadioStream> browseRadioStreams() {
		return radioService.browseRadioStreams();
	}

	@PostMapping("")
	public List<RadioStream> addRadioStream(@Valid @RequestBody RadioStream radioStream) {
		return radioService.addRadioStream(radioStream);
	}

	@DeleteMapping(value = "/{id}")
	@ResponseStatus(HttpStatus.OK)
	public List<RadioStream> delete(@PathVariable("id") int streamId) {
		return radioService.deleteStream(streamId);
	}

}
