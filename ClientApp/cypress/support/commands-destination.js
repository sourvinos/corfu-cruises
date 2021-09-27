import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoDestinationList', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/destinations', 'fixture:destinations/destinations.json').as('getDestinations')
    cy.get('[data-cy=tablesMenu]').click()
    cy.get('[data-cy=destinationsMenu]').click()
    cy.wait('@getDestinations').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/destinations')
})

Cypress.Commands.add('gotoEmptyDestinationForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/destinations/new')
})

Cypress.Commands.add('readDestinationRecord', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/destinations/2', 'fixture:destinations/destination.json').as('getDestination')
    cy.get('[data-cy=searchTerm]').clear().type('paxos').should('have.value', 'paxos')
    cy.get('.button-row-menu').eq(0).click({ force: true })
    cy.get('[data-cy=editButton]').first().click()
    cy.wait('@getDestination').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/destinations/2').then(() => {
        cy.expect(localStorage.getItem('searchTermDestination')).to.eq('paxos')
        cy.clearLocalStorage('searchTermDestination')
    })
})