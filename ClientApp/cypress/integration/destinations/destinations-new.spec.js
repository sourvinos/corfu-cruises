context('Destinations', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoDestinationList()
            cy.gotoEmptyDestinationForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeRandomChars('abbreviation', 2).elementShouldBeValid('abbreviation')
            cy.typeRandomChars('description', 12).elementShouldBeValid('description')
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/destinations', { fixture: 'destinations/destinations.json' }).as('getDestinations')
            cy.intercept('POST', Cypress.config().baseUrl + '/api/destinations', { fixture: 'destinations/destination.json' }).as('saveDestination')
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