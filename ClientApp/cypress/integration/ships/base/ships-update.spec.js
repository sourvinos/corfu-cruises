context('Ships', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoShipList()
            cy.readShipRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/ships', { fixture:'ships/base/ships.json' }).as('getShips')
            cy.intercept('PUT', Cypress.config().baseUrl + '/api/ships/1', { fixture:'ships/base/ship.json' }).as('saveShip')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveShip').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/ships')
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