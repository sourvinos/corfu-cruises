context('Routes', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoRouteList()
            cy.readRouteRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/routes', { fixture:'routes/routes.json' }).as('getRoutes')
            cy.intercept('PUT', Cypress.config().baseUrl + '/api/routes/1', { fixture:'routes/route.json' }).as('saveRoute')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveRoute').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/routes')
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