const playlists = require("../fixtures/playlists.json");

const TMP_PLAYLIST_NAME = "AAA Test Playlist 123";

describe("Add multiple playlists", () => {
  it("Add playlist", () => {
    cy.clearQueue();

    playlists.forEach((playlistName: string) => {
      cy.addPlaylist(playlistName);
      cy.visit("/");

      cy.get('[data-cy="track-table"] > tbody > tr').should(
        "have.length.greaterThan",
        1,
      );

      const trackCount = parseInt(playlistName.replace("last_", ""));
      cy.scrollTo("bottom");
      cy.get('[data-cy="queue-track-count"]').contains(trackCount);
      cy.contains("tracks in the queue");

      cy.clearQueue();
    });
  });
});
