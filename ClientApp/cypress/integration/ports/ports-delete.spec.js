context('Ports', () => {

    before(() => {
        cy.login()
    })

    describe('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoPortList()
            cy.readPortRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().baseUrl + '/ports/1')
        })

        it('Ask to delete and continue', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/ports', { fixture:'ports/ports.json' }).as('getPorts')
            cy.intercept('DELETE', Cypress.config().baseUrl + '/api/ports/1', { fixture:'ports/port.json' }).as('deletePort')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deletePort').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/ports')
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