context('Ports', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoPortList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 2)
            cy.get('[data-cy=column]').should('have.length', 4)
        })

        it('Filter the table by typing in the search box', () => {
            cy.wait(500)
            cy.get('[data-cy=searchTerm]').type('corfu')
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(1)
            })
        })

        it('Clear the filter when the "X" is clicked', () => {
            cy.get('[data-cy=clearFilter').click()
            cy.get('[data-cy=searchTerm]').should('have.text', '')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(2)
            })
        })

        it('Goto the home page', () => {
            cy.get('[data-cy=goBack]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    describe('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoPortList()
            cy.gotoEmptyPortForm()
        })

        it('Description is valid', () => {
            cy.typeRandomChars('description', 12).elementShouldBeValid('description')
        })

        it('Form is valid', () => {
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/ports', 'fixture:ports/ports.json').as('getPorts')
            cy.route('POST', Cypress.config().baseUrl + '/api/ports', 'fixture:ports/port.json').as('savePort')
            cy.get('[data-cy=save]').click()
            cy.wait('@savePort').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/ports')
        })

        it('Goto the home page', () => {
            cy.get('[data-cy=goBack]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    describe('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoPortList()
            cy.readPortRecord()
        })

        it('Update record', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/ports', 'fixture:ports/ports.json').as('getPorts')
            cy.route('PUT', Cypress.config().baseUrl + '/api/ports/1', 'fixture:ports/port.json').as('savePort')
            cy.get('[data-cy=save]').click()
            cy.wait('@savePort').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/ports')
        })

        it('Goto the home page', () => {
            cy.get('[data-cy=goBack]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    describe('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoPortList()
            cy.readPortRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().baseUrl + '/ports/1')
        })

        it('Ask to delete and continue', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/ports', 'fixture:ports/ports.json').as('getPorts')
            cy.route('DELETE', Cypress.config().baseUrl + '/api/ports/1', 'fixture:ports/port.json').as('deletePort')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deletePort').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/ports')
        })

        it('Goto the home page', () => {
            cy.get('[data-cy=goBack]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    describe('Validate', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoPortList()
            cy.gotoEmptyPortForm()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 1)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 1)
        })

        it('Description is not valid when blank', () => {
            cy.typeRandomChars('description', 0).elementShouldBeInvalid('description')
        })

        it('Description is not valid when too long', () => {
            cy.typeRandomChars('description', 129).elementShouldBeInvalid('description')
        })

        it('Mark record as not active', () => {
            cy.get('[data-cy=isActive]').click()
        })

        it('Form should be invalid, save button should be disabled', () => {
            cy.formShouldBeInvalid('form')
            cy.buttonShouldBeDisabled('save')
        })

        it('Choose not to abort when the back icon is clicked', () => {
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-abort]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/ports/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/ports', 'fixture:ports/ports.json').as('getPorts')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@getPorts').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/ports')
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