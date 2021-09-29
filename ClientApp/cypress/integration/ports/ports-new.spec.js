context('Ports', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoPortList()
            cy.gotoEmptyPortForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeRandomChars('description', 12).elementShouldBeValid('description')
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/ports', { fixture:'ports/ports.json' }).as('getPorts')
            cy.intercept('POST', Cypress.config().baseUrl + '/api/ports', { fixture:'ports/port.json' }).as('savePort')
            cy.get('[data-cy=save]').click()
            cy.wait('@savePort').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/ports')
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