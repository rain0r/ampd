package org.hihn.ampd.server.config;

import com.fasterxml.jackson.annotation.JsonIgnore;

public abstract class ServerStatusMixIn {

	@JsonIgnore
	abstract int getMixRampDb(); // we don't need it!

}
