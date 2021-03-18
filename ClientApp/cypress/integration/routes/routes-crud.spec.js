context('Routes', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoRouteList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 2)
            cy.get('[data-cy=column]').should('have.length', 5)
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
            cy.gotoRouteList()
            cy.gotoEmptyRouteForm()
        })

        it('Abbreviation is valid', () => {
            cy.typeRandomChars('abbreviation', 5).elementShouldBeValid('abbreviation')
        })

        it('Description is valid', () => {
            cy.typeRandomChars('description', 25).elementShouldBeValid('description')
        })

        it('Port is valid', () => {
            cy.typeNotRandomChars('portDescription', 'corfu').then(() => {
                cy.get('#dialog').within(() => {
                    cy.get('input[type=text]')
                        .type('{enter}', { force: true })
                })
            })
        })

        it('Form is valid', () => {
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/routes', 'fixture:routes/routes.json').as('getRoutes')
            cy.route('POST', Cypress.config().baseUrl + '/api/routes', 'fixture:routes/route.json').as('saveRoute')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveRoute').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/routes')
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
            cy.gotoRouteList()
            cy.readRouteRecord()
        })

        it('Update record', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/routes', 'fixture:routes/routes.json').as('getRoutes')
            cy.route('PUT', Cypress.config().baseUrl + '/api/routes/19', 'fixture:routes/route.json').as('saveRoute')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveRoute').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/routes')
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
            cy.gotoRouteList()
            cy.readRouteRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().baseUrl + '/routes/19')
        })

        it('Ask to delete and continue', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/routes', 'fixture:routes/routes.json').as('getRoutes')
            cy.route('DELETE', Cypress.config().baseUrl + '/api/routes/19', 'fixture:routes/route.json').as('deleteRoute')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteRoute').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/routes')
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
            cy.gotoRouteList()
            cy.gotoEmptyRouteForm()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 3)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 1)
        })

        it('Abbreviation is not valid when blank', () => {
            cy.typeRandomChars('abbreviation', 0).elementShouldBeInvalid('abbreviation')
        })

        it('Abbreviation is not valid when too long', () => {
            cy.typeRandomChars('abbreviation', 11).elementShouldBeInvalid('abbreviation')
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
            cy.url().should('eq', Cypress.config().baseUrl + '/routes/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/routes', 'fixture:routes/routes.json').as('getRoutes')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@getRoutes').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/routes')
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