import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoPortList', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/ports', { fixture: 'ports/ports.json' }).as('getPorts')
    cy.buttonClick('toggle-side-menu')
    cy.buttonClick('ports-menu')
    cy.wait('@getPorts').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/ports')
})

Cypress.Commands.add('gotoEmptyPortForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('include', '/ports/new')
})

Cypress.Commands.add('readPortRecord', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/ports/1', { fixture: 'ports/port.json' }).as('getPort')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getPort').its('response.statusCode').should('eq', 200)
    cy.url().should('include', '/ports/1')
})