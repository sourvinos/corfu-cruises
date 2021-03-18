context('Transfers', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoTransfersWrapper()
        })

        it('Search by a given date', () => {
            cy.searchTransfers()
        })

        it('Totals should have the correct values', () => {
            cy.get(':nth-child(1) > .selection > [data-cy=totalsSum]').should('have.text', '45')
        })

        it('There should be five summary boxes', () => {
            cy.get('[data-cy=summaryBlock]').should('have.length', 5)
        })

        it('The table should have the correct number of rows and columns', () => {
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 12)
            cy.get('[data-cy=column]').should('have.length', 15)
        })

        it('Select all rows by clicking on the "S" column header', () => {
            cy.get('table').within(() => { cy.get('[data-cy=column]:nth-child(1)').click() })
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '45')
        })

        it('Unselect all rows by clicking on the "S" column header', () => {
            cy.get('table').within(() => { cy.get('[data-cy=column]:nth-child(1)').click() })
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Unselect all destinations', () => {
            cy.get('[data-cy=summaryTab]').click()
            cy.get('[data-cy=destinationsCheckbox]').click()
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 0)
            cy.get(':nth-child(2) > .selection > [data-cy=totalsSum]').should('have.text', '0')
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Select all destinations', () => {
            cy.get('[data-cy=summaryTab]').click()
            cy.get('[data-cy=destinationsCheckbox]').click()
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 12)
            cy.get(':nth-child(2) > .selection > [data-cy=totalsSum]').should('have.text', '45')
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Unselect all customers', () => {
            cy.get('[data-cy=summaryTab]').click()
            cy.get('[data-cy=customersCheckbox]').click()
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 0)
            cy.get(':nth-child(2) > .selection > [data-cy=totalsSum]').should('have.text', '0')
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Select all customers', () => {
            cy.get('[data-cy=summaryTab]').click()
            cy.get('[data-cy=customersCheckbox]').click()
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 12)
            cy.get(':nth-child(2) > .selection > [data-cy=totalsSum]').should('have.text', '45')
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Unselect all routes', () => {
            cy.get('[data-cy=summaryTab]').click()
            cy.get('[data-cy=routesCheckbox]').click()
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 0)
            cy.get(':nth-child(2) > .selection > [data-cy=totalsSum]').should('have.text', '0')
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Select all routes', () => {
            cy.get('[data-cy=summaryTab]').click()
            cy.get('[data-cy=routesCheckbox]').click()
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 12)
            cy.get(':nth-child(2) > .selection > [data-cy=totalsSum]').should('have.text', '45')
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Unselect all drivers', () => {
            cy.get('[data-cy=summaryTab]').click()
            cy.get('[data-cy=driversCheckbox]').click()
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 0)
            cy.get(':nth-child(2) > .selection > [data-cy=totalsSum]').should('have.text', '0')
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Select all drivers', () => {
            cy.get('[data-cy=summaryTab]').click()
            cy.get('[data-cy=driversCheckbox]').click()
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 12)
            cy.get(':nth-child(2) > .selection > [data-cy=totalsSum]').should('have.text', '45')
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Unselect all ports', () => {
            cy.get('[data-cy=summaryTab]').click()
            cy.get('[data-cy=portsCheckbox]').click()
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 0)
            cy.get(':nth-child(2) > .selection > [data-cy=totalsSum]').should('have.text', '0')
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Select all ports', () => {
            cy.get('[data-cy=summaryTab]').click()
            cy.get('[data-cy=portsCheckbox]').click()
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 12)
            cy.get(':nth-child(2) > .selection > [data-cy=totalsSum]').should('have.text', '45')
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Unselect the first port', () => {
            cy.get('[data-cy=summaryTab]').click()
            cy.get('[data-cy=port]').eq(0).click()
            cy.get('[data-cy=listTab]').click()
            cy.get('[data-cy=row]').should('have.length', 5)
            cy.get(':nth-child(2) > .selection > [data-cy=totalsSum]').should('have.text', '28')
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '0')
        })

        it('Select the first two rows', () => {
            cy.get('#mat-checkbox-78 > .mat-checkbox-layout > .mat-checkbox-inner-container').click()
            cy.get('#mat-checkbox-79 > .mat-checkbox-layout > .mat-checkbox-inner-container').click()
            cy.get(':nth-child(3) > .selection > [data-cy=totalsSum]').should('have.text', '4')
        })

        it('Select the summary tab', () => {
            cy.get('[data-cy=summaryTab]').click()
        })

        it('Goto the home page', () => {
            cy.get('[data-cy=goBack]').click()
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

