context('Reservations', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoReservationList()
        })

        it('Goto the home page', () => {
            cy.goHome()
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