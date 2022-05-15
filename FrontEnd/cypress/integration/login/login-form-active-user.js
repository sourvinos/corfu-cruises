context('Login', () => {

    describe('Correct credentials - Can login', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto login form', () => {
            cy.goHome()
            cy.buttonShouldBeDisabled('login')
            cy.buttonShouldBeEnabled('forgotPassword')
        })

        it('Login should be disabled', () => {
            cy.buttonShouldBeDisabled('login')
        })

        it('Forgot password should be enabled', () => {
            cy.buttonShouldBeEnabled('forgotPassword')
        })

        it('Give the username', () => {
            cy.typeNotRandomChars('username', 'john').elementShouldBeValid('username')
        })

        it('Login should be disabled', () => {
            cy.buttonShouldBeDisabled('login')
        })

        it('Give the password', () => {
            cy.typeNotRandomChars('password', 'ec11fc8c16da').elementShouldBeValid('password')
        })

        it('Login should be disabled', () => {
            cy.buttonShouldBeDisabled('login')
        })

        it('Select "I am not a robot"', () => {
            cy.get('[data-cy=isHuman]').click()
        })

        it('Login should be enabled', () => {
            cy.buttonShouldBeEnabled('login')
        })

        it('Click on login should login the user', () => {
            cy.buttonClick('login')
            cy.get('[data-cy="side-menu-toggler"]')
        })

        it('Side-menu-toggler should be clickable', () => {
            cy.buttonClick('side-menu-toggler')
            cy.get('[data-cy="side-menu"]')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

})