context('Registrars', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoRegistrarList()
            cy.gotoEmptyRegistrarForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeNotRandomChars('ship-description', 'paxos').elementShouldBeValid('ship-description')
            cy.typeRandomChars('fullname', 10).elementShouldBeValid('fullname')
            cy.typeRandomChars('phones', 10).elementShouldBeValid('phones')
            cy.typeNotRandomChars('email', 'email@server.com').elementShouldBeValid('email')
            cy.typeNotRandomChars('fax', 10).elementShouldBeValid('fax')
            cy.typeNotRandomChars('address', 10).elementShouldBeValid('address')
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/registrars', { fixture:'ships/registrars/registrars.json' }).as('getRegistrars')
            cy.intercept('POST', Cypress.config().baseUrl + '/api/registrars', { fixture:'ships/registrars/registrar.json' }).as('saveRegistrar')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveRegistrar').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/shipRegistrars')
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