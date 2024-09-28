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
}

function cleanQueue() {
  cy.visit("/");
  cy.get("body").type("{C}");
}

describe("Browse Test", () => {
  after("Clean up queue", () => {
    cleanQueue();
  });

  it("Add playlist and clear queue", () => {
    playlists.forEach((playlistName: string) => {
      addPlaylist(playlistName);

      cy.visit("/");
      cy.contains("tracks in the queue");
      cy.get('[data-cy="clear-queue-btn"]').click();
      cy.contains("No tracks.");
    });
  });
});

describe("Pagination Test", () => {
  /**
   * Tests issue #594
   */

  after("Clean up queue", () => {
    cleanQueue();
  });

  it("Add playlist", () => {
    addPlaylist("last_2000");
  });

  it("Check track progress upon pagination", () => {
    cy.visit("/");
    cy.get("body").type("{s}");

    paginate(10);

    cy.get("#btn-play").click();
    cy.wait(3000);

    paginate(1000);

    cy.get('[data-cy="elapsed"]').invoke("data", "elapsed").should("be.gt", 2);
    cy.get('[data-cy="clear-queue-btn"]').click();
  });
});

describe("check cover exists", () => {
  it("Add artist", () => {
    cy.visit("/browse");
    cy.get('[data-cy="filter"]').type("beatles");
    cy.get(".browse-list-item > [data-cy='add-dir']").first().click();
  });

  it("Play", () => {
    cy.visit("/");
    cy.get("body").type("{s}");
    cy.get("#btn-play").click();
  });

  it("Check cover", () => {
    cy.visit("/");
    cy.wait(1000);
    cy.get('[data-cy="cover"]').should("exist");
    cy.get("body").type("{s}");
  });
});
