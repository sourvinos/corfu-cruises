context('Customers', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoCustomerList()
            cy.readCustomerRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/customers', { fixture:'customers/customers.json' }).as('getCustomers')
            cy.intercept('PUT', Cypress.config().baseUrl + '/api/customers/5', { fixture:'customers/customer.json' }).as('saveCustomer')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveCustomer').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/customers')
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