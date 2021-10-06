context('Crews', () => {

    before(() => {
        cy.login()
    })

    describe('Validate', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoCrewList()
            cy.gotoEmptyCrewForm()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=goBack]').should('have.length', 1)
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 6)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 1)
            cy.get('[data-cy=save]').should('have.length', 1)
        })

        it('Lastname is not valid when blank', () => {
            cy.typeRandomChars('lastname', 0).elementShouldBeInvalid('lastname')
        })

        it('Firstname is not valid when too long', () => {
            cy.typeRandomChars('firstname', 129).elementShouldBeInvalid('firstname')
        })

        it('Firstname is not valid when blank', () => {
            cy.typeRandomChars('firstname', 0).elementShouldBeInvalid('firstname')
        })

        it('Firstname is not valid when too long', () => {
            cy.typeRandomChars('firstname', 129).elementShouldBeInvalid('firstname')
        })

        it('Birthdate is not valid when blank', () => {
            cy.typeRandomChars('birthdate', 0).elementShouldBeInvalid('birthdate')
        })

        it('Ship is not valid when value is not in dropdown', () => {
            cy.typeRandomChars('ship', 10).elementShouldBeInvalid('ship')
        })

        it('Nationality is not valid when value is not in dropdown', () => {
            cy.typeRandomChars('nationality', 10).elementShouldBeInvalid('nationality')
        })

        it('Gender is not valid when value is not in dropdown', () => {
            cy.typeRandomChars('gender', 10).elementShouldBeInvalid('gender')
        })

        it('Choose not to abort when the back icon is clicked', () => {
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-abort]').click()
            cy.url().should('eq', Cypress.config().homeUrl + '/shipCrews/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/crews', { fixture:'ships/crews/crews.json' }).as('getCrews')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.url().should('eq', Cypress.config().homeUrl + '/shipCrews')
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