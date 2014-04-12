Ember.FacebookMixin = Ember.Mixin.create({
  fbUser: undefined,
  fbInitParams: Ember.Object.create(),

  init: function(){
    window.fbAsyncInit = this.fbAsyncInit.bind(this);
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

Ember.FacebookView = Ember.View.extend({
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
