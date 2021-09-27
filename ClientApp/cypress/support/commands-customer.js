import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoCustomerList', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/customers', 'fixture:customers/customers.json').as('getCustomers')
    cy.get(':nth-child(4) > .p-component > #undefined_header').click()
    cy.get(':nth-child(4) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(1) > .p-menuitem-link').click()
    cy.wait('@getCustomers').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/customers')
})

Cypress.Commands.add('gotoEmptyCustomerForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/customers/new')
})

Cypress.Commands.add('readCustomerRecord', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/customers/22', 'fixture:customers/customer.json').as('getCustomer')
    cy.get('[data-cy=searchTerm]').clear().type('lord')
    cy.get('.button-row-menu').eq(0).click({ force: true })
    cy.get('[data-cy=editButton]').first().click()
    cy.wait('@getCustomer').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/customers/22').then(() => {
        cy.expect(localStorage.getItem('searchTermCustomer')).to.eq('lord')
        cy.clearLocalStorage('searchTermCustomer')
    })
})