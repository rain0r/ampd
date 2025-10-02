const playlists = require("../fixtures/playlists.json");

const TMP_PLAYLIST_NAME = "AAA Test Playlist 123";

describe("Save and delete a playlist", () => {
  it("Add artist", () => {
    cy.clearQueue();

    cy.visit("/browse");
    cy.get(".browse-list-item > [data-cy='add-dir']").should("be.visible");
    cy.get('[data-cy="filter"]').type("the");
    cy.get(".browse-list-item > [data-cy='add-dir']").first().click();

    cy.visit("/");

    cy.get('[data-cy="track-table"] > tbody > tr').should(
      "have.length.greaterThan",
      1,
    );
  });

  it("Save playlist", () => {
    cy.visit("/");

    cy.get('[data-cy="save-playlist"]').click();
    cy.get('[data-cy="save-playlist-name"]').type(TMP_PLAYLIST_NAME);
    cy.get('[data-cy="save-playlist-btn"]').click();

    // Test saving the same playlist again
    cy.get('[data-cy="save-playlist"]').click();
    cy.get('[data-cy="save-playlist-name"]').last().type(TMP_PLAYLIST_NAME);
    cy.get('[data-cy="save-playlist-btn"]').click();

    cy.clearQueue();
  });

  it("Add playlist", () => {
    cy.addPlaylist(TMP_PLAYLIST_NAME);
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
