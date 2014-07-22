angular.module('data-sync', [

])
.value('_', window._)
.value('PubNub', window.PUBNUB)

.factory('$PubNub', function(PubNub, Keys) {

  var pubnub = PubNub.init({
    publish_key:   Keys.pub,
    subscribe_key: Keys.sub,
    // auth_key: 'swag',
    // uuid: 'yolo'
  });

  return pubnub;

})

.factory('Model', function(_, $PubNub) {

  var _cache = {};

  var syncObject = $PubNub.get_synced_object({
    object_id : 'swag_pubnub',
    path      : '',
    callback  : function(data) {
      console.log('Get successful', data);
    },
    error     : function(err) {
      console.log('Get error', err);
    }
  });

  console.log('syncObject', syncObject);

  // $PubNub.set({
  //   object_id : 'swag_pubnub',
  //   data      : {
  //     name: {
  //       first: 'John'
  //     },
  //     age: 20
  //   },
  //   path      : '',
  //   callback  : function(data) {
  //     console.log('Set successful', data);
  //   },
  //   error     : function(err) {
  //     console.log('Set error', err);
  //   }
  // });
  // var counter = 0;

  function Model(data) {
    var cache = _cache[data.id];
    if (cache) return cache;

    var attributes  = _.defaults(data, this._defaults);
    _.extend(this, attributes);
    this.id = $PubNub.uuid();
    this.created_at = new Date();
    _cache[this.id] = this;
  }

  var methods = {

    _defaults: {
      content: ''
    }

  };

  var modelMethods = [
    'keys',
    'values',
    'pairs',
    'invert',
    'pick',
    'omit'
  ];

  _.each(modelMethods, function(method) {
    Model.prototype[method] = function(args) {
      args = Array.prototype.slice.call(arguments);
      args.unshift(this);
      return _[method].apply(_, args);
    };
  });

  _.extend(Model.prototype, methods);

  return Model;

})

.controller('AppCtrl', function($scope, Model, _) {
  var appCtrl = this;

  this.collection = [];

  $scope.add = function(data) {
    if (!data || !data.content) return;

    appCtrl.collection.push(new Model(data));

    delete data.content;
    delete data.id;
  };

  $scope.remove = function(id) {
    var index = _.findIndex(appCtrl.collection, { id: id });
    appCtrl.collection.splice(index, 1);
  };

});
