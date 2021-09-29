context('Pickup points', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoPickupPointList()
            cy.gotoEmptyPickupPointForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Enter only the required fields', () => {
            cy.typeNotRandomChars('route-abbreviation', 'NISAKI').elementShouldBeValid('route-abbreviation')
            cy.typeRandomChars('description', 20).elementShouldBeValid('description')
            cy.typeRandomChars('exactPoint', 15).elementShouldBeValid('exactPoint')
            cy.typeNotRandomChars('time', '18:45').elementShouldBeValid('time')
            cy.get('[data-cy=map-button]').click()
            cy.buttonShouldBeEnabled('save')
        })

        it('Click on the map to add a marker', () => {
            cy.wait(2000).get('[data-cy=map]').click(390, 250)
        })

        it('Click on the form to verify coordinates', () => {
            cy.get('[data-cy=form-button]').click()
            cy.get('[data-cy=coordinates]').should('have.value', '39.66905716057652,19.793135195107762')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/pickupPoints', { fixture: 'pickupPoints/pickupPoints.json' }).as('getPickupPoints')
            cy.intercept('POST', Cypress.config().baseUrl + '/api/pickupPoints', { fixture: 'pickupPoints/pickupPoint.json' }).as('savePickupPoint')
            cy.get('[data-cy=save]').click()
            cy.wait('@savePickupPoint').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/pickupPoints')
        })

        it('Goto the home page', () => {
            cy.goHome()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    after(() => {
        cy.logout()

    })

})