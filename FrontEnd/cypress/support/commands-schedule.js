import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoScheduleCalendar', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/schedules').as('getSchedule')
    cy.get(':nth-child(4) > .p-component > #undefined_header').click()
    cy.get(':nth-child(8) > .p-menuitem-link').click()
    cy.url().should('eq', Cypress.config().homeUrl + '/schedules')
})

Cypress.Commands.add('gotoEmptyScheduleForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().homeUrl + '/schedules/new')
})
