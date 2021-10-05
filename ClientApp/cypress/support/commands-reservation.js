import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoReservationList', () => {
    cy.intercept('GET', Cypress.config().baseUrl + '/api/reservations/date/2021-09-01', { fixture: 'reservations/reservations.json' }).as('getReservations')
    cy.get(':nth-child(3) > .p-component > #undefined_header').click()
    cy.get(':nth-child(3) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(1) > .p-menuitem-link').click()
    cy.typeNotRandomChars('date', '01/09/2021').elementShouldBeValid('date')
    cy.get('[data-cy="doJobs"').click()
    cy.wait('@getReservations').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/reservations/date/2021-09-01')
})

Cypress.Commands.add('gotoEmptyReservationForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/reservations/new?returnUrl=reservations%2Fdate%2F2021-09-01')
})

Cypress.Commands.add('readRouteRecord', () => {
    cy.intercept('GET', Cypress.config().baseUrl + '/api/routes/1', { fixture: 'routes/route.json' }).as('getRoute')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getRoute').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/routes/1')
})