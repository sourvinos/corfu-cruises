import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoCrewList', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/crews', { fixture:'ships/crews/crews.json' }).as('getCrews')
    cy.get(':nth-child(5) > .p-component > #undefined_header').click()
    cy.get(':nth-child(5) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(2) > .p-menuitem-link').click()
    cy.wait('@getCrews').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/shipCrews')
})

Cypress.Commands.add('gotoEmptyCrewForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().homeUrl + '/shipCrews/new')
})

Cypress.Commands.add('readCrewRecord', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/crews/1', { fixture:'ships/crews/crew.json' }).as('getCrew')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getCrew').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/shipCrews/1')
})