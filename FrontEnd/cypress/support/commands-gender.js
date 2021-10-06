import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoGenderList', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/genders', { fixture:'genders/genders.json' }).as('getGenders')
    cy.get(':nth-child(4) > .p-component > #undefined_header').click()
    cy.get(':nth-child(4) > .p-toggleable-content > #undefined_content > .ng-tns-c209-1 > .ng-trigger > :nth-child(4) > .p-menuitem-link').click()
    cy.wait('@getGenders').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/genders')
})

Cypress.Commands.add('gotoEmptyGenderForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().homeUrl + '/genders/new')
})

Cypress.Commands.add('readGenderRecord', () => {
    cy.intercept('GET', Cypress.config().apiUrl + '/genders/1', { fixture:'genders/gender.json' }).as('getGender')
    cy.get('.p-datatable-tbody > :nth-child(1)').click()
    cy.get('.p-datatable-tbody > :nth-child(1)').dblclick()
    cy.wait('@getGender').its('response.statusCode').should('eq', 200)
    cy.url().should('eq', Cypress.config().homeUrl + '/genders/1')
})