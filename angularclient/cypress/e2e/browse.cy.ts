describe("Check browse", () => {
  it("Test filter visibility", () => {
    cy.visit("/browse");
    cy.contains("Playlists");
    cy.contains("Directories");

    cy.get('[data-cy="browse-navigation"]')
      .find('[data-cy="filter-container"]')
      .should("not.have.class", "invisible");
    cy.get('[data-cy="filter"]').type("Beatles");
    cy.get(".browse-list-item").first().click();
    cy.get(".browse-list-item").first().click();
    cy.get('[data-cy="browse-navigation"]')
      .find('[data-cy="filter-container"]')
      .should("have.class", "invisible");
  });
});
