context('Registrars', () => {

    before(() => {
        cy.login()
    })

    describe('Validate', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoRegistrarList()
            cy.gotoEmptyRegistrarForm()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=goBack]').should('have.length', 1)
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 6)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 2)
            cy.get('[data-cy=save]').should('have.length', 1)
        })

        it('Fullname is not valid when blank', () => {
            cy.typeRandomChars('fullname', 0).elementShouldBeInvalid('fullname')
        })

        it('Fullname is not valid when too long', () => {
            cy.typeRandomChars('fullname', 129).elementShouldBeInvalid('fullname')
        })

        it('Ship is not valid when value is not in dropdown', () => {
            cy.typeRandomChars('ship-description', 10).elementShouldBeInvalid('ship-description')
        })

        it('Phones is not valid when too long', () => {
            cy.typeRandomChars('phones', 129).elementShouldBeInvalid('phones')
        })

        it('Email is not valid', () => {
            cy.typeNotRandomChars('email', 'something@').elementShouldBeInvalid('email')
        })

        it('Email is not valid when too long', () => {
            cy.typeRandomChars('email', 129).elementShouldBeInvalid('email')
        })

        it('Fax is not valid when too long', () => {
            cy.typeRandomChars('fax', 129).elementShouldBeInvalid('fax')
        })

        it('Address is not valid when too long', () => {
            cy.typeRandomChars('address', 129).elementShouldBeInvalid('address')
        })

        it('Choose not to abort when the back icon is clicked', () => {
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-abort]').click()
            cy.url().should('eq', Cypress.config().homeUrl + '/shipRegistrars/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/shipRegistrars', { fixture:'ships/registrars/registrars.json' }).as('getRegistrars')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
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