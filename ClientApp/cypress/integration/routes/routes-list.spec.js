context('Routes', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoRouteList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 8)
            cy.get('[data-cy=column]').should('have.length', 4)
        })

        it('Filter the table by active records', () => {
            cy.get('[data-cy=filter-isActive]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(7)
            })
        })

        it('Filter the table by inactive records', () => {
            cy.get('[data-cy=filter-isActive]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(1)
            })
        })

        it('Clear active records filter', () => {
            cy.get('[data-cy=filter-isActive]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(8)
            })
        })

        it('Filter the table by IsTransfer records', () => {
            cy.get('[data-cy=filter-isTransfer]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(6)
            })
        })

        it('Filter the table by not IsTransfer records', () => {
            cy.get('[data-cy=filter-isTransfer]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(2)
            })
        })

        it('Clear IsTransfer records filter', () => {
            cy.get('[data-cy=filter-isTransfer]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(8)
            })
        })

        it('Filter the table by abbreviation', () => {
            cy.get('[data-cy=filter-abbreviation]').click().type('lp')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(1)
            })
            cy.clearField('filter-abbreviation')
        })

        it('Filter the table by description', () => {
            cy.get('[data-cy=filter-description]').click().type('corfu')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(5)
            })
            cy.clearField('filter-description')
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