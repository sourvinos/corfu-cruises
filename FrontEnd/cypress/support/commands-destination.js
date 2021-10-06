import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoDestinationList', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/destinations', { fixture:'destinations/destinations.json' }).as('getDestinations')
    cy.get(':nth-child(4) > .p-component > #undefined_header').click()
    cy.get(':nth-child(4) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(2) > .p-menuitem-link').click()
    cy.wait('@getDestinations').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/destinations')
})

Cypress.Commands.add('gotoEmptyDestinationForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().homeUrl + '/destinations/new')
})

Cypress.Commands.add('readDestinationRecord', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/destinations/2', { fixture:'destinations/destination.json' }).as('getDestination')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getDestination').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/destinations/2')
})