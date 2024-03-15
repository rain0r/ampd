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
public class RadioService {

	private static final Logger LOG = LoggerFactory.getLogger(RadioService.class);

	private final RadioRepository rsRepo;

	public RadioService(RadioRepository rsRepo) {
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

	public boolean importRadioStations(MultipartFile file) {
		boolean ret = true;
		ObjectMapper objectMapper = new ObjectMapper();

		try (BufferedReader a = new BufferedReader(
				new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
			String result = a.lines().collect(Collectors.joining("\n"));
			ImportJsonFile savedStreams = objectMapper.readValue(result, ImportJsonFile.class);
			savedStreams.getStreams().forEach(this::addRadioStream);
		}
		catch (IOException e) {
			ret = false;
		}

		return ret;
	}

	public static class ImportJsonFile {

		private List<RadioStream> streams;

		public ImportJsonFile() {
		}

		public ImportJsonFile(List<RadioStream> streams) {
			this.streams = streams;
		}

		public List<RadioStream> getStreams() {
			return List.copyOf(streams);
		}

		public void setStreams(List<RadioStream> streams) {
			this.streams = streams;
		}

	}

}
