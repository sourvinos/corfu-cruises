context('Crews', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoCrewList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 8)
            cy.get('[data-cy=column]').should('have.length', 5)
        })

        it('Filter the table by active records', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(5)
            })
        })

        it('Filter the table by inactive records', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(3)
            })
        })

        it('Clear active records filter', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(8)
            })
        })

        it('Filter the table by lastname', () => {
            cy.get('[data-cy=filter-lastname]').click().type('ΒΙΤΟΥΛΑΔΙΤΗΣ')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(2)
            })
            cy.clearField('filter-lastname')
        })

        it('Filter the table by firstname', () => {
            cy.get('[data-cy=filter-firstname]').click().type('ΔΑΜΙΑΝΟΣ')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(2)
            })
            cy.clearField('filter-firstname')
        })

        it('Filter the table by birthdate', () => {
            cy.get('[data-cy=filter-birthdate]').click().type('1992')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(2)
            })
            cy.clearField('filter-birthdate')
        })

        it('Goto the home page', () => {
            cy.goHome()
            cy.url().should('eq', Cypress.config().homeUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    after(() => {
        cy.logout()
    })

})