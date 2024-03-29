context('Crews', () => {

    before(() => {
        cy.login()
    })

    describe('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoCrewList()
            cy.readCrewRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().homeUrl + '/shipCrews/1')
        })

        it('Ask to delete and continue', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/crews', { fixture:'ships/crews/crews.json' }).as('getCrews')
            cy.intercept('DELETE', Cypress.config().apiUrl + '/crews/1', { fixture:'ships/crews/crew.json' }).as('deleteCrew')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteCrew').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().homeUrl + '/shipCrews')
        })

        it('Goto the home page', () => {
            cy.goHome()
            cy.url().should('eq', Cypress.config().homeUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    after(() => {
        cy.logout()
    })

})