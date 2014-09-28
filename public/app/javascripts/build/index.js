define('Film',['backbone'], function(backbone) {
    var Film = backbone.Model.extend({
        url: function() {
            if (this.id === undefined)
                return '/api/films';
            else
                return '/api/films/' + this.id;
        },
        defaults: {
            year: 2014,
            name: '',
            id: undefined
        }
    });

    return Film;
});
define('FilmCollection',['backbone', 'Film'], function(backbone, Film) {
    var FilmCollection = backbone.Collection.extend({
        url: '/api/films',
        model: Film
    });

    return FilmCollection;
});
define('FilmItemView',['marionette', 'underscore'], function(marionette, _) {
    var FilmView = marionette.ItemView.extend({
        className: 'film-container',
        template: _.template($('#film-template').html()),
        templateEditMode: _.template($('#film-template-edit').html()),

        events: {
            'click input.film-delete-button': 'delete',
            'click input.film-edit-button': 'edit',
            'click input.film-editcancel-button': 'editCancel',
            'click input.film-editapprove-button': 'editApprove'
        },

        behaviors: {
            BorderOnHoverBehavior: {}
        },

        initialize: function() {
            this.listenTo(this.model, 'destroy', this.remove);
            this.listenTo(this.model, 'change:id', this.render);
            this.render();
        },

        edit: function() {
            this.isEditMode = true;
            this.render();
        },

        editCancel: function() {
            this.isEditMode = false;
            if (this.model.id > 0) {
                this.render();
            } else {
                this.remove();
            }
        },

        editApprove: function() {
            this.model.set('name', this.$('input.film-name-input').val());
            this.model.set('year', this.$('input.film-year-input').val());
            var view = this;
            this.model.save(null, {
                success: function(model, response) {
                    view.render();
                }
            });
            this.isEditMode = false;
            this.render();
        },

        delete: function() {
            this.model.destroy();
        },

        render: function() {
            if (this.isEditMode) {
                this.$el.html(this.templateEditMode(this.model.toJSON()));
            } else {
                this.$el.html(this.template(this.model.toJSON()));
            }
            return this;
        }
    });

    return FilmView;
});
define('FilmCollectionView',['marionette', 'FilmItemView'], function(marionette, FilmItemView) {
    var FilmCollectionView = marionette.CollectionView.extend({
        childView: FilmItemView,

        initialize: function() {
            this.render();
        },

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        }
    });

    return FilmCollectionView;
});
define('AddFilmButtonView',['marionette'], function(marionette) {
	var AddFilmButtonView = marionette.ItemView.extend( {
		template: '#add-film-button-template',
		events: {
			'click' : 'addFilm'
		},
		addFilm: function() {
			this.trigger('addFilmClick');
		},
		initialize: function() {
			this.render();
		},
        show: function() {
            this.$el.show();
        },
        hide: function() {
            this.$el.hide();
        }
	});

	return AddFilmButtonView;
});
define('PageFilmListView',['marionette', 'FilmCollection', 'FilmCollectionView', 'AddFilmButtonView'],
    function(marionette, FilmCollection, FilmCollectionView, AddFilmButtonView) {

        var PageFilmListView = marionette.ItemView.extend({
            template: "#page-film-list-template",
            initialize: function() {
                var pageView = this;
                this.filmCollection = new FilmCollection();
                this.filmCollectionView = new FilmCollectionView({
                    collection: this.filmCollection
                });

                // Никита: Очевидно, что AddFilmButtonView не должно иметь доступа к коллекции фильмов. Можно послать ивент в медиатор, например.
                // От себя: Не люблю медиаторы :) Сделал ивент напрямую.
                this.addFilmButtonView = new AddFilmButtonView();
                this.addFilmButtonView.on('addFilmClick', function() {
                    pageView.filmCollection.create();
                });
            },

            ui: {
                filmsContainer: '#films-container',
                addFilmButtonContainer: '#add-film-button-container'
            },

            onRender: function(options) {
                this.ui.filmsContainer.append(this.filmCollectionView.$el);
                this.ui.addFilmButtonContainer.append(this.addFilmButtonView.$el);
            },

            fetch: function() {
                this.filmCollection.fetch();
            }
        });

        return PageFilmListView;
    });
define('FilmDetails',['backbone'], function(backbone) {
    var FilmDetails = backbone.Model.extend({
        url: function() {
            if (this.id === undefined)
                return '/api/filmdetails';
            else
                return '/api/filmdetails/' + this.id;
        },
        defaults: {
            poster: '',
            year: 2014,
            name: '',
            id: undefined,
            details1: "",
            details2: "",
            details3: "",
            details4: "",
            details5: "",
            details6: "",
            details7: "",
            details8: "",
        }
    });

    return FilmDetails;
});
/*  backbone.fetch-cache v1.4.0 (2014-02-16)
  by Andy Appleton - https://github.com/mrappleton/backbone-fetch-cache.git
 */
