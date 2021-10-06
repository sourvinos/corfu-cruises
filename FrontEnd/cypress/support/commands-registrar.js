import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoRegistrarList', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/registrars', { fixture:'ships/registrars/registrars.json' }).as('getRegistrars')
    cy.get(':nth-child(5) > .p-component > #undefined_header').click()
    cy.get(':nth-child(5) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(4) > .p-menuitem-link').click()
    cy.wait('@getRegistrars').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/shipRegistrars')
})

Cypress.Commands.add('gotoEmptyRegistrarForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().homeUrl + '/shipRegistrars/new')
})

Cypress.Commands.add('readRegistrarRecord', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/registrars/1', { fixture:'ships/registrars/registrar.json' }).as('getRegistrar')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getRegistrar').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/shipRegistrars/1')
})