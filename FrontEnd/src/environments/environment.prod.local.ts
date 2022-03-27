// ng build --output-path="\some directory" --configuration=production-local
export const environment = {
    apiUrl: 'https://localhost:1701/api',
    clientUrl: 'https://localhost:1701',
    appName: 'CORFU CRUISES',
    defaultLanguage: 'en-gb',
    defaultTheme: 'light',
    idleSettings: {
        idle: 3600,
        timeout: 60
    },
    emailFooter: {
        lineA: 'Problems or questions? Call us at +30 26620 61400',
        lineB: 'or email at info@corfucruises.com',
        lineC: '© Corfu Cruises 2022, Corfu - Greece'
    },
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
}
