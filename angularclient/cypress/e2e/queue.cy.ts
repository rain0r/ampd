describe("Pagination of a queue with 1000 tracks", () => {
  /**
   * Tests issue #594
   */

  it("Add 1000 tracks playlist", () => {
    cy.visit("/browse");
    cy.contains("Playlists");
    cy.contains("Directories");
    cy.get('[data-cy="playlist-name"]').contains("last_1000").click();

    cy.contains("Items per page:");
    cy.contains("Playlist: last_1000");
    cy.get('[data-cy="add-playlist"]').contains("Add playlist").click();
  });

  it("Check track progress upon pagination", () => {
    cy.visit("/");
    cy.get("body").type("{s}");

    cy.paginate(20);
    cy.paginate(100);
    cy.paginate(500);

    cy.get("#btn-play").click();
    cy.wait(1000);

    cy.paginate(1000);

    cy.scrollTo("top");
    cy.wait(3000);

    cy.get('[data-cy="elapsed"]').invoke("data", "elapsed").should("be.gt", 2);
    cy.clearQueue();
  });

  it("Check remove track from queue", () => {
    cy.visit("/");

    // Go to the last page and remove the second-to-last track
    cy.get('[aria-label="Last page"]').click();

    cy.get('[data-cy="track-table"] > tbody > tr')
      .its("length")
      .as("before", { type: "static" });

    cy.get('[data-cy="track-table"] > tbody > tr')
      .last()
      .prev()
      .find(".btn-remove-track")
      .click();

    cy.wait(1000);

    cy.get("@before").then((oldLength) => {
      cy.get('[data-cy="track-table"] > tbody > tr')
        .its("length")
        .should("be.lt", oldLength);
    });
  });
});
