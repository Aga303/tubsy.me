var Editor = (function() {

    function Editor() {
        this.editorContainer = $("#editor_container");
        this.addButtonContainer = $("#add_button_container");

        this.addDjembePattern(16);
        this.createAddButtons();
    }

    Editor.prototype.addDjembePattern = function(steps) {
        var _this = this;
        var pattern = $('<div></div>');
        pattern.addClass('pattern_container animated fadeIn');
        this.editorContainer.append(pattern);

        var editorRows = $('<div></div>');
        editorRows.addClass("editor_rows animated fadeIn");
        editorRows.append(this.createTable(steps));
        editorRows.append(this.createTable(steps));
        editorRows.append(this.createTable(steps));
        pattern.append(editorRows);
        editorRows.find($("td")).click(function() {
          _this.markCell(this);
        });

        var patternDisplay = this.createTable(16);
        patternDisplay.addClass('pattern_display');
        pattern.prepend(patternDisplay);
        patternDisplay.click(function() {
          editorRows.toggleClass("fadeIn hidden");
        });

        var closeButton = $('<button><i class="material-icons">close</i></button>');
        closeButton.addClass('close-btn mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab');
        pattern.prepend(closeButton);
        closeButton.click(function() {
            _this.showRemovePatternDialog(this);
        });

        var patternName = $('<div></div>');
        patternName.addClass('mdl-textfield mdl-js-textfield');
        var patternInput = $('<input></input>');
        patternInput.addClass('mdl-textfield__input');
        patternInput.attr('type','text');
        patternInput.attr('id','fname');
        patternInput.attr('value','Djembe');
        patternName.append(patternInput);
        pattern.prepend(patternName);
        this.scrollToElement(pattern[0]);
    }

    Editor.prototype.addDundunPattern = function(drumType, steps) {
        var _this = this;
        var pattern = $('<div></div>');
        pattern.addClass('pattern_container');
        this.editorContainer.append(pattern);

        var bellRow = $('<div></div>');
        bellRow.append(this.createTable(steps));
        bellRow.addClass('bell_row');
        pattern.append(bellRow);
        bellRow.find($("td")).click(function() {
          $(this).toggleClass("selected");
        });

        var drumRow = $('<div></div>');
        drumRow.addClass("drum_row");
        drumRow.append(this.createTable(steps));
        pattern.append(drumRow);
        drumRow.find($("td")).click(function() {
            if ($(this).hasClass("selected-2")) {
                $(this).removeClass("selected-2");
                $(this).addClass("selected-3");
                return;
            }
            if ($(this).hasClass("selected-3")) {
                $(this).removeClass("selected-3");
                return;
            }
            $(this).addClass("selected-2");
        });

        var closeButton = $('<button><i class="material-icons">close</i></button>');
        closeButton.addClass('close-btn mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab');
        pattern.prepend(closeButton);
        closeButton.click(function() {
            _this.showRemovePatternDialog(this);
        });

        var patternName = $('<div></div>');
        patternName.addClass('mdl-textfield mdl-js-textfield');
        var patternInput = $('<input></input>');
        patternInput.addClass('mdl-textfield__input');
        patternInput.attr('type','text');
        patternInput.attr('value', drumType);
        patternName.append(patternInput);
        pattern.prepend(patternName);
        this.scrollToElement(pattern[0]);
    }

    Editor.prototype.removePattern = function(closeButton) {
      $(closeButton).parents(".pattern_container").remove();
    }

    Editor.prototype.showRemovePatternDialog = function(closeButton) {
      var _this = this;
      showDialog({
          title: 'Remove pattern?',
          positive: {
              title: 'Yes, remove!',
              onClick: function (e) {
                  _this.removePattern(closeButton);
              }
          },
          negative: {
              title: 'No'
          }
      });
    }

    Editor.prototype.createTable = function(cells) {
        var table = $('<table class="pattern_row"></table>');
        var tr = $("<tr></tr>");
        for (var i = 0; i < cells; i++) {
            tr.append('<td></td>');
        }
        table.append(tr);
        return table;
    }

    Editor.prototype.createAddButtons = function() {
        _this = this;
        var addDjembeButton = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"><i class="material-icons">add</i>djembe</button>');
        var addDundunbaButton = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"><i class="material-icons">add</i>dundunba</button>');
        var addSangbanButton = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"><i class="material-icons">add</i>sangban</button>');
        var addKenkeniButton = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"><i class="material-icons">add</i>kenkeni</button>');
        this.addButtonContainer.append(addDjembeButton);
        this.addButtonContainer.append(addDundunbaButton);
        this.addButtonContainer.append(addSangbanButton);
        this.addButtonContainer.append(addKenkeniButton);
        addDjembeButton.click(function() {
            _this.addDjembePattern(16);
        });
        addDundunbaButton.click(function() {
            _this.addDundunPattern("Dundunba", 16);
        });
        addSangbanButton.click(function() {
            _this.addDundunPattern("Sangban", 16);
        });
        addKenkeniButton.click(function() {
            _this.addDundunPattern("Kenkeni", 16);
        });
    }

    Editor.prototype.markCell = function(cell) {
        var index = $(cell).index();
        var selectedRow = $(cell).parents('.pattern_row');
        var rows = selectedRow.siblings();
        var titleRow = $(cell).parents('.pattern_container').find('.pattern_row');
        var titleRowCell = $(titleRow[0]).find('td:nth-child('+ (index+1) +')');

        for (var i = 0; i < rows.length; i++)
          $(rows[i]).find('td:nth-child('+ (index+1) +')').removeClass('selected');

        for (var i = 1; i < 4; i++)
          titleRowCell.removeClass('selected-'+i);

        $(cell).toggleClass("selected");
        if ($(cell).hasClass('selected'))
          titleRowCell.addClass('selected-'+(selectedRow.index()+1));
    }

    Editor.prototype.scrollToElement = function(element) {
        element.scrollIntoView({ behavior: "smooth",block: "start"});
    }

    return Editor;

})();
