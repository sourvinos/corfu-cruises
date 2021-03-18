import './commands'
import './commands-customer'
import './commands-destination'
import './commands-driver'
import './commands-transfer'
import './commands-pickupPoint'
import './commands-port'
import './commands-route'
import './commands-user'

Cypress.on('uncaught:exception', () => {
    return false
})
