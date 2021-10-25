context('Schedules', () => {

    before(() => {
        cy.login()
    })

    describe('Validate existing schedule', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoScheduleList()
            cy.readScheduleRecord()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=goBack]').should('have.length', 1)
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 4)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 1)
            cy.get('[data-cy=save]').should('have.length', 1)
            cy.get('[data-cy=delete]').should('have.length', 1)
        })

        it('Date is not valid when blank', () => {
            cy.typeNotRandomChars('date', 0).elementShouldBeInvalid('date')
        })

        it('Destination is not valid when blank', () => {
            cy.typeRandomChars('destination-description', 10).elementShouldBeInvalid('destination-description')
        })

        it('Port is not valid when blank', () => {
            cy.typeRandomChars('port-description', 10).elementShouldBeInvalid('port-description')
        })

        it('Max persons is not valid when blank', () => {
            cy.typeRandomChars('maxPersons', 0).elementShouldBeInvalid('maxPersons')
        })

        it('Max persons is not valid when zero', () => {
            cy.typeNotRandomChars('maxPersons', '0').elementShouldBeInvalid('maxPersons')
        })

        it('Max persons is not valid when over 999', () => {
            cy.typeNotRandomChars('maxPersons', '1000').elementShouldBeInvalid('maxPersons')
        })

        it('Max persons is not valid when negative', () => {
            cy.typeNotRandomChars('maxPersons', '-1').elementShouldBeInvalid('maxPersons')
        })

        it('Choose not to abort when the back icon is clicked', () => {
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-abort]').click()
            cy.url().should('eq', Cypress.config().homeUrl + '/schedules/1')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.url().should('eq', Cypress.config().homeUrl + '/schedules')
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