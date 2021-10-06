import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoShipList', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/ships', { fixture:'ships/base/ships.json' }).as('getShips')
    cy.get(':nth-child(5) > .p-component > #undefined_header').click()
    cy.get(':nth-child(5) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(1) > .p-menuitem-link').click()
    cy.wait('@getShips').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/ships')
})

Cypress.Commands.add('gotoEmptyShipForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().homeUrl + '/ships/new')
})

Cypress.Commands.add('readShipRecord', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/ships/1', { fixture:'ships/base/ship.json' }).as('getShip')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getShip').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/ships/1')
})