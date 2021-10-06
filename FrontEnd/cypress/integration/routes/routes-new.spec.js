context('Routes', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoRouteList()
            cy.gotoEmptyRouteForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeRandomChars('abbreviation', 5).elementShouldBeValid('abbreviation')
            cy.typeRandomChars('description', 12).elementShouldBeValid('description')
            cy.typeNotRandomChars('port-description', 'corfu').elementShouldBeValid('port-description')
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/routes', { fixture:'routes/routes.json' }).as('getRoutes')
            cy.intercept('POST', Cypress.config().apiUrl + '/routes', { fixture:'routes/route.json' }).as('saveRoute')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveRoute').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().homeUrl + '/routes')
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