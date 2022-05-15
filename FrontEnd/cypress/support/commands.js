import 'cypress-localstorage-commands'

Cypress.Commands.add('login', () => {
    cy.visit('https://localhost:4200')
    cy.buttonClick('login')
})

Cypress.Commands.add('logout', () => {
    cy.clearLocalStorage()
})

Cypress.Commands.add('typeRandomChars', (fieldName, length) => {
    cy.get('[data-cy=' + fieldName + ']')
        .clear({ force: true })
        .type(createRandomLetters(length) + '{enter}')
})

Cypress.Commands.add('typeNotRandomChars', (fieldName, fieldContent) => {
    cy.get('[data-cy=' + fieldName + ']')
        .type(fieldContent + '{enter}', { force: true })
})

Cypress.Commands.add('formShouldBeInvalid', (element) => {
    cy.get('[data-cy=' + element + ']')
        .should('have.class', 'ng-invalid')
})

Cypress.Commands.add('formShouldBeValid', (element) => {
    cy.get('[data-cy=' + element + ']')
        .should('not.have.class', 'ng-invalid')
})

Cypress.Commands.add('elementShouldBeValid', (element) => {
    cy.get('[data-cy=' + element + ']')
        .should('not.have.class', 'aria-invalid', 'false')
})

Cypress.Commands.add('elementShouldBeInvalid', (element) => {
    cy.get('[data-cy=' + element + ']')
        .should('have.class', 'ng-invalid', 'true')
})

Cypress.Commands.add('buttonShouldBeEnabled', (button) => {
    cy.get('[data-cy=' + button + ']')
        .should('not.have.attr', 'disabled')
})

Cypress.Commands.add('buttonShouldBeDisabled', (button) => {
    cy.get('[data-cy=' + button + ']')
        .should('have.attr', 'disabled')
})

Cypress.Commands.add('clickOnDeleteAndAbort', () => {
    cy.get('[data-cy=delete]').click()
    cy.get('.mat-dialog-container')
    cy.get('[data-cy=dialog-abort]').click()
})

Cypress.Commands.add('goHome', () => {
    cy.get('[data-cy=companyLogo]').click()
})

Cypress.Commands.add('goBack', () => {
    cy.get('[data-cy=home-button]').click()
})

Cypress.Commands.add('clearField', (element) => {
    cy.get('[data-cy=' + element + ']').clear()
})

Cypress.Commands.add('buttonClick', (button) => {
    cy.get('[data-cy=' + button + ']').click()
})

function createRandomLetters(length) {
    let field = ''
    for (let index = 1; index <= length; index++) {
        field += String.fromCharCode(Math.round(Math.random() * (90 - 65) + 65))
    }
    return field
}