(function(e,c){"function"==typeof define&&define.amd?define('backboneFetchCache',["underscore","backbone","jquery"],function(_,Backbone,t){return e.Backbone=c(_,Backbone,t)}):e.Backbone=c(e._,e.Backbone,e.jQuery)})(this,function(_,Backbone,e){function c(c,t){var a;return(a=t&&t.url?t.url:_.isFunction(c.url)?c.url():c.url)?t&&t.data?a+"?"+e.param(t.data):a:void 0}function t(e,c,t){c=c||{};var a=Backbone.fetchCache.getCacheKey(e,c),h=!1;a&&c.cache!==!1&&(c.cache||c.prefill)&&(c.expires!==!1&&(h=(new Date).getTime()+1e3*(c.expires||300)),Backbone.fetchCache._cache[a]={expires:h,value:t},Backbone.fetchCache.setLocalStorage())}function a(e){_.isFunction(e)&&(e=e()),delete Backbone.fetchCache._cache[e],Backbone.fetchCache.setLocalStorage()}function h(){if(n&&Backbone.fetchCache.localStorage)try{localStorage.setItem(Backbone.fetchCache.getLocalStorageKey(),JSON.stringify(Backbone.fetchCache._cache))}catch(e){var c=e.code||e.number||e.message;if(22!==c)throw e;this._deleteCacheWithPriority()}}function r(){if(n&&Backbone.fetchCache.localStorage){var e=localStorage.getItem(Backbone.fetchCache.getLocalStorageKey())||"{}";Backbone.fetchCache._cache=JSON.parse(e)}}function i(e){return window.setTimeout(e,0)}var o={modelFetch:Backbone.Model.prototype.fetch,modelSync:Backbone.Model.prototype.sync,collectionFetch:Backbone.Collection.prototype.fetch},n=function(){var e=window.localStorage!==void 0;if(e)try{localStorage.setItem("test_support","test_support"),localStorage.removeItem("test_support")}catch(c){e=!1}return e}();return Backbone.fetchCache=Backbone.fetchCache||{},Backbone.fetchCache._cache=Backbone.fetchCache._cache||{},Backbone.fetchCache.priorityFn=function(e,c){return e&&e.expires&&c&&c.expires?e.expires-c.expires:e},Backbone.fetchCache._prioritize=function(){var e=_.values(this._cache).sort(this.priorityFn),c=_.indexOf(_.values(this._cache),e[0]);return _.keys(this._cache)[c]},Backbone.fetchCache._deleteCacheWithPriority=function(){Backbone.fetchCache._cache[this._prioritize()]=null,delete Backbone.fetchCache._cache[this._prioritize()],Backbone.fetchCache.setLocalStorage()},Backbone.fetchCache.getLocalStorageKey=function(){return"backboneCache"},Backbone.fetchCache.localStorage===void 0&&(Backbone.fetchCache.localStorage=!0),Backbone.Model.prototype.fetch=function(c){function t(){c.parse&&(n=l.parse(n,c)),l.set(n,c),_.isFunction(c.prefillSuccess)&&c.prefillSuccess(l,n,c),l.trigger("cachesync",l,n,c),l.trigger("sync",l,n,c),c.prefill?s.notify(l):(_.isFunction(c.success)&&c.success(l,n,c),s.resolve(l))}c=_.defaults(c||{},{parse:!0});var a=Backbone.fetchCache.getCacheKey(this,c),h=Backbone.fetchCache._cache[a],r=!1,n=!1,s=new e.Deferred,l=this;return h&&(r=h.expires,r=r&&h.expires<(new Date).getTime(),n=h.value),r||!c.cache&&!c.prefill||!n||(null==c.async&&(c.async=!0),c.async?i(t):t(),c.prefill)?(o.modelFetch.apply(this,arguments).done(_.bind(s.resolve,this,this)).done(_.bind(Backbone.fetchCache.setCache,null,this,c)).fail(_.bind(s.reject,this,this)),s):s},Backbone.Model.prototype.sync=function(e,c,t){if("read"===e)return o.modelSync.apply(this,arguments);var h,r,i=c.collection,n=[];for(n.push(Backbone.fetchCache.getCacheKey(c,t)),i&&n.push(Backbone.fetchCache.getCacheKey(i)),h=0,r=n.length;r>h;h++)a(n[h]);return o.modelSync.apply(this,arguments)},Backbone.Collection.prototype.fetch=function(c){function t(){l[c.reset?"reset":"set"](n,c),_.isFunction(c.prefillSuccess)&&c.prefillSuccess(l),l.trigger("cachesync",l,n,c),l.trigger("sync",l,n,c),c.prefill?s.notify(l):(_.isFunction(c.success)&&c.success(l,n,c),s.resolve(l))}c=_.defaults(c||{},{parse:!0});var a=Backbone.fetchCache.getCacheKey(this,c),h=Backbone.fetchCache._cache[a],r=!1,n=!1,s=new e.Deferred,l=this;return h&&(r=h.expires,r=r&&h.expires<(new Date).getTime(),n=h.value),r||!c.cache&&!c.prefill||!n||(null==c.async&&(c.async=!0),c.async?i(t):t(),c.prefill)?(o.collectionFetch.apply(this,arguments).done(_.bind(s.resolve,this,this)).done(_.bind(Backbone.fetchCache.setCache,null,this,c)).fail(_.bind(s.reject,this,this)),s):s},r(),Backbone.fetchCache._superMethods=o,Backbone.fetchCache.setCache=t,Backbone.fetchCache.getCacheKey=c,Backbone.fetchCache.clearItem=a,Backbone.fetchCache.setLocalStorage=h,Backbone.fetchCache.getLocalStorage=r,Backbone});
define('FilmDetailsView',['marionette', 'underscore', 'jquery', 'backboneFetchCache'], function(marionette, underscore, jquery, backboneFetchCache) {
	var FilmDetailsView = marionette.ItemView.extend({
		template: _.template($('#film-details-template').html()),

		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.render();
		},

		fetchById: function(filmId) {			
            this.model.id = filmId;
            this.model.fetch({cache: true});
            // this.model.fetch();
		},

        show: function() {
            this.$el.show();
        },

        hide: function() {
            this.$el.hide();
        }
	});

	return FilmDetailsView;
});
define('PageFilmDetailsView',['marionette', 'FilmDetails', 'FilmDetailsView'], function(marionette, FilmDetails, FilmDetailsView) {
    var PageFilmDetailsView = marionette.ItemView.extend({
        initialize: function() {
            this.filmDetailsView = new FilmDetailsView({
                model: new FilmDetails()
            });
        },
        template: "#page-film-details-template",
        ui: {
            filmDetailsContainer: '#film-details-container'
        },
        fetchById: function(filmId) {
			this.filmDetailsView.fetchById(filmId);
        },
        onRender: function() {
            this.ui.filmDetailsContainer.append(this.filmDetailsView.$el);
        }
    });

    return PageFilmDetailsView;
});
define('borderOnHoverBehavior',['marionette'], function(marionette) {
    return marionette.Behavior.extend({
        defaults: {
            width: '1px',
            color: 'red',
            style: 'solid'
        },

        events: {
            'mouseenter': 'onMouseEnter',
            'mouseleave': 'onMouseLeave'
        },

        onMouseEnter: function() {            
            this.previousWidth = this.$el.css('border-width');
            this.previousColor = this.$el.css('border-color');
            this.previousStyle = this.$el.css('border-style');
            this.$el.css('border-width', this.options.width);
            this.$el.css('border-color', this.options.color);
            this.$el.css('border-style', this.options.style);
        },

        onMouseLeave: function() {            
            this.$el.css('border-width', this.previousWidth);
            this.$el.css('border-color', this.previousColor);
            this.$el.css('border-style', this.previousStyle);
        }
    });
});
require.config({
    baseUrl: "/app/javascripts",
    paths: {
        Film: "Film",
        FilmDetails: "FilmDetails",
        FilmCollection: "FilmCollection",
        FilmUtemView: "FilmItemView",
        FilmCollectionView: "FilmCollectionView",
        borderOnHoverBehavior: "borderOnHoverBehavior",
        AddFilmButtonView: "AddFilmButtonView",
        PageFilmListView: "PageFilmListView",
        PageFilmDetailsView: "PageFilmDetailsView",
        jquery: "/bower_components/jquery/dist/jquery",
        underscore: "/bower_components/underscore/underscore",
        backbone: "/bower_components/backbone/backbone",
        requirejs: "/bower_components/requirejs/require",
        marionette: '/bower_components/backbone.marionette/lib/backbone.marionette.min',
        backboneFetchCache: '/bower_components/backbone.fetch-cache/backbone.fetch-cache.min'
    },
    shim: {
        backbone: {
            deps: ["underscore", "jquery"],
            exports: "Backbone"
        },
        backboneFetchCache: {
            deps: ['backbone'],
            exports: 'Backbone'
        },
        marionette: {
            deps: ['backbone'],
            exports: 'Backbone.Marionette'
        },
        jquery: {
            exports: "jQuery"
        },
        underscore: {
            exports: "_"
        }
    },
    waitSeconds: 15,
    packages: []
});

require(['backbone', 'marionette', 'PageFilmListView', 'PageFilmDetailsView', 'borderOnHoverBehavior'],
    function(backbone, marionette, PageFilmListView, PageFilmDetailsView, borderOnHoverBehavior) {

        var behaviors = {
            BorderOnHoverBehavior: borderOnHoverBehavior
        };

        marionette.Behaviors.behaviorsLookup = function() {
            return behaviors;
        };

        var myApp = new marionette.Application();
        myApp.addRegions({
            appRegion: '#page-container'
        });

        var Controller = backbone.Router.extend({
            routes: {
                "": 'showIndex',
                "FilmDetails/:filmId": 'showFilmDetails'
            },
            showIndex: function() {
                var pageFilmListView = new PageFilmListView();
                pageFilmListView.fetch();
                myApp.appRegion.show(pageFilmListView);
            },
            showFilmDetails: function(filmId) {
                var pageFilmDetailsView = new PageFilmDetailsView();
                pageFilmDetailsView.fetchById(filmId);
                myApp.appRegion.show(pageFilmDetailsView);
            }
        });

        var controller = new Controller();

        backbone.history.start();
    });
define("index", function(){});

