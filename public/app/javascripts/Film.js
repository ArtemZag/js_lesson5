define(['backbone', 'memento', 'underscore','backboneValidation'], function(backbone, Memento, _, backboneValidation) {
    var Film = backbone.Model.extend({
        initialize: function() {
            var memento = new Memento(this);
            _.extend(this, memento);
            _.extend(this, backboneValidation.mixin);
        },
        url: function() {
            if (this.id === undefined)
                return '/api/films';
            else
                return '/api/films/' + this.id;
        },
        validation: {
            'name': {
                required: true
            }
        },
        defaults: {
            year: 2014,
            name: '',
            id: undefined
        }
    });

    return Film;
});