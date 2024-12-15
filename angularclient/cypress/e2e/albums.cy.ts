describe("Check albums", () => {

  it("Check per page", () => {
    cy.visit("/browse-albums");
    cy.contains("Items per page:");
  });

});
