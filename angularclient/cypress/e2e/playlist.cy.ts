const playlists = require("../fixtures/playlists.json");

const TMP_PLAYLIST_NAME = "AAA Test Playlist 123";

function addPlaylist(name: string) {
  cy.log(`Adding playlist: ${name}`);

  cy.visit("/browse");
  cy.get('[data-cy="connecting-overlay"]').should("not.exist");

  cy.contains("Playlists");
  cy.contains("Directories");
  cy.get('[data-cy="playlist-name"]').contains(name).click();

  cy.contains("Items per page:");
  cy.contains(`Playlist: ${name}`);
  cy.get('[data-cy="add-playlist"]').contains("Add playlist").click();
}

describe("Save and delete a playlist", () => {
  it("Add artist", () => {
    cy.clearQueue();

    cy.visit("/browse");
    cy.get('[data-cy="connecting-overlay"]').should("not.exist");

    // Check, if there is at least one directory
    cy.get(".browse-list-item > [data-cy='add-dir']").should("be.visible");

    // Filter for The Beatles
    cy.get('[data-cy="filter"]').type("beatles");

    // Add The Beatles to the Queue
    cy.get(".browse-list-item > [data-cy='add-dir']").first().click();

    // Go to the queue
    cy.visit("/");
    cy.get('[data-cy="connecting-overlay"]').should("not.exist");

    // Check there is at least one track in the queue
    cy.get('[data-cy="track-table"] > tbody > tr').should(
      "have.length.greaterThan",
      1,
    );
  });

  it("Save playlist", () => {
    cy.visit("/");
    cy.get('[data-cy="connecting-overlay"]').should("not.exist");

    cy.get('[data-cy="save-playlist"]').click();
    cy.get('[data-cy="save-playlist-name"]').type(TMP_PLAYLIST_NAME);
    cy.get('[data-cy="save-playlist-btn"]').click();

    // Test saving the same playlist again
    cy.get('[data-cy="save-playlist"]').click();
    cy.get('[data-cy="save-playlist-name"]').last().type(TMP_PLAYLIST_NAME);
    cy.get('[data-cy="save-playlist-btn"]').click();
  });

  it("Add playlist", () => {
    addPlaylist(TMP_PLAYLIST_NAME);
  });

  it("Delete playlist", () => {
    cy.visit("/browse");
    cy.get('[data-cy="connecting-overlay"]').should("not.exist");

    cy.contains("Playlists");
    cy.contains("Directories");
    cy.get('[data-cy="playlist-name"]').contains(TMP_PLAYLIST_NAME).click();

    cy.contains("Items per page:");
    cy.contains(`Playlist: ${TMP_PLAYLIST_NAME}`);
    cy.get('[data-cy="delete-playlist-btn"]').click();
  });
});

describe("Add multiple playlists", () => {
  it("Add playlist", () => {
    cy.clearQueue();

    playlists.forEach((playlistName: string) => {
      addPlaylist(playlistName);
      
      cy.visit("/");
      cy.get('[data-cy="connecting-overlay"]').should("not.exist");

      cy.get('[data-cy="track-table"] > tbody > tr').should(
        "have.length.greaterThan",
        1,
      );

      const trackCount = parseInt(playlistName.replace("last_", ""));
      cy.scrollTo("bottom");
      cy.contains("tracks in the queue");

      cy.clearQueue();
    });
  });
});
