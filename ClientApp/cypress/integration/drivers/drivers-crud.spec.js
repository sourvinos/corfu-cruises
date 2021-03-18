context('Drivers', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoDriverList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 3)
            cy.get('[data-cy=column]').should('have.length', 5)
        })

        it('Filter the table by typing in the search box', () => {
            cy.wait(500)
            cy.get('[data-cy=searchTerm]').type('sellas')
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
            cy.gotoDriverList()
            cy.gotoEmptyDriverForm()
        })

        it('Name is valid', () => {
            cy.typeRandomChars('description', 5).elementShouldBeValid('description')
        })

        it('Phone is valid', () => {
            cy.typeRandomChars('phones', 5).elementShouldBeValid('phones')
        })

        it('Form is valid', () => {
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/drivers', 'fixture:drivers/drivers.json').as('getDrivers')
            cy.route('POST', Cypress.config().baseUrl + '/api/drivers', 'fixture:drivers/driver.json').as('saveDriver')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveDriver').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/drivers')
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
            cy.gotoDriverList()
            cy.readDriverRecord()
        })

        it('Update record', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/drivers', 'fixture:drivers/drivers.json').as('getDrivers')
            cy.route('PUT', Cypress.config().baseUrl + '/api/drivers/1', 'fixture:drivers/driver.json').as('saveDriver')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveDriver').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/drivers')
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
            cy.gotoDriverList()
            cy.readDriverRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().baseUrl + '/drivers/1')
        })

        it('Ask to delete and continue', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/drivers', 'fixture:drivers/drivers.json').as('getDrivers')
            cy.route('DELETE', Cypress.config().baseUrl + '/api/drivers/1', 'fixture:drivers/driver.json').as('deleteDriver')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteDriver').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/drivers')
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
            cy.gotoDriverList()
            cy.gotoEmptyDriverForm()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 2)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 2)
        })

        it('Name is not valid when blank', () => {
            cy.typeRandomChars('description', 0).elementShouldBeInvalid('description')
        })

        it('Name is not valid when too long', () => {
            cy.typeRandomChars('description', 129).elementShouldBeInvalid('description')
        })

        it('Phones is not valid when too long', () => {
            cy.typeRandomChars('phones', 129).elementShouldBeInvalid('phones')
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
            cy.url().should('eq', Cypress.config().baseUrl + '/drivers/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/drivers', 'fixture:drivers/drivers.json').as('getDrivers')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@getDrivers').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/drivers')
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