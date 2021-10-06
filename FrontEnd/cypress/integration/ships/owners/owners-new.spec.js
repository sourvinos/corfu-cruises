context('Owners', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoOwnerList()
            cy.gotoEmptyOwnerForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeRandomChars('description', 12).elementShouldBeValid('description')
            cy.typeRandomChars('profession', 12).elementShouldBeValid('profession')
            cy.typeRandomChars('address', 12).elementShouldBeValid('address')
            cy.typeRandomChars('taxNo', 12).elementShouldBeValid('taxNo')
            cy.typeRandomChars('city', 12).elementShouldBeValid('city')
            cy.typeRandomChars('phones', 12).elementShouldBeValid('phones')
            cy.typeNotRandomChars('email', 'email@server.com').elementShouldBeValid('email')
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/shipOwners', { fixture:'ships/owners/owners.json' }).as('getOwners')
            cy.intercept('POST', Cypress.config().apiUrl + '/shipOwners', { fixture:'ships/owners/owner.json' }).as('saveOwner')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveOwner').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().homeUrl + '/shipOwners')
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