// ng build --output-path="release" --configuration=production-live

export const environment = {
    apiUrl: 'https://appcorfucruises.com/api',
    url: 'https://appcorfucruises.com',
    appName: 'CORFU CRUISES',
    clientUrl: 'https://appcorfucruises.com',
    defaultLanguage: 'en-GB',
    defaultTheme: 'light',
    emailFooter: {
        lineA: 'Problems or questions? Call us at +30 26620 61400',
        lineB: 'or email at info@corfucruises.com',
        lineC: '© Corfu Cruises 2021, Corfu - Greece'
    },
    idleSettings: {
        idle: 900,
        timeout: 60
    },
    menuIconDirectory: 'assets/images/menu/',
    isWideScreen: 1920,
    leaflet: {
        token: 'pk.eyJ1Ijoic291cnZpbm9zIiwiYSI6ImNrajEwa3plbDRzY2gzMnFqcXppZzNhaDkifQ.JMR_dEvdaFTpQ2jiapPrhg'
    },
    login: {
        username: '',
        email: '',
        password: '',
        isHuman: false
    },
    newUser: {
        userName: '',
        displayname: '',
        email: '',
        password: '',
        confirmPassword: ''
    },
    production: true,
    scrollWheelSpeed: 0.50,
}
