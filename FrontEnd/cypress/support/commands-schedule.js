import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoScheduleList', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/schedules', { fixture:'schedules/schedules.json' }).as('getSchedules')
    cy.get(':nth-child(4) > .p-component > #undefined_header').click()
    cy.get(':nth-child(8) > .p-menuitem-link').click()
    cy.wait('@getSchedules').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/schedules')
})

Cypress.Commands.add('gotoEmptyScheduleForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().homeUrl + '/schedules/new')
})

Cypress.Commands.add('readScheduleRecord', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/schedules/1', { fixture:'schedules/schedule.json' }).as('getSchedule')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getSchedule').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/schedules/1')
})