context('Destinations', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoDestinationList()
            cy.readDestinationRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/destinations', { fixture:'destinations/destinations.json' }).as('getDestinations')
            cy.intercept('PUT', Cypress.config().baseUrl + '/api/destinations/2', { fixture:'destinations/destination.json' }).as('saveDestination')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveDestination').its('response.statusCode').should('eq', 200)
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