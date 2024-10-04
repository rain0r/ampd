const playlists = require("../fixtures/playlists.json");

const TMP_PLAYLIST_NAME = "AAA Test Playlist 123";

function addPlaylist(name: string) {
  cy.visit("/browse");
  cy.contains("Playlists");
  cy.contains("Directories");
  cy.get('[data-cy="playlist-name"]').contains(name).click();

  cy.contains("Items per page:");
  cy.contains(`Playlist: ${name}`);
  cy.get('[data-cy="add-playlist"]').contains("Add playlist").click();
}

function paginate(pageSize: number) {
  cy.get('[data-cy="paginator"]').click();
  cy.get("mat-option").contains(pageSize).click();
  cy.get('[data-cy="track-table"] > tbody > tr').should(
    "have.length",
    pageSize,
  );
}

function clearQueue() {
  cy.visit("/");
  cy.get('[data-cy="clear-queue-btn"]').then(($btn) => {
    if ($btn.is(":disabled")) {
      // Button is disabled, clear queue via keyboard
      cy.get("body").type("{s}");
    } else {
      // Button is enabled, clear queue via button
      cy.wrap($btn).click();
    }
  });
  cy.get('[data-cy="cover"]').should("not.exist");
  cy.contains("No tracks.");
}

describe("Add playlists", () => {
  it("Add playlists", () => {
    playlists.forEach((playlistName: string) => {
      addPlaylist(playlistName);
      cy.visit("/");
      cy.contains("tracks in the queue");
      cy.get('[data-cy="track-table"] > tbody > tr').should(
        "have.length.greaterThan",
        1,
      );
      clearQueue();
    });
  });
});

describe("Pagination of a queue with 2000 tracks", () => {
  /**
   * Tests issue #594
   */

  after("Clean up queue", () => {
    clearQueue();
  });

  it("Add playlist", () => {
    addPlaylist("last_2000");
  });

  it("Check track progress upon pagination", () => {
    cy.visit("/");
    cy.get("body").type("{s}");

    paginate(10);
    paginate(100);
    paginate(500);

    cy.get("#btn-play").click();
    cy.wait(4000);

    paginate(1000);

    cy.get('[data-cy="elapsed"]').invoke("data", "elapsed").should("be.gt", 2);
    clearQueue();
  });

  describe("Save and delete a playlist", () => {
    it("Add artist", () => {
      cy.visit("/browse");
      cy.get(".browse-list-item > [data-cy='add-dir']").should("be.visible");
      cy.get('[data-cy="filter"]').type("the");
      cy.get(".browse-list-item > [data-cy='add-dir']").first().click();
    });

    it("Save playlist", () => {
      cy.visit("/");
      cy.get('[data-cy="save-playlist"]').click();
      cy.get('[data-cy="save-playlist-name"]').type(TMP_PLAYLIST_NAME);
      cy.get('[data-cy="save-playlist-btn"]').click();
      clearQueue();
    });

    it("Add playlist", () => {
      addPlaylist(TMP_PLAYLIST_NAME);
    });

    it("Delete playlist", () => {
      cy.visit("/browse");
      cy.contains("Playlists");
      cy.contains("Directories");
      cy.get('[data-cy="playlist-name"]').contains(TMP_PLAYLIST_NAME).click();

      cy.contains("Items per page:");
      cy.contains(`Playlist: ${TMP_PLAYLIST_NAME}`);
      cy.get('[data-cy="delete-playlist-btn"]').click();

      cy.get('[data-cy="playlist-name"]')
        .contains(TMP_PLAYLIST_NAME)
        .should("not.exist");
    });
  });
});
