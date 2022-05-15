import 'cypress-localstorage-commands'

Cypress.Commands.add('goHome', () => {
    cy.visit('https://localhost:4200')
})
