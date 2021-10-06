import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoDriverList', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/drivers', { fixture:'drivers/drivers.json' }).as('getDrivers')
    cy.get(':nth-child(4) > .p-component > #undefined_header').click()
    cy.get(':nth-child(4) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(3) > .p-menuitem-link').click()
    cy.wait('@getDrivers').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/drivers')
})

Cypress.Commands.add('gotoEmptyDriverForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().homeUrl + '/drivers/new')
})

Cypress.Commands.add('readDriverRecord', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/drivers/1', { fixture:'drivers/driver.json' }).as('getDriver')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getDriver').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/drivers/1')
})