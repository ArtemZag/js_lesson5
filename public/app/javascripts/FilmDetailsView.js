define(['marionette', 'underscore', 'jquery', 'backboneFetchCache'], function(marionette, underscore, jquery, backboneFetchCache) {
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