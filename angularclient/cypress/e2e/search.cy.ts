describe("Search Test", () => {
  it("Search", () => {
    cy.visit("/search");

    // Should be empty at the beginning
    cy.get('[data-cy="track-table"] > tbody > tr').should("have.length", 1);
    cy.get('[data-cy="search-term"]').type("Beatles");
    cy.get('[aria-label="Next page"]').click();
    cy.get('[data-cy="track-table"] > tbody > tr').should(
      "have.length.greaterThan",
      1,
    );
  });

  it("Advanced Search", () => {
    cy.visit("/adv-search");

    // Should be empty at the beginning
    cy.get('[data-cy="track-table"] > tbody > tr').should("have.length", 1);
    cy.get('[data-cy="input-field-artist"]').type("Beatles");
    cy.get("[data-cy='search-btn']").click();
    cy.get('[data-cy="track-table"] > tbody > tr').should(
      "have.length.greaterThan",
      1,
    );
  });
});
