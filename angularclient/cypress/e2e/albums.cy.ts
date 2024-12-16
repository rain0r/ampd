describe("Check albums", () => {
  it("Fill albums-cache", () => {
    cy.request("POST", "/api/albums/trigger-fill-albums-cache");
  });
  it("Click album", () => {
    cy.visit("/browse-albums");
    cy.get("[data-cy='album-item']").first().click();
    cy.get("[data-cy='add-all-btn']").first().click();
  });
  it("Check queue", () => {
    cy.visit("/");
    cy.contains("Items per page:");
  });
});
