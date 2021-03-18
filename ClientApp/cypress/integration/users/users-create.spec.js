context('Users', () => {

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Login', () => {
            cy.login()
        })

        it('Goto an empty form', () => {
            cy.gotoUserList()
            cy.gotoEmptyUserForm()
        })

        it('Valid fields', () => {
            cy.typeRandomChars('userName', 12).elementShouldBeValid('userName')
            cy.typeRandomChars('displayName', 12).elementShouldBeValid('displayName')
            cy.typeNotRandomChars('email', 'user@outlook.com').elementShouldBeValid('email')
            cy.typeNotRandomChars('password', '1234567890').elementShouldBeValid('password')
            cy.typeNotRandomChars('confirmPassword', '1234567890').elementShouldBeValid('confirmPassword')
        })

        it('Form is valid', () => {
            cy.buttonShouldBeEnabled('save')
        })

        it('Create and display a snackbar', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/users', 'fixture:users/users.json').as('getUsers')
            cy.route('POST', Cypress.config().baseUrl + '/api/account/register', 'fixture:users/user.json').as('saveUser')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveUser').its('status').should('eq', 200)
        })

        it('Logout',()=>{
            cy.logout()
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

})