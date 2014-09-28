define('Film',['backbone', 'memento', 'underscore'], function(backbone, Memento, _) {
    var Film = backbone.Model.extend({
        initialize: function() {
            var memento = new Memento(this);
            _.extend(this, memento);
        },
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
            'click input.film-editapprove-button': 'editApprove',
            'keyup input.film-name-input': 'filmNameChange',
            'keyup input.film-year-input': 'filmYearChange'
        },

        ui: {
            filmNameInput: 'input.film-name-input',
            filmYearInput: 'input.film-year-input'
        },

        filmNameChange: function() {
            this.model.set('name', this.ui.filmNameInput.val());
        },
        
        filmYearChange: function() {
            this.model.set('year', this.ui.filmYearInput.val());
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
            this.model.store();
            this.render();
        },

        editCancel: function() {
            this.model.restore();
            this.isEditMode = false;
            if (this.model.id > 0) {
                this.render();
            } else {
                this.remove();
            }
        },

        editApprove: function() {
            this.model.store();
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
            this._ensureViewIsIntact();
            this.triggerMethod("before:render", this);
            if (this.isEditMode) {
                this.$el.html(this.templateEditMode(this.model.toJSON()));
            } else {
                this.$el.html(this.template(this.model.toJSON()));
            }
            this.bindUIElements();
            this.triggerMethod("render",this);
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
        backboneFetchCache: '/bower_components/backbone-fetch-cache/backbone.fetch-cache.min',
        memento: '/bower_components/backbone.memento/backbone.memento.min'
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
        memento: {
            deps: ['backbone'],
            exports: 'Backbone.Memento'
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

