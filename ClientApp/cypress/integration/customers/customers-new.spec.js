context('Customers', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoCustomerList()
            cy.gotoEmptyCustomerForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeRandomChars('description', 12).elementShouldBeValid('description')
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/customers', { fixture:'customers/customers.json' }).as('getCustomers')
            cy.intercept('POST', Cypress.config().baseUrl + '/api/customers', { fixture:'customers/customer.json' }).as('saveCustomer')
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