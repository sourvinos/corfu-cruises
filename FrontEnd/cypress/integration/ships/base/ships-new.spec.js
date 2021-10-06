context('Ships', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoShipList()
            cy.gotoEmptyShipForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeRandomChars('description', 12).elementShouldBeValid('description')
            cy.typeNotRandomChars('shipOwner-description', 'ΠΑΝΔΗΣ').elementShouldBeValid('shipOwner-description')
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/ships', { fixture:'ships/base/ships.json' }).as('getShips')
            cy.intercept('POST', Cypress.config().apiUrl + '/ships', { fixture:'ships/base/ship.json' }).as('saveShip')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveShip').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().homeUrl + '/ships')
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