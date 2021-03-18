context('Transfers', () => {

    before(() => {
        cy.login()
    })

    describe('Validate date', () => {

        it('Goto the list', () => {
            cy.gotoTransfersWrapper()
        })

        it('Invalid day', () => {
            cy.get('[data-cy=dateIn]')
                .clear()
                .type('32{enter}')
                .should('be', '')
        })

        it('Invalid  month', () => {
            cy.get('[data-cy=dateIn]')
                .clear()
                .type('31/14{enter}')
                .should('be', '')
        })

        it('Valid day', () => {
            cy.get('[data-cy=dateIn]')
                .clear()
                .type('5{enter}')
                .should('be', '05/' + new Date().getMonth() + '/' + new Date().getFullYear())
        })

        it('Valid day and month', () => {
            cy.get('[data-cy=dateIn]')
                .clear()
                .type('5/8{enter}')
                .should('be', '05/08/' + new Date().getFullYear())
        })

        it('Valid day, month and short year', () => {
            cy.get('[data-cy=dateIn]')
                .clear()
                .type('5/8/20{enter}')
                .should('be', '05/08/2020')
        })

        it('Valid day, month and full year', () => {
            cy.get('[data-cy=dateIn]')
                .clear()
                .type('5/8/2020{enter}')
                .should('be', '05/08/2020')
        })

    })

})

