var Editor = (function() {

    function Editor() {
        this.editorContainer = $("#editor_container");
        this.addButtonContainer = $("#add_button_container");

        this.addPattern(16);
        this.createAddButton();
    }

    Editor.prototype.addPattern = function(steps) {
        var _this = this;
        var pattern = $('<div></div>');
        pattern.addClass('pattern_container');
        this.editorContainer.append(pattern);

        var editorRows = $('<div></div>');
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
            editorRows.toggleClass("hidden");
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

    Editor.prototype.createAddButton = function() {
        _this = this;
        var addButton = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">add pattern</button>');
        this.addButtonContainer.append(addButton);
        addButton.click(function() {
            _this.addPattern(16);
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

    return Editor;

})();
