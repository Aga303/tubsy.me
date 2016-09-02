var Editor = (function() {

    function Editor() {
		this.editorContainer = $("#editor_container");
		this.addButtonContainer = $("#add_button_container");

        this.addPattern(16);
		this.createAddButton();
    }

	Editor.prototype.addPattern = function(steps) {
		var pattern = $('<div></div>');
		this.editorContainer.append(pattern);

		var editorRows = $('<div></div>');
		editorRows.append(this.createTable(steps));
		editorRows.append(this.createTable(steps));
		editorRows.append(this.createTable(steps));
		pattern.append(editorRows);
		editorRows.find($("td")).click(function() {
			$(this).toggleClass("red");
			$(this).toggleClass("cyan");
		});

		var patternDisplay = this.createTable(16);
		pattern.prepend(patternDisplay);
		patternDisplay.click(function() {
			editorRows.toggleClass("hidden");
		});
	}

	Editor.prototype.createTable = function(cells) {
        var table = $('<table class="pattern_row"></table>');
		var tr = $("<tr></tr>");
		for (var i = 0; i < cells; i++) {
			tr.append('<td class="cyan"></td>');
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

	return Editor;

})();
