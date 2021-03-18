context('Transfers', () => {

    before(() => {
        cy.login()
    })

    describe('Validate form', () => {

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

        it('Destination is not valid when blank', () => {
            cy.typeRandomChars('destination', 0)
                .elementShouldBeInvalid('destination')
        })

        it('Customer is not valid when blank', () => {
            cy.typeRandomChars('customer', 0)
                .elementShouldBeInvalid('customer')
        })

        it('Pickup point is not valid when blank', () => {
            cy.typeRandomChars('pickupPoint', 0)
                .elementShouldBeInvalid('pickupPoint')
        })

        it('Adults is not valid', () => {
            cy.typeRandomChars('adults', 0).elementShouldBeInvalid('adults')
            cy.typeNotRandomChars('adults', '-1').elementShouldBeInvalid('adults')
            cy.typeNotRandomChars('adults', '1001').elementShouldBeInvalid('adults')
        })

        it('Kids is not valid', () => {
            cy.typeRandomChars('kids', 0).elementShouldBeInvalid('kids')
            cy.typeNotRandomChars('kids', '-1').elementShouldBeInvalid('kids')
            cy.typeNotRandomChars('kids', '1001').elementShouldBeInvalid('kids')
        })

        it('Free is not valid', () => {
            cy.typeRandomChars('free', 0).elementShouldBeInvalid('free')
            cy.typeNotRandomChars('free', '-1').elementShouldBeInvalid('free')
            cy.typeNotRandomChars('free', '1001').elementShouldBeInvalid('free')
        })

        it('Remarks is not valid when too long', () => {
            cy.typeRandomChars('remarks', 129)
                .elementShouldBeInvalid('remarks')
        })

        it('Form should be invalid, save button should be disabled', () => {
            cy.formShouldBeInvalid('form')
            cy.buttonShouldBeDisabled('save')
        })

        it('Choose not to abort when the abort button is clicked', () => {
            cy.get('[data-cy=goBackToSummary]').click({ force: true })
            cy.get('#dialog').within(() => {
                cy.get('[data-cy=dialog-abort]').click()
            })
        })

        it('Choose to abort when the abort button is clicked', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/transfers/date/2020-07-10', 'fixture:transfers/transfers.json').as('getTransfers')
            cy.get('[data-cy=goBackToSummary]').click({ force: true })
            cy.get('#dialog').within(() => {
                cy.get('[data-cy=dialog-ok]').click()
            })
            cy.wait('@getTransfers').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/transfers/date/2020-07-10')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

})

