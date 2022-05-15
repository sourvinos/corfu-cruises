context('Ports', () => {

    before(() => {
        cy.login()
    })

    describe('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoPortList()
            cy.readPortRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('include', '/ports/1')
        })

        it('Ask to delete and continue', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/ports', { fixture: 'ports/ports.json' }).as('getPorts')
            cy.intercept('DELETE', Cypress.config().apiUrl + '/ports/1', { fixture: 'ports/port.json' }).as('deletePort')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deletePort').its('response.statusCode').should('eq', 200)
            cy.url().should('include', '/ports')
        })

        it('Goto back', () => {
            cy.goBack()
            cy.url().should('include', '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    after(() => {
        cy.logout()
    })

})