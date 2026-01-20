// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
declare namespace Cypress {
  interface Chainable<Subject = any> {
    customCommand(param: any): typeof customCommand;
  }
}

function customCommand(param: any): void {
  console.warn(param);
}
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("clearQueue", () => {
  cy.visit("/");
  cy.get('[data-cy="connecting-overlay"]').should("not.exist");
  cy.get("body").type("{C}");
  cy.get('[data-cy="cover"]').should("not.exist");
  cy.contains("No tracks.");
});

Cypress.Commands.add("paginate", (pageSize: number) => {
  cy.get('[data-cy="paginator"]').click();
  cy.get("mat-option").contains(pageSize).click();
  cy.wait(1000);
  cy.get('[data-cy="track-table"] > tbody > tr').should(
    "have.length.greaterThan",
    pageSize - 100, // MPD doesn't find some tracks in the test environment so give it a little bit of leeway
  );
});
