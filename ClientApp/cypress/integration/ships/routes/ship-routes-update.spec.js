 context('Ship routes', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoShipRouteList()
            cy.readShipRouteRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/shipRoutes', { fixture:'ships/routes/routes.json' }).as('getShipRoutes')
            cy.intercept('PUT', Cypress.config().baseUrl + '/api/shipRoutes/1', { fixture:'ships/routes/route.json' }).as('saveShipRoute')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveShipRoute').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/shipRoutes')
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