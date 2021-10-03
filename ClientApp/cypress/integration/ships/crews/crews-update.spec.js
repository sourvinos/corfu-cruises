context('Crews', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoCrewList()
            cy.readCrewRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/crews', { fixture:'ships/crews/crews.json' }).as('getCrews')
            cy.intercept('PUT', Cypress.config().baseUrl + '/api/crews/1', { fixture:'ships/crews/crew.json' }).as('saveCrew')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveCrew').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/shipCrews')
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