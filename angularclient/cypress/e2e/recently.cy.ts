describe("Check Recently listened albums", () => {
  it("Test albums displayed", () => {
    cy.visit("/browse-recently-listened");
    cy.contains("Recently listened albums");
    cy.contains("Information loaded from listenbrainz.org");
    cy.contains("Items per page:");

    cy.get("body")
      .find('[data-cy="album-item"]', { timeout: 60000 })
      .should(($div) => {
        if ($div.length !== 12) {
          throw new Error("Did not find 12 album covers");
        }
      });
  });
});
