context('Login', () => {

    describe('Correct credentials - Can login', () => {

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

        it('Click on login should login the user and goto the home page', () => {
            cy.buttonClick('login')
            cy.get('[data-cy=side-bar]')
        })

    })

})