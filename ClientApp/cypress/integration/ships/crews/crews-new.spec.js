context('Crews', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoCrewList()
            cy.gotoEmptyCrewForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeRandomChars('lastname', 12).elementShouldBeValid('lastname')
            cy.typeRandomChars('firstname', 12).elementShouldBeValid('firstname')
            cy.typeNotRandomChars('birthdate', '7').elementShouldBeValid('birthdate')
            cy.typeNotRandomChars('ship', 'dion').elementShouldBeValid('ship')
            cy.typeNotRandomChars('gender', 'male').elementShouldBeValid('gender')
            cy.typeNotRandomChars('nationality', 'afgh').elementShouldBeValid('nationality')
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/crews', { fixture:'ships/crews/crews.json' }).as('getCrews')
            cy.intercept('POST', Cypress.config().baseUrl + '/api/crews', { fixture:'ships/crews/crew.json' }).as('saveCrew')
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