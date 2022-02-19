import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoLoginForm', () => {
    cy.visit('https://localhost:4200')
})
