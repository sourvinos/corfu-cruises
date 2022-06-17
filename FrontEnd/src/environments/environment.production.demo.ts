// ng build --output-path="release" --configuration=production-demo

export const environment = {
    apiUrl: 'http://timezones-001-site1.ftempurl.com/api',
    appName: 'CORFU CRUISES DEMO',
    clientUrl: 'http://timezones-001-site1.ftempurl.com',
    defaultLanguage: 'en-GB',
    defaultTheme: 'blue',
    emailFooter: {
        lineA: 'Problems or questions? Call us at +30 26620 61400',
        lineB: 'or email at info@corfucruises.com',
        lineC: '© Corfu Cruises 2022, Corfu - Greece'
    },
    idleSettings: {
        idle: 300,
        timeout: 60
    },
    menuIconDirectory: 'assets/images/menu/',
    isWideScreen: 1920,
    leaflet: {
        token: 'pk.eyJ1Ijoic291cnZpbm9zIiwiYSI6ImNrajEwa3plbDRzY2gzMnFqcXppZzNhaDkifQ.JMR_dEvdaFTpQ2jiapPrhg'
    },
    login: {
        username: 'john',
        email: 'johnsourvinos@hotmail.com',
        password: 'ec11fc8c16da',
        isHuman: true
    },
    newUser: {
        userName: '',
        displayname: '',
        email: '',
        password: '',
        confirmPassword: ''
    },
    production: true,
    scrollWheelSpeed: 0.50
}
