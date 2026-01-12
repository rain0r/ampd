describe("Check albums", () => {
  it("Click album", () => {
    cy.visit("/browse-albums");
    cy.get("[data-cy='album-item']").first().click();
    cy.get("[data-cy='add-all-btn']").first().click();
  });
  it("Check queue", () => {
    cy.visit("/");
    cy.contains("Items per page:");
    cy.clearQueue();
  });
});
