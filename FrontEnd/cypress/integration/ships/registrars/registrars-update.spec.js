context('Registrars', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoRegistrarList()
            cy.readRegistrarRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/registrars', { fixture:'ships/registrars/registrars.json' }).as('getRegistrars')
            cy.intercept('PUT', Cypress.config().apiUrl + '/registrars/1', { fixture:'ships/registrars/registrar.json' }).as('saveRegistrar')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveRegistrar').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().homeUrl + '/shipRegistrars')
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