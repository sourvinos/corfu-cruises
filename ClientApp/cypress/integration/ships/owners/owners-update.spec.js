context('Owners', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoOwnerList()
            cy.readOwnerRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/shipOwners', { fixture:'ships/owners/owners.json' }).as('getOwners')
            cy.intercept('PUT', Cypress.config().baseUrl + '/api/shipOwners/1', { fixture:'ships/owners/owner.json' }).as('saveOwner')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveOwner').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/shipOwners')
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