context('Registrars', () => {

    before(() => {
        cy.login()
    })

    describe('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoRegistrarList()
            cy.readRegistrarRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().baseUrl + '/shipRegistrars/1')
        })

        it('Ask to delete and continue', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/registrars', { fixture:'ships/registrars/registrars.json' }).as('getRegistrars')
            cy.intercept('DELETE', Cypress.config().baseUrl + '/api/registrars/1', { fixture:'ships/registrars/registrar.json' }).as('deleteRegistrar')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteRegistrar').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/shipRegistrars')
        })

        it('Goto the home page', () => {
            cy.goHome()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    after(() => {
        cy.logout()
    })

})