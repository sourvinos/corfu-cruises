context('Pickup points', () => {

    before(() => {
        cy.login()
    })

    describe('Validate', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Select a route from the dropdown', () => {
            cy.populateRoutesDropdown()
            cy.selectRouteFromDropdown()
        })

        it('Goto an empty form', () => {
            cy.gotoEmptyPickupPointForm()
        })

        it('Populate route description', () => {
            cy.get('[data-cy=routeDescription]').type('NISAKI', { force: true })
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 5)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 1)
        })

        it('Description is not valid when blank', () => {
            cy.typeRandomChars('description', 0).elementShouldBeInvalid('description')
        })

        it('Description is not valid when too long', () => {
            cy.typeRandomChars('description', 129).elementShouldBeInvalid('description')
        })

        it('Exact point is not valid when blank', () => {
            cy.typeRandomChars('exactPoint', 0).elementShouldBeInvalid('exactPoint')
        })

        it('Exact point is not valid when too long', () => {
            cy.typeRandomChars('exactPoint', 129).elementShouldBeInvalid('exactPoint')
        })

        it('Time is not valid when blank', () => {
            cy.typeRandomChars('time', 0).elementShouldBeInvalid('time')
        })

        it('Time is not valid when validation fails', () => {
            cy.typeNotRandomChars('time', '45:10').elementShouldBeInvalid('time')
        })

        it('Time is not valid when too long', () => {
            cy.typeRandomChars('time', 6).elementShouldBeInvalid('time')
        })

        it('Mark record as not active', () => {
            cy.get('[data-cy=isActive]').click()
        })

        it('Form should be invalid, save button should be disabled', () => {
            cy.formShouldBeInvalid('form')
            cy.buttonShouldBeDisabled('save')
        })

        it('Choose not to abort when the back icon is clicked', () => {
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-abort]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/pickupPoints/routeId/19/pickupPoint/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/pickupPoints/routeId/19', 'fixture:pickupPoints/pickupPoints.json').as('getPickupPoints')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@getPickupPoints').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/pickupPoints/routeId/19')
        })

        it('Goto the list', () => {
            cy.get('[data-cy=goBack]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/pickupPoints')
        })

        it('Goto the home page', () => {
            cy.get('[data-cy=goBack]').click()
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