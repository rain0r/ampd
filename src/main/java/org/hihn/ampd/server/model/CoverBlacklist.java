package org.hihn.ampd.server.model;

import java.util.Set;

public class CoverBlacklist {
    private final String filePath;
    private final Set<String> blacklistedFiles;

    public CoverBlacklist(String filePath, Set<String> blacklistedFiles) {
        this.filePath = filePath;
        this.blacklistedFiles = blacklistedFiles;
    }

    public String getFilePath() {
        return filePath;
    }

    public Set<String> getBlacklistedFiles() {
        return blacklistedFiles;
    }
}
