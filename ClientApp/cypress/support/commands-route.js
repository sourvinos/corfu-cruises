import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoRouteList', () => {
    cy.intercept('GET', Cypress.config().baseUrl + '/api/routes', { fixture:'routes/routes.json' }).as('getRoutes')
    cy.get(':nth-child(4) > .p-component > #undefined_header').click()
    cy.get(':nth-child(4) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(7) > .p-menuitem-link').click()
    cy.wait('@getRoutes').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/routes')
})

Cypress.Commands.add('gotoEmptyRouteForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/routes/new')
})

Cypress.Commands.add('readRouteRecord', () => {
    cy.intercept('GET', Cypress.config().baseUrl + '/api/routes/1', { fixture:'routes/route.json' }).as('getRoute')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getRoute').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/routes/1')
})