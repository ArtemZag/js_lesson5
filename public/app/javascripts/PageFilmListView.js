define(['marionette', 'FilmCollection', 'FilmCollectionView', 'AddFilmButtonView'],
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