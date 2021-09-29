context('Drivers', () => {

    before(() => {
        cy.login()
    })

    describe('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoDriverList()
            cy.readDriverRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().baseUrl + '/drivers/1')
        })

        it('Ask to delete and continue', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/drivers', { fixture:'drivers/drivers.json' }).as('getDrivers')
            cy.intercept('DELETE', Cypress.config().baseUrl + '/api/drivers/1', { fixture:'drivers/driver.json' }).as('deleteDriver')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteDriver').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/drivers')
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