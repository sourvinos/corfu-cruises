context('Drivers', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoDriverList()
            cy.gotoEmptyDriverForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeRandomChars('description', 12).elementShouldBeValid('description')
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/drivers', { fixture:'drivers/drivers.json' }).as('getDrivers')
            cy.intercept('POST', Cypress.config().baseUrl + '/api/drivers', { fixture:'drivers/driver.json' }).as('saveDriver')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveDriver').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/drivers')
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