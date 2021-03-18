context('Users', () => {

    describe('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Login', () => {
            cy.login()
        })

        it('Read record', () => {
            cy.gotoUserList()
            cy.readUserRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().baseUrl + '/users/8d204972-9982-491e-aeec-7ce2dcbd56c5')
        })

        it('Ask to delete and continue', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/users', 'fixture:users/users.json').as('getUsers')
            cy.route('DELETE', Cypress.config().baseUrl + '/api/users/8d204972-9982-491e-aeec-7ce2dcbd56c5', 'fixture:users/user.json').as('deleteUser')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteUser').its('status').should('eq', 200)
        })

        it('Logout',()=>{
            cy.logout()
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

})