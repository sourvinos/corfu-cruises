context('Transfers', () => {

    before(() => {
        cy.login()
    })

    describe('Assign driver', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoTransfersWrapper()
        })

        it('Search by a given date', () => {
            cy.searchTransfers()
        })

        it('Unselect all drivers', () => {
            cy.get('[data-cy=driversCheckbox]').click()
        })

        it('Select the default driver', () => {
            cy.get('#-').eq(0).click()
        })

        it('Select the list tab', () => {
            cy.get('[data-cy=listTab]').click()
        })

        it('Select some rows', () => {
            cy.get('#mat-checkbox-6 > .mat-checkbox-layout > .mat-checkbox-inner-container').click()
            cy.get('#mat-checkbox-7 > .mat-checkbox-layout > .mat-checkbox-inner-container').click()
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '6')
        })

        it('Assign driver', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/drivers/getActive', 'fixture:drivers/drivers.json').as('getDrivers')
            cy.route('GET', Cypress.config().baseUrl + '/api/transfers/date/2020-07-10', 'fixture:transfers/transfers.json').as('getTransfers')
            cy.route('PATCH', Cypress.config().baseUrl + '/api/transfers/assignDriver?driverId=1&id=6&id=7', 'fixture:transfers/transfers-assign-driver.json').as('assignDriver')
            cy.get('[data-cy=assignDriver]').click()
            cy.get('[data-cy=driverSelect]').click()
            cy.get('[data-cy=driverElement]').contains('STAMATIS').click();
            cy.get('[data-cy=continue]').click()
            cy.get('[data-cy=customSnackbar]')
            cy.wait('@getTransfers').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/transfers/date/2020-07-10')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

})

