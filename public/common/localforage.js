angular.module('localforage', [
  'LocalForageModule'
])
.config(function($localForageProvider) {

  $localForageProvider.config({
    // driver      : 'localStorageWrapper', // if you want to force a driver
    // version     : 1.0, // version of the database, you shouldn't have to use this
    name        : 'pubnub-data-sync', // name of the database and prefix for your data
    storeName   : 'storage', // name of the table
    description : 'Local storage'
  });

});