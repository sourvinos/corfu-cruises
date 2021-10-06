import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoPortList', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/ports', { fixture:'ports/ports.json' }).as('getPorts')
    cy.get(':nth-child(4) > .p-component > #undefined_header').click()
    cy.get(':nth-child(4) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(6) > .p-menuitem-link').click()
    cy.wait('@getPorts').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/ports')
})

Cypress.Commands.add('gotoEmptyPortForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().homeUrl + '/ports/new')
})

Cypress.Commands.add('readPortRecord', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/ports/1', { fixture:'ports/port.json' }).as('getPort')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getPort').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/ports/1')
})