describe("Check cover exists", () => {
  
  it("Add artist", () => {
    cy.visit("/browse");
    cy.get(".browse-list-item > [data-cy='add-dir']").should("be.visible");
    cy.get('[data-cy="filter"]').type("Beatles");
    cy.get(".browse-list-item > [data-cy='add-dir']").first().click();
  });

  it("Play", () => {
    cy.visit("/");
    cy.get("body").type("{s}");
    cy.get("#btn-play").click();
  });

  it("Check cover", () => {
    cy.visit("/");
    cy.wait(1000);
    cy.get('[data-cy="cover"]').should("exist");
  });

  it("Clear queue", () => {
    cy.visit("/");
    cy.get('[data-cy="clear-queue-btn"]').click();
    cy.get('[data-cy="cover"]').should("not.exist");
  });
});
