context('Genders', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoGenderList()
            cy.readGenderRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/genders', { fixture:'genders/genders.json' }).as('getGenders')
            cy.intercept('PUT', Cypress.config().apiUrl + '/genders/1', { fixture:'genders/gender.json' }).as('saveGender')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveGender').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().homeUrl + '/genders')
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