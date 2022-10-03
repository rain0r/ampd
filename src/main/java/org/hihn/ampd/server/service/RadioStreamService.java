package org.hihn.ampd.server.service;

import org.hihn.ampd.server.model.db.RadioStream;
import org.hihn.ampd.server.model.db.repo.RadioStreamsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service to manage radio streams.
 */
@Service
public class RadioStreamService {

	private final RadioStreamsRepository rsRepo;

	public RadioStreamService(RadioStreamsRepository rsRepo) {
		this.rsRepo = rsRepo;
	}

	public List<RadioStream> browseRadioStreams() {
		return rsRepo.findAllByOrderByNameAsc();
	}

	public List<RadioStream> addRadioStream(RadioStream radioStream) {
		rsRepo.save(radioStream);
		return rsRepo.findAllByOrderByNameAsc();
	}

	public List<RadioStream> deleteStream(int streamId) {
		rsRepo.deleteById((long) streamId);
		return rsRepo.findAllByOrderByNameAsc();
	}

}
