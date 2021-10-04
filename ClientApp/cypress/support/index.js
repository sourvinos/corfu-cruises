import './commands'
import './commands-crew'
import './commands-customer'
import './commands-destination'
import './commands-driver'
import './commands-gender'
import './commands-owner'
import './commands-pickupPoint'
import './commands-port'
import './commands-registrar'
import './commands-route'
import './commands-ship-base'
import './commands-ship-route'
import './commands-transfer'
import './commands-user'

Cypress.on('uncaught:exception', () => {
    return false
})
