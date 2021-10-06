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
            cy.intercept('GET', Cypress.config().apiUrl + '/destinations', { fixture:'destinations/destinations.json' }).as('getDestinations')
            cy.intercept('PUT', Cypress.config().apiUrl + '/destinations/2', { fixture:'destinations/destination.json' }).as('saveDestination')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveDestination').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().homeUrl + '/destinations')
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