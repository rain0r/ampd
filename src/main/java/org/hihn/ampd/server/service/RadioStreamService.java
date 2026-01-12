package org.hihn.ampd.server.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.hihn.ampd.server.model.db.RadioStream;
import org.hihn.ampd.server.model.db.repo.RadioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service to manage radio streams.
 */
@Service
public class RadioStreamService {

	private static final Logger LOG = LoggerFactory.getLogger(RadioStreamService.class);

	private final RadioRepository rsRepo;

	public RadioStreamService(final RadioRepository rsRepo) {
		this.rsRepo = rsRepo;
	}

	public List<RadioStream> browseRadioStreams() {
		return rsRepo.findAllByOrderByNameAsc();
	}

	public List<RadioStream> addRadioStream(final RadioStream radioStream) {
		radioStream.setUrl(radioStream.getUrl().trim());
		rsRepo.save(radioStream);
		return rsRepo.findAllByOrderByNameAsc();
	}

	public List<RadioStream> deleteStream(final int streamId) {
		rsRepo.deleteById((long) streamId);
		return rsRepo.findAllByOrderByNameAsc();
	}

	public boolean importRadioStations(final MultipartFile file) {
		boolean ret = true;
		ObjectMapper objectMapper = new ObjectMapper();

		try (BufferedReader a = new BufferedReader(
				new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
			String result = a.lines().collect(Collectors.joining("\n"));
			RadioStream[] importedStreams = objectMapper.readValue(result, RadioStream[].class);
			for (RadioStream rs : importedStreams) {
				rs.setStreamId(null);
				addRadioStream(rs);
			}
		}
		catch (IOException e) {
			LOG.error("Error importing radio stations", e);
			ret = false;
		}

		return ret;
	}

}