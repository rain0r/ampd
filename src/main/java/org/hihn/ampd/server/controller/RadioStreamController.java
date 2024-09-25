package org.hihn.ampd.server.controller;

import jakarta.validation.Valid;
import org.hihn.ampd.server.model.db.RadioStream;
import org.hihn.ampd.server.service.RadioStreamService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Endpoint to manage radio streams.
 */
@RestController
@RequestMapping("/api/radio-streams")
public class RadioStreamController {

	private final RadioStreamService radioStreamService;

	public RadioStreamController(RadioStreamService radioStreamService) {
		this.radioStreamService = radioStreamService;
	}

	@GetMapping("")
	public List<RadioStream> browseRadioStreams() {
		return radioStreamService.browseRadioStreams();
	}

	@PostMapping("")
	public List<RadioStream> addRadioStream(@Valid @RequestBody RadioStream radioStream) {
		return radioStreamService.addRadioStream(radioStream);
	}

	@DeleteMapping(value = "/{id}")
	@ResponseStatus(HttpStatus.OK)
	public List<RadioStream> delete(@PathVariable("id") int streamId) {
		return radioStreamService.deleteStream(streamId);
	}

	@PostMapping("/import")
	public ResponseEntity<String> handleFileUpload(@RequestParam("radio-stations") MultipartFile file) {
		if (radioStreamService.importRadioStations(file)) {
			return ResponseEntity.ok().build();
		}
		return ResponseEntity.badRequest().build();
	}

}
