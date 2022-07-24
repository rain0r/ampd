package org.hihn.ampd.server.serializer;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * Exclude mixRampDb until this issue is resolved:
 * <a href="https://github.com/finnyb/javampd/issues/73">#73</a>
 */
public abstract class AbstractServerStatusMixIn {

	@JsonIgnore
	abstract int getMixRampDb(); // we don't need it!

}
