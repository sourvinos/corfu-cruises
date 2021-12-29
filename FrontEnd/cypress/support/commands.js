import 'cypress-localstorage-commands'

Cypress.Commands.add('login', () => {
    cy.request({
        url: Cypress.config().apiUrl + '/auth/auth',
        method: 'POST',
        body: {
            username: 'john',
            password: 'ec11fc8c16da',
            grantType: 'password'
        }
    }).its('body.response').then(response => {
        cy.setLocalStorage('displayName', response.displayname)
        cy.setLocalStorage('expiration', response.expiration)
        cy.setLocalStorage('jwt', response.token)
        cy.setLocalStorage('loginStatus', '1')
        cy.setLocalStorage('refreshToken', response.refresh_token)
        cy.setLocalStorage('language', 'en-gb')
        cy.setLocalStorage('theme', 'dark')
    })
    cy.visit('https://localhost:4200')
    cy.saveLocalStorage()
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
        .should('have.attr', 'aria-invalid', 'true')
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
    cy.url().should('eq', Cypress.config().homeUrl + '/')
})

Cypress.Commands.add('clearField', (element) => {
    cy.get('[data-cy=' + element + ']').clear()
})

function createRandomLetters(length) {
    let field = ''
    for (let index = 1; index <= length; index++) {
        field += String.fromCharCode(Math.round(Math.random() * (90 - 65) + 65))
    }
    return field
}
