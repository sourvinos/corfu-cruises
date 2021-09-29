import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoCustomerList', () => {
    cy.intercept('GET', Cypress.config().baseUrl + '/api/customers', { fixture:'customers/customers.json' }).as('getCustomers')
    cy.get(':nth-child(4) > .p-component > #undefined_header').click()
    cy.get(':nth-child(4) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(1) > .p-menuitem-link').click()
    cy.wait('@getCustomers').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/customers')
})

Cypress.Commands.add('gotoEmptyCustomerForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/customers/new')
})

Cypress.Commands.add('readCustomerRecord', () => {
    cy.intercept('GET', Cypress.config().baseUrl + '/api/customers/5', { fixture:'customers/customer.json' }).as('getCustomer')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getCustomer').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/customers/5')
})