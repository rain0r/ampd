describe("Check cover exists", () => {
    it("Add artist", () => {
      cy.visit("/browse");
      cy.get('[data-cy="filter"]').type("beatles");
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
      cy.get("body").type("{s}");
    });
  });
  