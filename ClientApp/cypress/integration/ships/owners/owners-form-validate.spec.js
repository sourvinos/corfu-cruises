context('Owners', () => {

    before(() => {
        cy.login()
    })

    describe('Validate', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoOwnerList()
            cy.gotoEmptyOwnerForm()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=goBack]').should('have.length', 1)
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 7)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 1)
            cy.get('[data-cy=save]').should('have.length', 1)
        })

        it('Description is not valid when blank', () => {
            cy.typeRandomChars('description', 0).elementShouldBeInvalid('description')
        })

        it('Description is not valid when too long', () => {
            cy.typeRandomChars('description', 129).elementShouldBeInvalid('description')
        })

        it('Profession is not valid when too long', () => {
            cy.typeRandomChars('profession', 129).elementShouldBeInvalid('profession')
        })

        it('Address is not valid when too long', () => {
            cy.typeRandomChars('address', 129).elementShouldBeInvalid('address')
        })

        it('Tax number is not valid when too long', () => {
            cy.typeRandomChars('taxNo', 129).elementShouldBeInvalid('taxNo')
        })

        it('City is not valid when too long', () => {
            cy.typeRandomChars('city', 129).elementShouldBeInvalid('city')
        })

        it('Phones is not valid when too long', () => {
            cy.typeRandomChars('phones', 129).elementShouldBeInvalid('phones')
        })

        it('Email is not valid', () => {
            cy.typeRandomChars('email', 12).elementShouldBeInvalid('email')
        })

        it('Email is not valid when too long', () => {
            cy.typeRandomChars('email', 129).elementShouldBeInvalid('email')
        })

        it('Choose not to abort when the back icon is clicked', () => {
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-abort]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/shipOwners/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/shipOwners', { fixture:'ships/owners/owners.json' }).as('getOwners')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
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