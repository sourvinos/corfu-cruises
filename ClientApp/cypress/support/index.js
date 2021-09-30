import './commands'
import './commands-customer'
import './commands-destination'
import './commands-driver'
import './commands-gender'
import './commands-pickupPoint'
import './commands-port'
import './commands-route'
import './commands-ship-base'
import './commands-transfer'
import './commands-user'

Cypress.on('uncaught:exception', () => {
    return false
})
