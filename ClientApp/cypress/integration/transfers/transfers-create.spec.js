context('Transfers', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoTransfersWrapper()
        })

        it('Search by a given date', () => {
            cy.searchTransfers()
        })

        it('Goto an empty form', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/transfers/date/2020-07-10', 'fixture:transfers/transfers.json').as('getTransfers')
            cy.route('GET', Cypress.config().baseUrl + '/api/customers/getActive', 'fixture:customers/customers.json').as('getCustomers')
            cy.route('GET', Cypress.config().baseUrl + '/api/destinations/getActive', 'fixture:destinations/destinations.json').as('getDestinations')
            cy.route('GET', Cypress.config().baseUrl + '/api/drivers/getActive', 'fixture:drivers/drivers.json').as('getDrivers')
            cy.route('GET', Cypress.config().baseUrl + '/api/drivers/getDefaultDriver', 'fixture:drivers/driver.json').as('getDefaultDriver')
            cy.route('GET', Cypress.config().baseUrl + '/api/pickupPoints/getActive', 'fixture:pickupPoints/pickupPoints.json').as('getPickupPoints')
            cy.route('GET', Cypress.config().baseUrl + '/api/ports/getActive', 'fixture:ports/ports.json').as('getPorts')
            cy.get('[data-cy=new]').click()
            cy.wait('@getTransfers').its('status').should('eq', 200)
            cy.wait('@getCustomers').its('status').should('eq', 200)
            cy.wait('@getDestinations').its('status').should('eq', 200)
            cy.wait('@getDrivers').its('status').should('eq', 200)
            cy.wait('@getDefaultDriver').its('status').should('eq', 200)
            cy.wait('@getPickupPoints').its('status').should('eq', 200)
            cy.wait('@getPorts').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/transfers/date/2020-07-10/transfer/new')
        })

        it('Destination is valid', () => {
            cy.typeNotRandomChars('destination', 'a').then(() => { cy.get('#dialog').within(() => { cy.get('input[type=text]').type('{enter}', { force: true }) }) })
            cy.get('[data-cy=destination]').should('have.value', 'PAXOS - ANTIPAXOS')
        })

        it('Customer is valid', () => {
            cy.typeNotRandomChars('customer', 'travel').then(() => { cy.get('#dialog').within(() => { cy.get('input[type=text]').type('{enter}', { force: true }) }) })
            cy.get('[data-cy=customer]').should('have.value', 'PACHIS TRAVEL')
        })

        it('Pickup point is valid', () => {
            cy.typeNotRandomChars('pickupPoint', 'nissaki').then(() => { cy.get('#dialog').within(() => { cy.get('input[type=text]').type('{enter}', { force: true }) }) })
            cy.get('[data-cy=pickupPoint]').should('have.value', 'NISSAKI BEACH')
        })

        it('Adults is valid', () => {
            cy.typeNotRandomChars('adults', '3')
        })

        it('kids is valid', () => {
            cy.typeNotRandomChars('kids', '2')
        })

        it('Free is valid', () => {
            cy.typeNotRandomChars('free', '1')
        })

        it('Remarks is valid', () => {
            cy.typeRandomChars('remarks', 10)
        })

        it('Form is valid', () => {
            cy.buttonShouldBeEnabled('save')
        })

        it('Save and display a snackbar', () => {
            cy.server()
            cy.route('POST', 'https://localhost:5010/api/transfers', 'fixture:transfers/transfer.json').as('saveTransfer')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveTransfer').its('status').should('eq', 200)
            cy.get('[data-cy=customSnackbar]')
        })

        it('Close the form', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/transfers/date/2020-07-10', 'fixture:transfers/transfers.json').as('getTransfers')
            cy.get('[data-cy=goBackToSummary]').click({ force: true })
            cy.wait('@getTransfers').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/transfers/date/2020-07-10')
        })

        it('Goto the home page', () => {
            cy.get('[data-cy=goBack]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    after(() => {
        cy.logout()
    })

})

