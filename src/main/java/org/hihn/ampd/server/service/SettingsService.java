package org.hihn.ampd.server.service;

import org.hihn.ampd.server.AmpdUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    @Value("${server.port}")
    private int port;

    public String getBackendAddress() {
        return "http://" + AmpdUtils.getLocalIp() + ":" + port + "/settings?backend=" + AmpdUtils.getLocalIp() + ":"
                + port;
    }

}
