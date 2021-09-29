context('Customers', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoCustomerList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 10)
            cy.get('[data-cy=column]').should('have.length', 4)
        })

        it('Filter the table by active records', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(7)
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
                expect(rows).to.have.length(10)
            })
        })

        it('Filter the table by description', () => {
            cy.get('[data-cy=filter-description]').click().type('travel')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(3)
            })
            cy.clearField('filter-description')
        })

        it('Filter the table by email', () => {
            cy.get('[data-cy=filter-email]').click().type('vangeliskar@yahoo.gr')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(1)
            })
            cy.clearField('filter-email')
        })

        it('Filter the table by phone', () => {
            cy.get('[data-cy=filter-phones]').click().type('76768')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(1)
            })
            cy.clearField('filter-phones')
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