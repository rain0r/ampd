describe("Check genres", () => {
  it("Visit genres", () => {
    cy.visit("/browse-genres");
    cy.contains("Genres");
  });

  it("Click first", () => {
    cy.visit("/browse-genres");
    cy.get('[data-cy="genre"]').first().click();
  });
});
