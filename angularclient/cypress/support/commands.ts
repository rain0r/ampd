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
  cy.get("body").type("{C}");
  cy.get('[data-cy="cover"]').should("not.exist");
  cy.contains("No tracks.");
});

Cypress.Commands.add("paginate", (pageSize: number) => {
  cy.get('[data-cy="paginator"]').click();
  cy.get("mat-option").contains(pageSize).click();
  cy.get('[data-cy="track-table"] > tbody > tr').should(
    "have.length",
    pageSize,
  );
});

Cypress.Commands.add("addPlaylist", (name: string) => {
  cy.log(`Adding playlist: ${name}`);

  cy.visit("/browse");
  cy.contains("Playlists");
  cy.contains("Directories");
  cy.get('[data-cy="playlist-name"]').contains(name).click();

  cy.contains("Items per page:");
  cy.contains(`Playlist: ${name}`);
  cy.get('[data-cy="add-playlist"]').contains("Add playlist").click();
});
