import 'cypress-localstorage-commands'

Cypress.Commands.add('populateRoutesDropdown', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/routes/getActive', 'fixture:routes/routes.json').as('getRoutes')
    cy.get('[data-cy=tablesMenu]').click()
    cy.get('[data-cy=pickupPointsMenu]').click()
    cy.wait('@getRoutes').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/pickupPoints')
})

Cypress.Commands.add('selectRouteFromDropdown', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/pickupPoints/routeId/19', 'fixture:pickupPoints/pickupPoints.json').as('getPickupPoints')
    cy.get('[data-cy=routeSelect]').click()
    cy.get('[data-cy=routeElement]').contains('NISAKI').click()
    cy.wait('@getPickupPoints').its('status').should('eq', 200).then(() => {
        cy.url().should('eq', Cypress.config().baseUrl + '/pickupPoints/routeId/19')
    })
})

Cypress.Commands.add('gotoEmptyPickupPointForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/pickupPoints/routeId/19/pickupPoint/new')
})

Cypress.Commands.add('readPickupPointRecord', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/pickupPoints/1700', 'fixture:pickupPoints/pickupPoint.json').as('getPickupPoint')
    cy.get('[data-cy=searchTerm]').clear().type('kaminaki')
    cy.get('.button-row-menu').eq(0).click({ force: true })
    cy.get('[data-cy=editButton]').first().click()
    cy.wait('@getPickupPoint').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/pickupPoints/routeId/19/pickupPoint/1700').then(() => {
        cy.expect(localStorage.getItem('searchTermPickupPoint')).to.eq('kaminaki')
        cy.clearLocalStorage('searchTermPickupPoint')
    })
})

