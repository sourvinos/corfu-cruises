import 'cypress-localstorage-commands'

Cypress.Commands.add('gotoUserList', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/users', 'fixture:users/users.json').as('getUsers')
    cy.get('[data-cy=usersMenu]').click()
    cy.wait('@getUsers').its('status').should('eq', 200)
    cy.url().should('eq', Cypress.config().baseUrl + '/users')
    cy.setLocalStorage("userRole", 'Admin');
    cy.setLocalStorage("editUserCaller", 'list');
})

Cypress.Commands.add('gotoEmptyUserForm', () => {
    cy.get('[data-cy=new]').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/users/new')
})

Cypress.Commands.add('readUserRecord', () => {
    cy.server()
    cy.route('GET', Cypress.config().baseUrl + '/api/users/8d204972-9982-491e-aeec-7ce2dcbd56c5', 'fixture:users/user.json').as('getUser')
    cy.wait(500)
    cy.get('[data-cy=searchTerm]').clear().type('gatopoulidis').should('have.value', 'gatopoulidis')
    cy.get('.button-row-menu').eq(0).click({ force: true })
    cy.get('[data-cy=editButton]').first().click()
    cy.wait('@getUser').its('status').should('eq', 200)
    // cy.url().should('eq', Cypress.config().baseUrl + '/users/8d204972-9982-491e-aeec-7ce2dcbd56c5').then(() => {
    //     cy.expect(localStorage.getItem('searchTermUser')).to.eq('gatopoulidis')
    //     cy.clearLocalStorage('searchTermUser')
    // })
})    
