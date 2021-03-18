context('Users', () => {

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Login',()=>{
            cy.login()
        })

        it('Goto the list', () => {
            cy.gotoUserList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 3)
            cy.get('[data-cy=column]').should('have.length', 6)
        })

        it('Filter the table by typing in the search box', () => {
            cy.wait(500)
            cy.get('[data-cy=searchTerm]').type('sourvinos').should('have.value', 'sourvinos')
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(1)
            })
        })

        it('Clear the filter when the "X" is clicked', () => {
            cy.get('[data-cy=clearFilter').click()
            cy.get('[data-cy=searchTerm]').should('have.text', '')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(3)
            })
        })

        it('Logout',()=>{
            cy.logout()
        })

        afterEach(()=>{
            cy.saveLocalStorage()
        })

    })

})


