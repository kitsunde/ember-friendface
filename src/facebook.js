var Friendface = {};

Friendface.FacebookMixin = Ember.Mixin.create({
  fbUser: undefined,
  // Wait for the FB API to load before initializing ember, this should only
  // be necessary for testing.
  fbDeferReadiness: false,
  fbInitParams: Ember.Object.create(),

  init: function(){
    this._super();
    if(this.fbDeferReadiness){
      this.deferReadiness();
    }
    window.fbAsyncInit = this.fbAsyncInit.bind(this);
    if(window.FB){
      window.fbAsyncInit();
    }
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.type = 'text/javascript';
      js.src = "//connect.facebook.net/en_US/all.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  },
  fbAsyncInit: function(){
    if(this.fbDeferReadiness){
      this.advanceReadiness();
    }

    var params = this.get('fbInitParams');

    FB.init(params);

    this.set('FBLoading', true);

    FB.Event.subscribe('auth.authResponseChange',
      this.updateFacebookUser.bind(this));
  },
  updateFacebookUser: function(response) {
    if(response.status === 'connected'){
      FB.api('/me', function(user) {
        this.set('fbUser', Ember.Object.create(user));
      });
    }else{
      this.setProperties({fbuser: undefined});
    }
  }
});

Friendface.FacebookView = Ember.View.extend({
  /*
   * This have Facebook perform XFBML parsing on each render.
   * */
  didInsertElement: function(){
    Ember.run.scheduleOnce('afterRender', this, function(){
      /*
       * The first time facebook loads it will take care of XFBML
       * parsing anyways, so we don't need to handle that case.
       * */
      if(window.FB){
        FB.XFBML.parse(this.$()[0]);
      }
    });
  }
});

Friendface.AnchorComponent = Ember.Component.extend({
  tagName: 'a',
  attributeBindings: ['href'],
  href: '#'
});

Friendface.FbLoginComponent = Ember.AnchorComponent.extend({
  click: function(){
    FB.login(function(){});
  }
});

Friendface.FbLogoutComponent = Ember.AnchorComponent.extend({
  click: function(){
    FB.logout(function(){});
  }
});
