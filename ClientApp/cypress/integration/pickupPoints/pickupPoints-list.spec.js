context('Pickup points', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoPickupPointList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 13)
            cy.get('[data-cy=column]').should('have.length', 5)
        })

        it('Filter the table by active records', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(10)
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
                expect(rows).to.have.length(13)
            })
        })

        it('Filter the table by route', () => {
            cy.get('[data-cy=filter-route]').click().then(x => {
                cy.get('.p-dropdown-panel .p-dropdown-items .p-dropdown-item > span').contains('PAGOI').then(z => {
                    cy.get('[data-cy=filter-route]').click()
                    cy.get('.p-dropdown-panel .p-dropdown-items .p-dropdown-item > span').contains('PAGOI').parent().click()
                    cy.get('[data-cy=row]').should((rows) => {
                        expect(rows).to.have.length(5)
                    })
                })
            })
            cy.get('[data-cy=filter-route]').get('.p-dropdown-clear-icon').click()
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(13)
            })
        })

        it('Filter the table by description', () => {
            cy.get('[data-cy=filter-description]').click().type('san')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(1)
            })
            cy.clearField('filter-description')
        })

        it('Filter the table by exact point', () => {
            cy.get('[data-cy=filter-exactPoint]').click().type('main road')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(6)
            })
            cy.clearField('filter-description')
        })

        it('Filter the table by time', () => {
            cy.get('[data-cy=filter-time]').click().type('06')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(6)
            })
            cy.clearField('filter-time')
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