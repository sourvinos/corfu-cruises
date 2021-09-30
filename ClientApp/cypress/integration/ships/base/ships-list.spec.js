context('Ships', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoShipList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 3)
            cy.get('[data-cy=column]').should('have.length', 4)
        })

        it('Filter the table by active records', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(2)
            })
        })

        it('Filter the table by inactive records', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(1)
            })
        })

        it('Clear active records filter', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(3)
            })
        })

        it('Filter the table by description', () => {
            cy.get('[data-cy=filter-description]').click().type('paxos')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(1)
            })
            cy.clearField('filter-description')
        })

        it('Filter the table by owner', () => {
            cy.get('[data-cy=filter-ownerDescription]').click().type('my company')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(2)
            })
            cy.clearField('filter-ownerDescription')
        })

        it('Filter the table by imo', () => {
            cy.get('[data-cy=filter-imo]').click().type('63214')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(1)
            })
            cy.clearField('filter-imo')
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