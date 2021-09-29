context('Routes', () => {

    before(() => {
        cy.login()
    })

    describe('Validate', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoRouteList()
            cy.gotoEmptyRouteForm()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=goBack]').should('have.length', 1)
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 3)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 2)
            cy.get('[data-cy=save]').should('have.length', 1)
        })

        it('Abbreviation is not valid when blank', () => {
            cy.typeRandomChars('abbreviation', 0).elementShouldBeInvalid('abbreviation')
        })

        it('Abbreviation is not valid when too long', () => {
            cy.typeRandomChars('abbreviation', 11).elementShouldBeInvalid('abbreviation')
        })

        it('Description is not valid when blank', () => {
            cy.typeRandomChars('description', 0).elementShouldBeInvalid('description')
        })

        it('Description is not valid when too long', () => {
            cy.typeRandomChars('description', 129).elementShouldBeInvalid('description')
        })

        it('Port is not valid when value is not in dropdown', () => {
            cy.typeRandomChars('port-description', 10).elementShouldBeInvalid('port-description')
        })

        it('Choose not to abort when the back icon is clicked', () => {
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-abort]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/routes/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/routes', { fixture:'routes/routes.json' }).as('getRoute')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/routes')
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