context('Pickup Points', () => {

    before(() => {
        cy.login()
    })

    describe('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoPickupPointList()
            cy.readPickupPointRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().baseUrl + '/pickupPoints/1')
        })

        it('Ask to delete and continue', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/pickupPoints', { fixture:'pickupPoints/pickupPoints.json' }).as('getpickupPoints')
            cy.intercept('DELETE', Cypress.config().baseUrl + '/api/pickupPoints/1', { fixture:'pickupPoints/pickupPoint.json' }).as('deletePickupPoint')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deletePickupPoint').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/pickupPoints')
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