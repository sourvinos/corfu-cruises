context('Pickup points', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it.only('Goto the list', () => {
            cy.gotoPickupPointList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 2)
            cy.get('[data-cy=column]').should('have.length', 5)
        })

        it('Filter the table by active records', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(1)
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
                expect(rows).to.have.length(2)
            })
        })

        it.only('Filter the table by route', () => {
            // cy.get('p-dropdown-panel p-component').click().find('span').contains('SOUTH').click();
            cy.get('[data-cy=filter-route-abbreviation]').click().should('be.visible').get('li > span').contains('SOUTH')
            // cy.get('[data-cy=row]').should((rows) => {
            // expect(rows).to.have.length(1)
            // })
            // cy.get('.p-dropdown-clear-icon').click()
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(1)
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
            cy.get('[data-cy=filter-exactPoint]').click().type('kiosk')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(1)
            })
            cy.clearField('filter-description')
        })

        it('Filter the table by time', () => {
            cy.get('[data-cy=filter-time]').click().type('09')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(1)
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