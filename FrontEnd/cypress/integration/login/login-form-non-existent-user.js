context('Login', () => {

    describe('Correct credentials - Non-existent user', () => {

        it('Goto login form', () => {
            cy.gotoLoginForm()
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
            cy.typeNotRandomChars('username', 'nobody').elementShouldBeValid('username')
        })

        it('Login should be disabled', () => {
            cy.buttonShouldBeDisabled('login')
        })

        it('Give the password', () => {
            cy.typeNotRandomChars('password', 'wrong-password').elementShouldBeValid('password')
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

        it('Click on login should display error', () => {
            cy.buttonClick('login')
            cy.get('.mat-snack-bar-container.error')
        })

    })

})