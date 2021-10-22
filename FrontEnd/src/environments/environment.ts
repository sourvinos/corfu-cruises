// ng build
export const environment = {
    apiUrl: 'https://localhost:5001/api',
    clientUrl: 'https://localhost:4200',
    appName: 'Corfu Cruises',
    emailFooter: {
        lineA: 'Problems or questions? Call us at +30 26620 61400',
        lineB: 'or email at info@corfucruises.com',
        lineC: '© Corfu Cruises 2021, Corfu - Greece'
    },
    isWideScreen: 1920,
    leaflet: {
        token: 'pk.eyJ1Ijoic291cnZpbm9zIiwiYSI6ImNrajEwa3plbDRzY2gzMnFqcXppZzNhaDkifQ.JMR_dEvdaFTpQ2jiapPrhg'
    },
    login: {
        username: 'sourvinos',
        email: 'johnsourvinos@hotmail.com',
        password: '46929e6c-ee70-447a-ba35-542b4be14741',
        isHuman: true
    },
    newUser: {
        username: '',
        displayName: '',
        email: '',
        password: '',
        confirmPassword: ''
    },
    production: false,
}
