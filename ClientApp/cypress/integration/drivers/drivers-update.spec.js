context('Drivers', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoDriverList()
            cy.readDriverRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/drivers', { fixture:'drivers/drivers.json' }).as('getDrivers')
            cy.intercept('PUT', Cypress.config().baseUrl + '/api/drivers/1', { fixture:'drivers/driver.json' }).as('saveDriver')
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