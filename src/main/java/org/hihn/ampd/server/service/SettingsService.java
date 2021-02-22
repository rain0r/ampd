package org.hihn.ampd.server.service;

import org.hihn.ampd.server.AmpdUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    @Value("${server.port}")
    private int port;

    public String getBackendAddress() {
        String backendAddress = "http://" + AmpdUtils.getLocalIp();
        if (port != 80 && port != 443) {
            backendAddress += ":" + port;
        }
        return backendAddress;
    }

    public String getWebSocketAddress() {
        String backendAddress = "ws://" + AmpdUtils.getLocalIp();
        if (port != 80 && port != 443) {
            backendAddress += ":" + port;
        }
        return backendAddress;
    }
}
