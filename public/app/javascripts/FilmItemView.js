define(['marionette', 'underscore'], function(marionette, _) {
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
            filmYearInput: 'input.film-year-input',
            filmNameErrors: 'span.film-name-errors',
            filmYearErrors: 'span.film-year-errors'
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
            if (this.model.isValid(true)) {
                this.model.store();
                var view = this;
                this.model.save(null, {
                    success: function(model, response) {
                        view.render();
                    }
                });
                this.isEditMode = false;
            }
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

            // По-моему это какой-то костыль. Просто я пока не понял как это сделать правильно и красиво.
            if (this.isEditMode) {
                var errors = this.model.validate();
                if (errors !== undefined) {
                    this.ui.filmNameErrors.text(errors.name);
                    this.ui.filmYearErrors.text(errors.year);
                }
            }

            this.triggerMethod("render", this);
            return this;
        }
    });

    return FilmView;
});