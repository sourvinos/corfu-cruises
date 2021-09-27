context('Customers', () => {

    before(() => {
        cy.login()
    })

    describe('List', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto the list', () => {
            cy.gotoCustomerList()
        })

        it('The table has an exact number of rows and columns', () => {
            cy.get('[data-cy=row]').should('have.length', 10)
            cy.get('[data-cy=column]').should('have.length', 4)
        })

        it('Filter the table by active records', () => {
            cy.get('[data-cy=filter-active]').click()
            cy.get('[data-cy=row]').should(rows => {
                expect(rows).to.have.length(7)
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
                expect(rows).to.have.length(10)
            })
        })

        it('Filter the table by description', () => {
            cy.get('[data-cy=filter-description]').click().type('travel')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(3)
            })
            cy.get('[data-cy=filter-description]').clear()
        })

        it('Filter the table by email', () => {
            cy.get('[data-cy=filter-email]').click().type('vangeliskar@yahoo.gr')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(1)
            })
            cy.get('[data-cy=filter-email]').clear()
        })

        it('Filter the table by phone', () => {
            cy.get('[data-cy=filter-phones]').click().type('76768')
            cy.get('[data-cy=row]').should((rows) => {
                expect(rows).to.have.length(1)
            })
            cy.get('[data-cy=filter-phones]').clear()
        })

        it('Goto the home page', () => {
            cy.get('.vertical-menu > .p-panelmenu > :nth-child(1) > .p-component > .p-panelmenu-header-link').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    describe.skip('Create', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoCustomerList()
            cy.gotoEmptyCustomerForm()
        })

        it('Description is valid', () => {
            cy.typeRandomChars('description', 12).elementShouldBeValid('description')
        })

        it('Form is valid', () => {
            cy.buttonShouldBeEnabled('save')
        })

        it('Create record', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/customers', 'fixture:customers/customers.json').as('getCustomers')
            cy.route('POST', Cypress.config().baseUrl + '/api/customers', 'fixture:customers/customer.json').as('saveCustomer')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveCustomer').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/customers')
        })

        it('Goto the home page', () => {
            cy.get('[data-cy=goBack]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    describe.skip('Update', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoCustomerList()
            cy.readCustomerRecord()
        })

        it('Update record', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/customers', 'fixture:customers/customers.json').as('getCustomers')
            cy.route('PUT', Cypress.config().baseUrl + '/api/customers/22', 'fixture:customers/customer.json').as('saveCustomer')
            cy.get('[data-cy=save]').click()
            cy.wait('@saveCustomer').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/customers')
        })

        it('Goto the home page', () => {
            cy.get('[data-cy=goBack]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    describe.skip('Delete', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Read record', () => {
            cy.gotoCustomerList()
            cy.readCustomerRecord()
        })

        it('Ask to delete and abort', () => {
            cy.clickOnDeleteAndAbort()
            cy.url().should('eq', Cypress.config().baseUrl + '/customers/22')
        })

        it('Ask to delete and continue', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/customers', 'fixture:customers/customers.json').as('getCustomers')
            cy.route('DELETE', Cypress.config().baseUrl + '/api/customers/22', 'fixture:customers/customer.json').as('deleteCustomer')
            cy.get('[data-cy=delete]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@deleteCustomer').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/customers')
        })

        it('Goto the home page', () => {
            cy.get('[data-cy=goBack]').click()
            cy.url().should('eq', Cypress.config().baseUrl + '/')
        })

        afterEach(() => {
            cy.saveLocalStorage()
        })

    })

    describe.skip('Validate', () => {

        beforeEach(() => {
            cy.restoreLocalStorage()
        })

        it('Goto an empty form', () => {
            cy.gotoCustomerList()
            cy.gotoEmptyCustomerForm()
        })

        it('Correct number of fields', () => {
            cy.get('[data-cy=form]').find('.mat-form-field').should('have.length', 6)
            cy.get('[data-cy=form]').find('.mat-slide-toggle').should('have.length', 1)
        })

        it('Description is not valid when blank', () => {
            cy.typeRandomChars('description', 0).elementShouldBeInvalid('description')
        })

        it('Description is not valid when too long', () => {
            cy.typeRandomChars('description', 129).elementShouldBeInvalid('description')
        })

        it('Profession is not valid when too long', () => {
            cy.typeRandomChars('profession', 129).elementShouldBeInvalid('profession')
        })

        it('Address is not valid when too long', () => {
            cy.typeRandomChars('address', 129).elementShouldBeInvalid('address')
        })

        it('Phones is not valid when too long', () => {
            cy.typeRandomChars('phones', 129).elementShouldBeInvalid('phones')
        })

        it('Person in charge is not valid when too long', () => {
            cy.typeRandomChars('personInCharge', 129).elementShouldBeInvalid('personInCharge')
        })

        it('Email is not valid', () => {
            cy.typeRandomChars('email', 12).elementShouldBeInvalid('email')
        })

        it('Email is not valid when too long', () => {
            cy.typeRandomChars('email', 129).elementShouldBeInvalid('email')
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
            cy.url().should('eq', Cypress.config().baseUrl + '/customers/new')
        })

        it('Choose to abort when the back icon is clicked', () => {
            cy.server()
            cy.route('GET', Cypress.config().baseUrl + '/api/customers', 'fixture:customers/customers.json').as('getCustomers')
            cy.get('[data-cy=goBack]').click()
            cy.get('.mat-dialog-container')
            cy.get('[data-cy=dialog-ok]').click()
            cy.wait('@getCustomers').its('status').should('eq', 200)
            cy.url().should('eq', Cypress.config().baseUrl + '/customers')
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