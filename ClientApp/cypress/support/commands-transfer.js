import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoTransfersWrapper', () => {
    cy.get('[data-cy=transfersMenu]').click().get('[data-cy=dailyMenu]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/transfers')
})

Cypress.Commands.add('searchTransfers', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/transfers/date/2020-07-10', 'fixture:transfers/transfers.json').as('getTransfers')
    cy.get('[data-cy=dateIn]').clear().type('10/7/2020{enter}')
    cy.get('[data-cy=search]').click()
    cy.wait('@getTransfers').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/transfers/date/2020-07-10').then(() => {
        cy.expect(localStorage.getItem('date')).to.eq('2020-07-10')
    })
})

Cypress.Commands.add('seekTransfer', () => {
    cy.server()
    cy.route('GET', 'https://localhost:5010/api/transfers/1', 'fixture:transfers/transfer.json').as('getTransfer')
    cy.get('.button-row-menu').eq(0).click({ force: true })
    cy.get('[data-cy=editButton]').first().click()
    cy.wait('@getTransfer').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/transfers/date/2020-07-10/transfer/1')
})

Cypress.Commands.add('populateDropDowns', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/transfers/date/2020-07-10', 'fixture:transfers/transfers.json').as('getTransfers')
    cy.route('GET', Cypress.config().baseUrl + '/api/customers/getActive', 'fixture:customers/customers.json').as('getCustomers')
    cy.route('GET', Cypress.config().baseUrl + '/api/destinations/getActive', 'fixture:destinations/destinations.json').as('getDestinations')
    cy.route('GET', Cypress.config().baseUrl + '/api/drivers/getActive', 'fixture:drivers/drivers.json').as('getDrivers')
    cy.route('GET', Cypress.config().baseUrl + '/api/drivers/getDefaultDriver', 'fixture:drivers/drivers.json').as('getDefaultDriver')
    cy.route('GET', Cypress.config().baseUrl + '/api/pickupPoints/getActive', 'fixture:pickupPoints/pickupPoints.json').as('getPickupPoints')
    cy.route('GET', Cypress.config().baseUrl + '/api/ports/getActive', 'fixture:ports/ports.json').as('getPorts')
    cy.wait('@getTransfers').its('status').should('eq', 200)
    cy.wait('@getCustomers').its('status').should('eq', 200)
    cy.wait('@getDestinations').its('status').should('eq', 200)
    cy.wait('@getDrivers').its('status').should('eq', 200)
    cy.wait('@getDefaultDriver').its('status').should('eq', 200)
    cy.wait('@getPickupPoints').its('status').should('eq', 200)
    cy.wait('@getPorts').its('status').should('eq', 200)
})