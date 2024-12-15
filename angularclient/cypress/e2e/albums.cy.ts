describe("Check albums", () => {
  it("Check per page", () => {
    cy.visit("/browse-albums");
    cy.contains("Items per page:");
    cy.get("data-cy='album-cover'").first().click();
  });
});
