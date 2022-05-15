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
            cy.typeRandomChars('abbreviation', 5).elementShouldBeValid('abbreviation')
            cy.typeRandomChars('description', 128).elementShouldBeValid('description')
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/ports', { fixture: 'ports/ports.json' }).as('getPorts')
            cy.intercept('POST', Cypress.config().apiUrl + '/ports', { fixture: 'ports/port.json' }).as('savePort')
            cy.get('[data-cy=save]').click()
            cy.wait('@savePort').its('response.statusCode').should('eq', 200)
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