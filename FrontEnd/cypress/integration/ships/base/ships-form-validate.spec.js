context('Ships', () => {

    before(() => {
        cy.login()
    })

    describe('Validate', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoShipList()
            cy.gotoEmptyShipForm()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=goBack]').should('have.length', 1)
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 8)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 1)
            cy.get('[data-cy=save]').should('have.length', 1)
        })

        it('Description is not valid when blank', () => {
            cy.typeRandomChars('description', 0).elementShouldBeInvalid('description')
        })

        it('Description is not valid when too long', () => {
            cy.typeRandomChars('description', 129).elementShouldBeInvalid('description')
        })

        it('Owner is not valid when value is not in dropdown', () => {
            cy.typeRandomChars('shipOwner-description', 10).elementShouldBeInvalid('shipOwner-description')
        })

        it('IMO is not valid when too long', () => {
            cy.typeRandomChars('imo', 129).elementShouldBeInvalid('imo')
        })

        it('Flag is not valid when too long', () => {
            cy.typeRandomChars('flag', 129).elementShouldBeInvalid('flag')
        })

        it('Registry number is not valid when too long', () => {
            cy.typeRandomChars('registryNo', 129).elementShouldBeInvalid('registryNo')
        })

        it('Manager is not valid when too long', () => {
            cy.typeRandomChars('manager', 129).elementShouldBeInvalid('manager')
        })

        it('Manager in Greece is not valid when too long', () => {
            cy.typeRandomChars('managerInGreece', 129).elementShouldBeInvalid('managerInGreece')
        })

        it('Agent is not valid when too long', () => {
            cy.typeRandomChars('agent', 129).elementShouldBeInvalid('agent')
        })

        it('Choose not to abort when the back icon is clicked', () => {
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-abort]').click()
            cy.url().should('eq', Cypress.config().homeUrl + '/ships/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/ships', { fixture:'ships/base/ship.json' }).as('getShip')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.url().should('eq', Cypress.config().homeUrl + '/ships')
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