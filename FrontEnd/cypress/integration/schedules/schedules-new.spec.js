context('Schedules', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoScheduleCalendar()
            cy.gotoEmptyScheduleForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeNotRandomChars('destination-description', 'paxos - antipaxos').elementShouldBeValid('destination-description')
            cy.typeNotRandomChars('port-description', 'corfu').elementShouldBeValid('port-description')
            const date = new Date()
            cy.typeNotRandomChars('fromDate', 10).elementShouldBeValid('fromDate').should('have.value', '10/' + (date.getMonth() + 1) + '/' + date.getFullYear())
            cy.typeNotRandomChars('toDate', 20).elementShouldBeValid('toDate').should('have.value', '20/' + (date.getMonth() + 1) + '/' + date.getFullYear())
            cy.typeNotRandomChars('maxPersons', 225).elementShouldBeValid('maxPersons')
            cy.get('#Mon').click()
            cy.get('#Wed').click()
            cy.get('#Fri').click()
            cy.get('#Sun').click()
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('POST', Cypress.config().apiUrl + '/schedules', { fixture:'schedules/schedule.json' }).as('saveSchedule')
            cy.get('[data-cy=save]').click()
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