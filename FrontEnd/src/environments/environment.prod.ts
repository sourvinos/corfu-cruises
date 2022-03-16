// ng build --output-path="\some directory" --configuration=production
export const environment = {
    apiUrl: 'https://appcorfucruises.com/api',
    clientUrl: 'https://appcorfucruises.com',
    appName: 'CORFU CRUISES',
    defaultLanguage: 'en-gb',
    defaultTheme: 'light',
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
}
