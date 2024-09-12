const playlists = require("../fixtures/playlists.json");
const radioStreams = require("../fixtures/radio-streams.json");

interface RadioStream {
  name: string;
  url: string;
}

function addPlaylist(name: string) {
  cy.visit("/browse");
  cy.contains("Playlists");
  cy.contains("Directories");
  cy.get('[data-cy="playlist-name"]').contains(name).click();

  cy.contains("Items per page:")  
  cy.contains(`Playlist: ${name}`);
  cy.get('[data-cy="add-playlist"]').contains("Add playlist").click();
}

function paginate(pageSize: number) {
  cy.get('[data-cy="paginator"]').click();
  cy.get("mat-option").contains(pageSize).click();
}

describe("Browse Test", () => {
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

describe("Radio Test", () => {
  it("Add radio stations", () => {
    radioStreams.forEach((stream: RadioStream) => {
      cy.visit("/browse/radio-streams");
      cy.get("#name").type(stream.name);
      cy.get("#url").type(stream.url);
      cy.get("#save").click();
    });
  });

  it("Delete radio stations", () => {
    radioStreams.forEach((stream: RadioStream) => {
      cy.visit("/browse/radio-streams");
      cy.get("td")
        .contains(stream.name)
        .parent("tr")
        .within(() => {
          cy.get("td").eq(1).contains(stream.url);
          cy.get("td").eq(2).click();
        });
      cy.get('[data-cy="radio-stream-delete-btn"]').click();
    });
  });
});

describe("Pagination Test", () => {
  /**
   * Tests issue #594
   */

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
  });
});
