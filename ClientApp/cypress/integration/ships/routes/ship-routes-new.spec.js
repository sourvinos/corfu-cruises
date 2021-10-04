context('Ship routes', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoShipRouteList()
            cy.gotoEmptyShipRouteForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeNotRandomChars('description', 'paxos').elementShouldBeValid('description')
            cy.typeRandomChars('fromPort', 10).elementShouldBeValid('fromPort')
            cy.typeNotRandomChars('fromTime', '08:00').elementShouldBeValid('fromTime')
            cy.typeRandomChars('viaPort', 10).elementShouldBeValid('viaPort')
            cy.typeNotRandomChars('viaTime', '09:00').elementShouldBeValid('viaTime')
            cy.typeRandomChars('toPort', 10).elementShouldBeValid('toPort')
            cy.typeNotRandomChars('toTime', '10:30').elementShouldBeValid('toTime')
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/shipRoutes', { fixture:'ships/routes/routes.json' }).as('getShipRoutes')
            cy.intercept('POST', Cypress.config().baseUrl + '/api/shipRoutes', { fixture:'ships/routes/route.json' }).as('saveShipRoute')
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