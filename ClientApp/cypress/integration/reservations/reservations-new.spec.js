context('Reservations', () => {

    before(() => {
        cy.login()
    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoReservationList()
            cy.gotoEmptyReservationForm()
            cy.buttonShouldBeDisabled('save')
        })

        it('Give only the required fields', () => {
            cy.typeNotRandomChars('destination-description', 'paxos - antipaxos').elementShouldBeValid('destination-description')
            cy.typeNotRandomChars('customer-description', 'akvila travel').elementShouldBeValid('customer-description')
            cy.typeNotRandomChars('pickupPoint-description', 'diellas acharavi').elementShouldBeValid('pickupPoint-description')
            cy.typeRandomChars('ticketNo', 5).elementShouldBeValid('ticketNo').then(() => {
                cy.typeNotRandomChars('adults', 3).elementShouldBeValid('adults').then(() => {
                    cy.typeNotRandomChars('kids', 2).elementShouldBeValid('kids').then(() => {
                        cy.typeNotRandomChars('free', 1).elementShouldBeValid('free').then(() => {
                            cy.get('[data-cy=totalPersons]').should('have.value', '6')
                        })
                    })
                })
            })
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.intercept('GET', Cypress.config().baseUrl + '/api/reservations/date/2021-09-01', { fixture: 'reservations/reservations.json' }).as('getReservations')
            cy.intercept('POST', Cypress.config().baseUrl + '/api/reservations', { fixture: 'reservations/reservation.json' }).as('saveReservation')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveReservation').its('response.statusCode').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/reservations/date/2021-09-01')
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