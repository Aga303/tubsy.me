var Editor = (function() {

    function Editor() {
        this.editorContainer = $("#editor_container");
        this.timeSignatureSelectContainer = $("#timesignature_select_container");
        this.addButtonContainer = $("#add_button_container");

        this.addDjembePattern(16,4);
        this.createAddButtons();

    }

    Editor.prototype.addDjembePattern = function(steps, group) {
        var _this = this;
        var pattern = $('<div></div>');
        pattern.addClass('pattern_container animated fadeIn');
        pattern.data("steps",steps);
        pattern.data("group",group);
        pattern.data("type","djembe");
        this.editorContainer.append(pattern);

        var editorRows = $('<div></div>');
        editorRows.addClass("editor_rows animated fadeIn");
        editorRows.append(this.createTable(steps,group));
        editorRows.append(this.createTable(steps,group));
        editorRows.append(this.createTable(steps,group));
        pattern.append(editorRows);
        editorRows.find($("td")).click(function() {
          _this.markCell(this);
        });

        var patternDisplay = this.createTable(steps,group);
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
        patternName.addClass('mdl-textfield mdl-js-textfield pattern-title');
        var patternInput = $('<input></input>');
        patternInput.addClass('mdl-textfield__input');
        patternInput.attr('type','text');
        patternInput.attr('id','fname');
        patternInput.attr('value','Djembe');
        patternName.append(patternInput);
        pattern.prepend(patternName);
        this.scrollToElement(pattern[0]);
    }

    Editor.prototype.addDundunPattern = function(drumType, steps, group) {
        var _this = this;
        var pattern = $('<div></div>');
        pattern.addClass('pattern_container');
        pattern.data("steps",steps);
        pattern.data("group",group);
        pattern.data("type","dundun");
        this.editorContainer.append(pattern);

        var bellRow = $('<div></div>');
        bellRow.append(this.createTable(steps,group));
        bellRow.addClass('bell_row');
        pattern.append(bellRow);
        bellRow.find($("td")).click(function() {
            $(this).toggleClass("selected");
        });

        var drumRow = $('<div></div>');
        drumRow.addClass("drum_row");
        drumRow.append(this.createTable(steps,group));
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
        patternName.addClass('mdl-textfield mdl-js-textfield pattern-title');
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
      var patternName = $(closeButton).siblings(".pattern-title").find("input").val();
      showDialog({
          title: 'Remove pattern ' + patternName + '?',
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

    Editor.prototype.createTable = function(cells,group) {
        var table = $('<table class="pattern_row"></table>');
        var tr = $("<tr></tr>");
        var addBg = false;
        for (var i = 0; i < cells; i++) {
            if (i % group == 0)
                addBg = !addBg;
            if (addBg)
                tr.append('<td class="gray-background"></td>');
            else
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
            _this.createDrumPattern("Djembe");
        });
        addDundunbaButton.click(function() {
            _this.createDrumPattern("Dundunba");
        });
        addSangbanButton.click(function() {
            _this.createDrumPattern("Sangban");
        });
        addKenkeniButton.click(function() {
            _this.createDrumPattern("Kenkeni");
        });
    }


    Editor.prototype.createDrumPattern = function(drumType) {
        _this = this;
        var timeSelector = document.getElementById("timesignature_selector");
        if (timeSelector != null)
            document.getElementById("timesignature_selector").remove();
        var timeSignatureSelectButtons = $('<div id=timesignature_selector></div>');
        this.timeSignatureSelectContainer.append(timeSignatureSelectButtons);
        var select34Button = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">3/4</button>');
        var select44Button = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">4/4</button>');
        var select68Button = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">6/8</button>');
        timeSignatureSelectButtons.append(select34Button);
        timeSignatureSelectButtons.append(select44Button);
        timeSignatureSelectButtons.append(select68Button);
        select34Button.click(function() {
            document.getElementById("timesignature_selector").remove();
            if (drumType == "Djembe")
                _this.addDjembePattern(12,3);
            else
                _this.addDundunPattern(drumType,12,3);
        });
        select44Button.click(function() {
            document.getElementById("timesignature_selector").remove();
            if (drumType == "Djembe")
                _this.addDjembePattern(16,4);
            else
                _this.addDundunPattern(drumType,16,4);
        });
        select68Button.click(function() {
            document.getElementById("timesignature_selector").remove();
            if (drumType == "Djembe")
                _this.addDjembePattern(24,6);
            else
                _this.addDundunPattern(drumType,24,6);
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

    Editor.prototype.exportJSON = function() {
        var json = {"patterns":[]};
        var patterns = $("#editor_container").find(".pattern_container");
        var pattern;
        var row;
        patterns.each(function (index, value) {
            pattern = {};

            pattern.name = $(value).find(".pattern-title > input").val();
            pattern.group = $(value).data('group');
            pattern.length = $(value).data('steps');
            pattern.type = $(value).data('type');

            if (pattern.type == "djembe") {

                pattern.steps = [];
                row = $(value).find('.pattern_display');
                $(row).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected-1'))
                        pattern.steps.push('a');
                    else if ($(value).hasClass('selected-2'))
                        pattern.steps.push('b');
                    else if ($(value).hasClass('selected-3'))
                        pattern.steps.push('c');
                    else
                        pattern.steps.push('0');
                });
            }

            if (pattern.type == "dundun") {
                pattern.steps_bell = [];
                row = $(value).find('.bell_row > .pattern_row');
                $(row).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.steps_bell.push('x');
                    else
                        pattern.steps_bell.push('0');
                });

                pattern.steps_drum = [];
                row = $(value).find('.drum_row > .pattern_row');
                $(row).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected-2'))
                        pattern.steps_drum.push('a');
                    else if ($(value).hasClass('selected-3'))
                        pattern.steps_drum.push('b');
                    else
                        pattern.steps_drum.push('0');
                });
            }
            json.patterns.push(pattern);
        });
    }

    return Editor;

})();
