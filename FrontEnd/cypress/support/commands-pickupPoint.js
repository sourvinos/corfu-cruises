import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoPickupPointList', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/pickupPoints', { fixture:'pickupPoints/pickupPoints.json' }).as('getPickupPoints')
    cy.get(':nth-child(4) > .p-component > #undefined_header').click()
    cy.get(':nth-child(4) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(5) > .p-menuitem-link').click()
    cy.wait('@getPickupPoints').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/pickupPoints')
})

Cypress.Commands.add('gotoEmptyPickupPointForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().homeUrl + '/pickupPoints/new')
})

Cypress.Commands.add('readPickupPointRecord', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/pickupPoints/51', { fixture:'pickupPoints/pickupPoint.json' }).as('getPickupPoint')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getPickupPoint').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/pickupPoints/51')
})