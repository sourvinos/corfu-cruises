context('Schedules', () => {

    before(() => {
        cy.login()
    })

    describe('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoScheduleList()
            cy.readScheduleRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().homeUrl + '/schedules/1')
        })

        it('Ask to delete and continue', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/schedules', { fixture:'schedules/schedules.json' }).as('getSchedules')
            cy.intercept('DELETE', Cypress.config().apiUrl + '/schedules/1', { fixture:'schedules/schedule.json' }).as('deleteSchedule')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteSchedule').its('response.statusCode').should('eq', 200)
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