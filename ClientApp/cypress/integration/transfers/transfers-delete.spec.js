context('Transfers', () => {

    before(() => {
        cy.login()
    })

    describe('Delete', () => {

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

        it('Ask to delete and abord', () => {
            cy.clickOnDeleteAndAbort()
        })

        it('Ask to delete and continue', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/transfers/date/2020-07-10', 'fixture:transfers/transfers.json').as('getTransfers')
            cy.route('DELETE', Cypress.config().baseUrl + '/api/transfers/1', 'fixture:transfers/transfer.json').as('deleteTransfer')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteTransfer').its('status').should('eq', 200).then(() => {
                cy.get('[data-cy=customSnackbar]')
            })
            cy.wait('@getTransfers').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/transfers/date/2020-07-10')
        })

    })

})

