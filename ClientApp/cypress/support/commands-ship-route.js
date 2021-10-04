import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoShipRouteList', () => {
    cy.intercept('GET', Cypress.config().baseUrl + '/api/shipRoutes', { fixture:'ships/routes/routes.json' }).as('getShipRoutes')
    cy.get(':nth-child(5) > .p-component > #undefined_header').click()
    cy.get(':nth-child(5) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(5) > .p-menuitem-link').click()
    cy.wait('@getShipRoutes').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/shipRoutes')
})

Cypress.Commands.add('gotoEmptyShipRouteForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/shipRoutes/new')
})

Cypress.Commands.add('readShipRouteRecord', () => {
    cy.intercept('GET', Cypress.config().baseUrl + '/api/shipRoutes/1', { fixture:'ships/routes/route.json' }).as('getShipRoute')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getShipRoute').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/shipRoutes/1')
})