context('Schedules', () => {

    before(() => {
        cy.login()
    })

    describe('Validate new schedule', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoScheduleList()
            cy.gotoEmptyScheduleForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=goBack]').should('have.length', 1)
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 4)
            cy.get('[data-cy=save]').should('have.length', 1)
        })

        it('Destination is not valid when blank', () => {
            cy.typeRandomChars('destination-description', 10).elementShouldBeInvalid('destination-description')
        })

        it('Port is not valid when blank', () => {
            cy.typeRandomChars('port-description', 10).elementShouldBeInvalid('port-description')
        })

        it('From date is not valid when blank', () => {
            cy.typeRandomChars('fromDate', 0).elementShouldBeInvalid('fromDate')
        })

        it('From date is not valid when invalid day is given', () => {
            cy.typeNotRandomChars('fromDate', 32).elementShouldBeInvalid('fromDate')
        })

        it('From date is not valid when invalid month is given', () => {
            cy.typeNotRandomChars('fromDate', '1/13').elementShouldBeInvalid('fromDate')
        })

        it('To date is not valid when blank', () => {
            cy.typeRandomChars('toDate', 0).elementShouldBeInvalid('toDate')
        })

        it('To date is not valid when invalid day is given', () => {
            cy.typeNotRandomChars('toDate', 32).elementShouldBeInvalid('toDate')
        })

        it('To date is not valid when invalid month is given', () => {
            cy.typeNotRandomChars('toDate', '1/13').elementShouldBeInvalid('toDate')
        })

        it('Period is not valid when to date less than from date', () => {
            cy.typeNotRandomChars('fromDate', '01/12').elementShouldBeValid('fromDate')
            cy.typeNotRandomChars('toDate', '01/11').elementShouldBeInvalid('toDate')
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

        it('Save is disabled when all fields are valid but days are not selected', () => {
            cy.typeNotRandomChars('destination-description', 'paxos - antipaxos').elementShouldBeValid('destination-description')
            cy.typeNotRandomChars('port-description', 'corfu').elementShouldBeValid('port-description')
            const date = new Date()
            cy.typeNotRandomChars('fromDate', 10).elementShouldBeValid('fromDate').should('have.value', '10/' + (date.getMonth() + 1) + '/' + date.getFullYear())
            cy.typeNotRandomChars('toDate', 20).elementShouldBeValid('toDate').should('have.value', '20/' + (date.getMonth() + 1) + '/' + date.getFullYear())
            cy.typeNotRandomChars('maxPersons', 225).elementShouldBeValid('maxPersons')
            cy.buttonShouldBeDisabled('save')
        })

        it('Choose not to abort when the back icon is clicked', () => {
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-abort]').click()
            cy.url().should('eq', Cypress.config().homeUrl + '/schedules/new')
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