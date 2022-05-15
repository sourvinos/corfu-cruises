context('Ports', () => {

    before(() => {
        cy.login()
    })

    describe('Validate', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoPortList()
            cy.gotoEmptyPortForm()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=home-button]').should('have.length', 1)
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 2)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 2)
            cy.get('[data-cy=save]').should('have.length', 1)
        })

        it('Abbreviation is not valid when blank', () => {
            cy.typeRandomChars('abbreviation', 0).elementShouldBeInvalid('abbreviation')
        })

        it('Abbreviation is not valid when too long', () => {
            cy.typeRandomChars('abbreviation', 6).elementShouldBeInvalid('abbreviation')
        })

        it('Description is not valid when blank', () => {
            cy.typeRandomChars('description', 0).elementShouldBeInvalid('description')
        })

        it('Description is not valid when too long', () => {
            cy.typeRandomChars('description', 129).elementShouldBeInvalid('description')
        })

        it('Choose not to abort when the back icon is clicked', () => {
            cy.buttonClick('home-button')
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-abort]').click()
            cy.url().should('include', '/ports/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/ports', { fixture: 'ports/port.json' }).as('getPort')
            cy.buttonClick('home-button')
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
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