context('Destinations', () => {

    before(() => {
        cy.login()
    })

    describe('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoDestinationList()
            cy.readDestinationRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().baseUrl + '/destinations/2')
        })

        it('Ask to delete and continue', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/destinations', { fixture:'destinations/destinations.json' }).as('getDestinations')
            cy.intercept('DELETE', Cypress.config().baseUrl + '/api/destinations/2', { fixture:'destinations/destination.json' }).as('deleteDestination')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteDestination').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/destinations')
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