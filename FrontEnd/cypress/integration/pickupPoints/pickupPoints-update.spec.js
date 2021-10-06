context('Pickup points', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoPickupPointList()
            cy.readPickupPointRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/pickupPoints', { fixture:'pickupPoints/pickupPoints.json' }).as('getPickupPoints')
            cy.intercept('PUT', Cypress.config().apiUrl + '/pickupPoints/51', { fixture:'pickupPoints/pickupPoint.json' }).as('savePickupPoint')
            cy.get('[data-cy=save]').click()
            cy.wait('@savePickupPoint').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().homeUrl + '/pickupPoints')
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