context('Users', () => {

    describe('Validate form', () => {

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

        it('Correct number of fields', () => {
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 5)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 2)
        })

        it('Username', () => {
            cy.typeRandomChars('userName', 0).elementShouldBeInvalid('userName')
            cy.typeRandomChars('userName', 33).elementShouldBeInvalid('userName')
            cy.typeNotRandomChars('userName', 'abc def').elementShouldBeInvalid('userName')
        })

        it('Display name', () => {
            cy.typeRandomChars('displayName', 0).elementShouldBeInvalid('displayName')
            cy.typeRandomChars('displayName', 33).elementShouldBeInvalid('displayName')
        })

        it('Email is empty', () => {
            cy.typeRandomChars('email', 0).elementShouldBeInvalid('email')
            cy.typeRandomChars('email', 129).elementShouldBeInvalid('email')
            cy.typeRandomChars('email', 12).elementShouldBeInvalid('email')
        })

        it('Password', () => {
            cy.typeRandomChars('password', 0).elementShouldBeInvalid('password')
            cy.typeNotRandomChars('password', 'abcd').elementShouldBeInvalid('password')
            cy.typeRandomChars('password', 129).elementShouldBeInvalid('password')
            cy.typeNotRandomChars('password', 'abc def').elementShouldBeInvalid('password')
        })

        it('Confirm password', () => {
            cy.typeRandomChars('confirmPassword', 0).elementShouldBeInvalid('confirmPassword')
            cy.typeNotRandomChars('password', 'abcde12345').elementShouldBeValid('password')
            cy.typeNotRandomChars('confirmPassword', 'abcd e123456').elementShouldBeInvalid('confirmPassword')
            cy.typeNotRandomChars('password', 'abc').elementShouldBeInvalid('password')
            cy.typeNotRandomChars('confirmPassword', 'abc').elementShouldBeInvalid('confirmPassword')
        })

        it('Mark user as admin', () => {
            cy.get('[data-cy=isAdmin]').click({ force: true })
        })

        it('Mark user as active', () => {
            cy.get('[data-cy=isActive]').click()
        })

        it('Choose not to abort when the back icon is clicked', () => {
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-abort]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/users/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/users', 'fixture:users/users.json').as('getUsers')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@getUsers').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/users')
        })

        it('Logout',()=>{
            cy.logout()
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

})