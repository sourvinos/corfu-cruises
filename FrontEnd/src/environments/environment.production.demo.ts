// ng build --output-path="release" --configuration=production-demo

export const environment = {
    apiUrl: 'http://timezones-001-site1.ftempurl.com/api',
    url: 'http://timezones-001-site1.ftempurl.com',
    appName: 'CORFU CRUISES DEMO',
    clientUrl: 'http://timezones-001-site1.ftempurl.com',
    defaultLanguage: 'en-GB',
    defaultTheme: 'light',
    emailFooter: {
        lineA: 'Problems or questions? Call us at +30 26620 61400',
        lineB: 'or email at info@corfucruises.com',
        lineC: '© Corfu Cruises 2022, Corfu - Greece'
    },
    idleSettings: {
        admins: {
            idle: 840,
            timeout: 60
        },
        simpleUsers: {
            idle: 60,
            timeout: 60
        }
    },
    menuIconDirectory: 'assets/images/menu/',
    criteriaIconDirectory: 'assets/images/criteria/',
    isWideScreen: 1920,
    login: {
        username: 'john',
        email: 'johnsourvinos@hotmail.com',
        password: 'ec11fc8c16db',
        noRobot: true
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
