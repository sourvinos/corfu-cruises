import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoPortList', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/ports', 'fixture:ports/ports.json').as('getPorts')
    cy.get('[data-cy=tablesMenu]').click()
    cy.get('[data-cy=portsMenu]').click()
    cy.wait('@getPorts').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/ports')
})

Cypress.Commands.add('gotoEmptyPortForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/ports/new')
})

Cypress.Commands.add('readPortRecord', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/ports/1', 'fixture:ports/port.json').as('getPort')
    cy.wait(500)
    cy.get('[data-cy=searchTerm]').clear().type('corfu').should('have.value', 'corfu')
    cy.get('.button-row-menu').eq(0).click({ force: true })
    cy.get('[data-cy=editButton]').first().click()
    cy.wait('@getPort').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/ports/1').then(() => {
        cy.expect(localStorage.getItem('searchTermPort')).to.eq('corfu')
        cy.clearLocalStorage('searchTermPort')
    })

})