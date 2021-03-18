import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoDriverList', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/drivers', 'fixture:drivers/drivers.json').as('getDrivers')
    cy.get('[data-cy=tablesMenu]').click()
    cy.get('[data-cy=driversMenu]').click()
    cy.wait('@getDrivers').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/drivers')
})

Cypress.Commands.add('gotoEmptyDriverForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/drivers/new')
})

Cypress.Commands.add('readDriverRecord', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/drivers/1', 'fixture:drivers/driver.json').as('getDriver')
    cy.wait(500)
    cy.get('[data-cy=searchTerm]').clear().type('stamatis').should('have.value', 'stamatis')
    cy.get('.button-row-menu').eq(0).click({ force: true })
    cy.get('[data-cy=editButton]').first().click()
    cy.wait('@getDriver').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/drivers/1').then(() => {
        cy.expect(localStorage.getItem('searchTermDriver')).to.eq('stamatis')
        cy.clearLocalStorage('searchTermDriver')
    })
})
