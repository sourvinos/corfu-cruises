// ng build
export const environment = {
    apiUrl: 'https://localhost:5001/api',
    appName: 'CORFU CRUISES',
    clientUrl: 'https://localhost:4200',
    defaultLanguage: 'en-gb',
    defaultTheme: 'light',
    emailFooter: {
        lineA: 'Problems or questions? Call us at +30 26620 61400',
        lineB: 'or email at info@corfucruises.com',
        lineC: '© Corfu Cruises 2021, Corfu - Greece'
    },
    idleSettings: {
        idle: 3600,
        timeout: 10
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
    production: false,
    scrollWheelSpeed: 0.50
}
