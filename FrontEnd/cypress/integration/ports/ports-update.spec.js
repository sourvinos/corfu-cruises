context('Ports', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoPortList()
            cy.readPortRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/ports', { fixture:'ports/ports.json' }).as('getPorts')
            cy.intercept('PUT', Cypress.config().apiUrl + '/ports/1', { fixture:'ports/port.json' }).as('savePort')
            cy.get('[data-cy=save]').click()
            cy.wait('@savePort').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().homeUrl + '/ports')
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