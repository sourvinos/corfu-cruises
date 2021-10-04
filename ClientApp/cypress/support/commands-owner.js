import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoOwnerList', () => {
    cy.intercept('GET', Cypress.config().baseUrl + '/api/shipOwners', { fixture:'ships/owners/owners.json' }).as('getOwners')
    cy.get(':nth-child(5) > .p-component > #undefined_header').click()
    cy.get(':nth-child(5) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(3) > .p-menuitem-link').click()
    cy.wait('@getOwners').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/shipOwners')
})

Cypress.Commands.add('gotoEmptyOwnerForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/shipOwners/new')
})

Cypress.Commands.add('readOwnerRecord', () => {
    cy.intercept('GET', Cypress.config().baseUrl + '/api/shipOwners/1', { fixture:'ships/owners/owner.json' }).as('getOwner')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getOwner').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/shipOwners/1')
})