import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoRouteList', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/routes', 'fixture:routes/routes.json').as('getRoutes')
    cy.get('[data-cy=tablesMenu]').click()
    cy.get('[data-cy=routesMenu]').click()
    cy.wait('@getRoutes').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/routes')
})

Cypress.Commands.add('gotoEmptyRouteForm', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/ports/getActive', 'fixture:ports/ports.json').as('getPorts')
    cy.get('[data-cy=new]').click()
    cy.wait('@getPorts').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/routes/new')
})

Cypress.Commands.add('readRouteRecord', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/ports/getActive', 'fixture:ports/ports.json').as('getPorts')
    cy.route('GET', Cypress.config().baseUrl + '/api/routes/19', 'fixture:routes/route.json').as('getRoute')
    cy.wait(500)
    cy.get('[data-cy=searchTerm]').clear().type('nisaki').should('have.value', 'nisaki')
    cy.get('.button-row-menu').eq(0).click({ force: true })
    cy.get('[data-cy=editButton]').first().click()
    cy.wait('@getPorts').its('status').should('eq', 200)
    cy.wait('@getRoute').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/routes/19').then(() => {
        cy.expect(localStorage.getItem('searchTermRoute')).to.eq('nisaki')
        cy.clearLocalStorage('searchTermRoute')
    })
})
