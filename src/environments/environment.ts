// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig : {
    apiKey: 'AIzaSyBe3xIEN659DpsbM2_pxBRPmn_Iptxh980',
    authDomain: 'sk-traders-509b1.firebaseapp.com',
    databaseURL: 'https://sk-traders-509b1.firebaseio.com',
    projectId: 'sk-traders-509b1',
    storageBucket: 'sk-traders-509b1.appspot.com',
    messagingSenderId: '102149414781',
    appId: '1:102149414781:web:8692971764ad342afff614',
    measurementId: 'G-8BZWD82KGZ'
  },
  apiUrl: 'http://localhost:3000'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
