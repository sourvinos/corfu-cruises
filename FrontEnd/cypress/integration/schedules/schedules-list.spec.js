context('Schedules', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoScheduleList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 11)
            cy.get('[data-cy=column]').should('have.length', 5)
        })

        it('Filter the table by active records', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(9)
            })
        })

        it('Filter the table by inactive records', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(2)
            })
        })

        it('Clear active records filter', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(11)
            })
        })

        it('Filter the table by date', () => {
            cy.get('[data-cy=filter-date]').click().then(x => {
                cy.get('.p-dropdown-panel .p-dropdown-items .p-dropdown-item > span').contains('01/10/2021').then(z => {
                    cy.get('[data-cy=filter-date]').click()
                    cy.get('.p-dropdown-panel .p-dropdown-items .p-dropdown-item > span').contains('01/10/2021').parent().click()
                    cy.get('[data-cy=row]').should((rows) => {
                        expect(rows).to.have.length(2)
                    })
                })
            })
            cy.get('[data-cy=filter-date]').get('.p-dropdown-clear-icon').click()
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(11)
            })
        })

        it('Filter the table by destination', () => {
            cy.get('[data-cy=filter-destination]').click().then(x => {
                cy.get('.p-dropdown-panel .p-dropdown-items .p-dropdown-item > span').contains('PAXOS').then(z => {
                    cy.get('[data-cy=filter-destination]').click()
                    cy.get('.p-dropdown-panel .p-dropdown-items .p-dropdown-item > span').contains('PAXOS').parent().click()
                    cy.get('[data-cy=row]').should((rows) => {
                        expect(rows).to.have.length(8)
                    })
                })
            })
            cy.get('[data-cy=filter-destination]').get('.p-dropdown-clear-icon').click()
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(11)
            })
        })

        it('Filter the table by port', () => {
            cy.get('[data-cy=filter-port]').click().then(x => {
                cy.get('.p-dropdown-panel .p-dropdown-items .p-dropdown-item > span').contains('CORFU').then(z => {
                    cy.get('[data-cy=filter-port]').click()
                    cy.get('.p-dropdown-panel .p-dropdown-items .p-dropdown-item > span').contains('CORFU').parent().click()
                    cy.get('[data-cy=row]').should((rows) => {
                        expect(rows).to.have.length(6)
                    })
                })
            })
            cy.get('[data-cy=filter-port]').get('.p-dropdown-clear-icon').click()
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(11)
            })
        })

        it('Filter the table by max persons', () => {
            cy.get('[data-cy=filter-max-persons]').click().type('185')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(6)
            })
            cy.clearField('filter-max-persons')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(11)
            })
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