context('Destinations', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoDestinationList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 4)
            cy.get('[data-cy=column]').should('have.length', 5)
        })

        it('Filter the table by typing in the search box', () => {
            cy.wait(500)
            cy.get('[data-cy=searchTerm]').type('paxos')
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(1)
            })
        })

        it('Clear the filter when the "X" is clicked', () => {
            cy.get('[data-cy=clearFilter').click()
            cy.get('[data-cy=searchTerm]').should('have.text', '')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(4)
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
            cy.gotoDestinationList()
            cy.gotoEmptyDestinationForm()
        })

        it('Abbreviation is valid', () => {
            cy.typeRandomChars('abbreviation', 5).elementShouldBeValid('abbreviation')
        })

        it('Description is valid', () => {
            cy.typeRandomChars('description', 128).elementShouldBeValid('description')
        })

        it('Form is valid', () => {
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/destinations', 'fixture:destinations/destinations.json').as('getDestinations')
            cy.route('POST', Cypress.config().baseUrl + '/api/destinations', 'fixture:destinations/destination.json').as('saveDestination')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveDestination').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/destinations')
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
            cy.gotoDestinationList()
            cy.readDestinationRecord()
        })

        it('Update record', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/destinations', 'fixture:destinations/destinations.json').as('getDestinations')
            cy.route('PUT', Cypress.config().baseUrl + '/api/destinations/2', 'fixture:destinations/destination.json').as('saveDestination')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveDestination').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/destinations')
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
            cy.gotoDestinationList()
            cy.readDestinationRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().baseUrl + '/destinations/2')
        })

        it('Ask to delete and continue', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/destinations', 'fixture:destinations/destinations.json').as('getDestinations')
            cy.route('DELETE', Cypress.config().baseUrl + '/api/destinations/2', 'fixture:destinations/destination.json').as('deleteDestination')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteDestination').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/destinations')
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
            cy.gotoDestinationList()
            cy.gotoEmptyDestinationForm()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 2)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 1)
        })

        it('Abbreviation is not valid when blank', () => {
            cy.typeRandomChars('abbreviation', 0).elementShouldBeInvalid('abbreviation')
        })

        it('Abbreviation is not valid when too long', () => {
            cy.typeRandomChars('abbreviation', 6).elementShouldBeInvalid('abbreviation')
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
            cy.url().should('eq', Cypress.config().baseUrl + '/destinations/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/destinations', 'fixture:destinations/destinations.json').as('getDestinations')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@getDestinations').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/destinations')
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