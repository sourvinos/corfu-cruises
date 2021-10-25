context('Schedules', () => {

    before(() => {
        cy.login()
    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoScheduleList()
            cy.readScheduleRecord()
        })

        it('Update record', () => {
            cy.intercept('GET', Cypress.config().apiUrl + '/schedules', { fixture:'schedules/schedules.json' }).as('getSchedules')
            cy.intercept('PUT', Cypress.config().apiUrl + '/schedules/1', { fixture:'schedules/schedule.json' }).as('saveSchedule')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveSchedule').its('response.statusCode').should('eq', 200)
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