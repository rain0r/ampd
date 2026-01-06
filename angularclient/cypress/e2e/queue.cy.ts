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
    cy.wait(3000);

    cy.paginate(1000);

    cy.wait(3000);
    cy.get('[data-cy="elapsed"]').invoke("data", "elapsed").should("be.gt", 2);
    cy.clearQueue();
  });
});
