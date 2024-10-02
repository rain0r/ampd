const playlists = require("../fixtures/playlists.json");

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

describe("Browse Test", () => {
  after("Clean up queue", () => {
    clearQueue();
  });

  it("Add playlists", () => {
    playlists.forEach((playlistName: string) => {
      addPlaylist(playlistName);
      cy.visit("/");
      cy.contains("tracks in the queue");
    });
  });
});

describe("Pagination 2000 tracks", () => {
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
});
