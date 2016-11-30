var Editor = (function() {

    function Editor() {
        this.menuContainer = $("#menu_container");
        this.editorContainer = $("#editor_container");
        this.timeSignatureSelectContainer = $("#timesignature_select_container");
        this.addButtonContainer = $("#add_button_container");

        this.createMenu();
        this.addDjembePattern("Djembe",16,4);
        this.createAddButtons();

    }

    Editor.prototype.createMenu = function() {
        var _this = this;

        var rhythmName = $('<div></div>');
        rhythmName.addClass('mdl-textfield mdl-js-textfield rhythm-title');
        var nameInput = $('<input></input>');
        nameInput.addClass('mdl-textfield__input');
        nameInput.attr('type','text');
        nameInput.attr('id','fname');
        nameInput.attr('value','My rhythm');
        rhythmName.append(nameInput);
        this.menuContainer.append(rhythmName);

        var saveJSONButton = $('<button class="top-menu-button mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect"><i class="material-icons"></i>Save file</button>');
        this.menuContainer.append(saveJSONButton);
        saveJSONButton.click(function() {
             var data = _this.exportJSON();
             var blob = new Blob([data], {type : 'application/json'});
             var url  = window.URL.createObjectURL(blob);

             var a = document.createElement('a');
             document.body.appendChild(a);
             a.download = $('.rhythm-title > input').val().replace(/ /g, "_") + ".tubsy";
             a.href = url;
             a.click(function() {
                  window.URL.revokeObjectURL(url);
             });
             document.body.removeChild(a);
        });

        var loadJSONButton = $('<label class="top-menu-button mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect" for="file-load">Load file</label><input type="file" id="file-load" name="files[]" />');
        this.menuContainer.append(loadJSONButton);
        loadJSONButton.change(function(evt) {
            var files = evt.target.files;
            var f = files[0];
            var reader = new FileReader();
            reader.onload = (function(theFile) {
                return function(e) {
                    _this.importJSON(JSON.parse(e.target.result));
                };
            })(f);
            reader.readAsText(f);
        });
    }

    Editor.prototype.addDjembePattern = function(drumName, steps, group,list) {
        var _this = this;
        var pattern = $('<div></div>');
        pattern.addClass('pattern_container animated fadeIn');
        pattern.data("steps",steps);
        pattern.data("group",group);
        pattern.data("type","djembe");
        this.editorContainer.append(pattern);

        var editorRows = $('<div></div>');
        editorRows.addClass("editor_rows animated fadeIn");
        editorRows.append(this.createTable(steps,group,list,'slap'));
        editorRows.append(this.createTable(steps,group,list,'tone'));
        editorRows.append(this.createTable(steps,group,list,'bass'));
        pattern.append(editorRows);
        editorRows.find($("td")).click(function() {
          _this.markCell(this);
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
        patternInput.attr('value',drumName);
        patternName.append(patternInput);
        pattern.prepend(patternName);
        this.scrollToElement(pattern[0]);
    }

    Editor.prototype.addDundunPattern = function(drumName, steps, group,lists) {
        var _this = this;
        var pattern = $('<div></div>');
        pattern.addClass('pattern_container');
        pattern.data("steps",steps);
        pattern.data("group",group);
        pattern.data("type","dundun");
        this.editorContainer.append(pattern);

        var bellRow = $('<div></div>');
        if (lists != null)
            bellRow.append(this.createTable(steps,group,lists[0],'x'));
        else
            bellRow.append(this.createTable(steps,group,lists,'x'));
        bellRow.addClass('bell_row');
        pattern.append(bellRow);
        bellRow.find($("td")).click(function() {
            $(this).toggleClass("selected");
        });

        var drumRow = $('<div></div>');
        drumRow.addClass("drum_row drum_row_1");
        if (lists != null)
            drumRow.append(this.createTable(steps,group,lists[1],'closed'));
        else
            drumRow.append(this.createTable(steps,group,lists,'closed'));
        pattern.append(drumRow);

        var drumRow2 = $('<div></div>');
        drumRow2.addClass("drum_row drum_row_2");
        if (lists != null)
            drumRow2.append(this.createTable(steps,group,lists[1],'open'));
        else
            drumRow2.append(this.createTable(steps,group,lists,'open'));
        pattern.append(drumRow2);

        drumRow.find($("td")).click(function() {
            $(this).toggleClass("selected");
            var index = $(this).parent().find($("td")).index($(this));
            $(drumRow2.find($("td")).get(index)).removeClass('selected');
        });

        drumRow2.find($("td")).click(function() {
            $(this).toggleClass("selected");
            var index = $(this).parent().find($("td")).index($(this));
            $(drumRow.find($("td")).get(index)).removeClass('selected');
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
        patternInput.attr('value', drumName);
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

    Editor.prototype.createTable = function(cells,group,list,soundtype) {
        var table = $('<table class="pattern_row"></table>');
        var tr = $("<tr></tr>");
        var td;
        var addBg = false;
        for (var i = 0; i < cells; i++) {
            if (i % group == 0)
                addBg = !addBg;
            if (addBg)
                td = $('<td class="gray-background"></td>');
            else
                td = $('<td></td>');
            if (list != null && (list[i]==soundtype))
                td.addClass('selected');
            tr.append(td);
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
        var select128Button = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">12/8</button>');
        timeSignatureSelectButtons.append(select34Button);
        timeSignatureSelectButtons.append(select44Button);
        timeSignatureSelectButtons.append(select68Button);
        timeSignatureSelectButtons.append(select128Button);
        select34Button.click(function() {
            document.getElementById("timesignature_selector").remove();
            if (drumType == "Djembe")
                _this.addDjembePattern(drumType,12,3,null);
            else
                _this.addDundunPattern(drumType,12,3,null);
        });
        select44Button.click(function() {
            document.getElementById("timesignature_selector").remove();
            if (drumType == "Djembe")
                _this.addDjembePattern(drumType,16,4,null);
            else
                _this.addDundunPattern(drumType,16,4,null);
        });
        select68Button.click(function() {
            document.getElementById("timesignature_selector").remove();
            if (drumType == "Djembe")
                _this.addDjembePattern(drumType,24,6,null);
            else
                _this.addDundunPattern(drumType,24,6,null);
        });
        select128Button.click(function() {
            document.getElementById("timesignature_selector").remove();
            if (drumType == "Djembe")
                _this.addDjembePattern(drumType,48,6,null);
            else
                _this.addDundunPattern(drumType,48,6,null);
        });
    }

    Editor.prototype.markCell = function(cell) {
        var index = $(cell).index();
        var selectedRow = $(cell).parents('.pattern_row');
        var rows = $(cell).parents('.pattern_row').siblings();

        for (var i = 0; i < rows.length; i++)
          $(rows[i]).find('td:nth-child('+ (index+1) +')').removeClass('selected');

        $(cell).toggleClass("selected");
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

                pattern.steps = {};
                pattern.steps.drum = [];
                row = $(value).find('.pattern_row');
                $($(row)[0]).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.steps.drum.push('slap');
                    else
                        pattern.steps.drum.push('0');
                });
                $($(row)[1]).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.steps.drum[index] = 'tone';
                });
                $($(row)[2]).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.steps.drum[index] = 'bass';
                });
            }

            if (pattern.type == "dundun") {
                pattern.steps = {};
                pattern.steps.bell = [];
                row = $(value).find('.bell_row > .pattern_row');
                $(row).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.steps.bell.push('x');
                    else
                        pattern.steps.bell.push('0');
                });

                pattern.steps.drum = [];
                row = $(value).find('.drum_row_1 > .pattern_row');
                $(row).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.steps.drum.push('closed');
                    else
                        pattern.steps.drum.push('0');
                });

                row = $(value).find('.drum_row_2 > .pattern_row');
                $(row).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.steps.drum[index] = 'open';
                });
            }
            json.patterns.push(pattern);
	          json.name = $('.rhythm-title > input').val();

        });
        return JSON.stringify(json);
    }

    Editor.prototype.importJSON = function(json) {
        $("#editor_container").find(".pattern_container").remove();
        $('.rhythm-title > input').val(json.name);
        for (var i = 0; i < json.patterns.length; i++) {
            if (json.patterns[i].type == "djembe") {
                _this.addDjembePattern(json.patterns[i].name, json.patterns[i].length, json.patterns[i].group, json.patterns[i].steps.drum);
            }

            if (json.patterns[i].type == "dundun") {
                _this.addDundunPattern(json.patterns[i].name, json.patterns[i].length, json.patterns[i].group, [json.patterns[i].steps.bell, json.patterns[i].steps.drum]);
            }
        }
    }

    return Editor;

})();
