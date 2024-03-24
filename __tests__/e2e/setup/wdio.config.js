// wdio config for react-native e2e tests
exports.config = {
    runner: 'local',
    specs: ['../test_cases/**/*.js'],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        maxInstances: 5,
        browserName: 'chrome',
        apiumVersion: '2.5.1',
        platformName: 'Android',
        deviceName: 'emulator-5554',
        app: '/Users/pauliusjarosius/Exprements/MemoGitManipulation/android/app/build/outputs/apk/debug/app-debug.apk',
        automationName: 'UiAutomator2',
    }],
    logLevel: 'info',
    bail: 0,
    baseUrl: 'http://localhost',
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: ['chromedriver', 'appium'],
    framework: 'jest',
    reporters: ['spec'],
    // mochaOpts: {
    //     ui: 'bdd',
    //     timeout: 60000
    // },
    before: function before() {
        require('@babel/register');
    }
};
