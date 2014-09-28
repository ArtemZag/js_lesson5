define(['backbone', 'memento', 'underscore'], function(backbone, Memento, _) {
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