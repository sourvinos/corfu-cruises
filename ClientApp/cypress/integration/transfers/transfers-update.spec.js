context('Transfers', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoTransfersWrapper()
        })

        it('Search by a given date', () => {
            cy.searchTransfers()
        })

        it('Select the list tab', () => {
            cy.get('[data-cy=listTab]').click()
        })

        it('Seek the first row', () => {
            cy.seekTransfer()
        })

        it('Update and display a snackbar', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/transfers/date/2020-07-10', 'fixture:transfers/transfers.json').as('getTransfers')
            cy.route('PUT', Cypress.config().baseUrl + '/api/transfers/1', 'fixture:transfers/transfer.json').as('saveTransfer')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveTransfer').its('status').should('eq', 200).then(() => { cy.get('[data-cy=customSnackbar]') })
            cy.wait('@getTransfers').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/transfers/date/2020-07-10')
        })

    })

})

