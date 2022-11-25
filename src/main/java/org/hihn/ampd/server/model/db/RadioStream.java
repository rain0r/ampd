package org.hihn.ampd.server.model.db;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
public class RadioStream {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id")
	private Long streamId;

	@NotBlank(message = "Url is mandatory")
	private String url;

	@NotBlank(message = "Name is mandatory")
	private String name;

	public RadioStream() {
	}

	public RadioStream(String url, String name) {
		this.url = url;
		this.name = name;
	}

	public Long getStreamId() {
		return streamId;
	}

	public void setStreamId(Long streamId) {
		this.streamId = streamId;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
