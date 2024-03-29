context('Ships', () => {

    before(() => {
        cy.login()
    })

    describe('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoShipList()
            cy.readShipRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().homeUrl + '/ships/1')
        })

        it('Ask to delete and continue', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/ships', { fixture:'ships/base/ships.json' }).as('getShips')
            cy.intercept('DELETE', Cypress.config().apiUrl + '/ships/1', { fixture:'ships/base/ship.json' }).as('deleteShip')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteShip').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().homeUrl + '/ships')
        })

        it('Goto the home page', () => {
            cy.goHome()
            cy.url().should('eq', Cypress.config().homeUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    after(() => {
        cy.logout()
    })

})