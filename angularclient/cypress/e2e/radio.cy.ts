const radioStreams = require("../fixtures/radio-streams.json");

interface RadioStream {
  name: string;
  url: string;
}

describe("Radio Test", () => {
  it("Add radio stations", () => {
    radioStreams.forEach((stream: RadioStream) => {
      cy.visit("/browse-radio-streams");
      cy.get("#name").type(stream.name);
      cy.get("#url").type(stream.url);
      cy.get("#save").click();
    });
  });

  it("Delete radio stations", () => {
    radioStreams.forEach((stream: RadioStream) => {
      cy.visit("/browse-radio-streams");
      cy.get("[data-cy='radio-streams-table']")
        .get("td")
        .contains(stream.name)
        .parent()
        .parent("tr")
        .within(() => {
          cy.get("td").eq(1).contains(stream.url);
          cy.get("td").eq(2).click();
        });
      cy.get('[data-cy="radio-stream-delete-btn"]').click();
      cy.get('[data-cy="radio-stream-delete-btn"]').should("not.exist");
    });
  });

  it("Should not find deleted radio stations", () => {
    radioStreams.forEach((stream: RadioStream) => {
      cy.visit("/browse-radio-streams");

      cy.get("[data-cy='radio-streams-table']").then(($tbody) => {
        const rows = $tbody.find("tr");
        if (rows.length) {
          cy.get("td").contains(stream.name).should("not.exist");
        }
      });
    });
  });
});
