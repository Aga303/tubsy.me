var Editor = (function() {

    function Editor() {
        this.menuContainer = $("#menu_container");
        this.editorContainer = $("#editor_container");
        this.timeSignatureSelectContainer = $("#timesignature_select_container");
        this.addButtonContainer = $("#add_button_container");

        this.createMenu();
        this.addDjembePattern("Djembe",16,4);
        this.createAddButtons();
        if (localStorage.tubsyme)
            this.importJSON(JSON.parse(localStorage.tubsyme));
        setInterval(this.saveToLocalStorage, 10000);
    }

    Editor.prototype.createMenu = function() {
        var _this = this;

        document.getElementById("close-main-menu").onclick = function() {
            $( '.mdl-layout__drawer, .mdl-layout__obfuscator' ).removeClass( 'is-visible' );
        };

        var rhythmName = $('<div></div>');
        rhythmName.addClass('mdl-textfield mdl-js-textfield rhythm-title');
        var nameInput = $('<input></input>');
        nameInput.addClass('mdl-textfield__input ');
        nameInput.attr('type','text');
        nameInput.attr('id','fname');
        nameInput.attr('value','My rhythm');
        rhythmName.append(nameInput);
        $(".mdl-layout__header-row").append(rhythmName);

        var newRhythmButton = $('<button class="top-menu-button mdl-button mdl-js-button mdl-js-ripple-effect"><i class="material-icons"></i>New Rhythm</button>');
        $(".main-menu").append(newRhythmButton);
        newRhythmButton.click(function() {
            _this.clearRhythm();
        });

        var saveJSONButton = $('<button class="top-menu-button mdl-button mdl-js-button mdl-js-ripple-effect"><i class="material-icons"></i>Save file</button>');
        $(".main-menu").append(saveJSONButton);
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

        var loadJSONButton = $('<label class="top-menu-button mdl-button mdl-js-button mdl-js-ripple-effect" for="file-load">Load file</label><input type="file" id="file-load" name="files[]" />');
        $(".main-menu").append(loadJSONButton);
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

    Editor.prototype.clearRhythm = function() {
        var _this = this;
        showDialog({
            title: 'Remove all patterns?',
            positive: {
                title: 'Yes, remove!',
                onClick: function (e) {
                    $('.pattern_container').remove();
                    $('.rhythm-title > input').val('My rhythm');
                    $('.mdl-layout__drawer, .mdl-layout__obfuscator').removeClass( 'is-visible' );
                }
            },
            negative: {
                title: 'No'
            }
        });
    }

    Editor.prototype.saveToLocalStorage = function() {
        if (typeof(Storage) !== "undefined") {
            var data = _this.exportJSON();
            localStorage.setItem("tubsyme", data);
        }
    }

    Editor.prototype.addDjembePattern = function(drumName, steps, group,lists) {
        var timeStamp = new Date().getTime();
        var _this = this;
        var pattern = $('<div></div>');
        pattern.addClass('pattern_container animated fadeIn');
        pattern.data("steps",steps);
        pattern.data("group",group);
        pattern.data("type","djembe");
        this.editorContainer.append(pattern);

        var editorRows = $('<div></div>');
        editorRows.addClass("editor_rows animated fadeIn");
        if (lists != null) {
            editorRows.append(this.createTable(steps,group,lists[0],'slap'));
            editorRows.append(this.createTable(steps,group,lists[1],'tone'));
            editorRows.append(this.createTable(steps,group,lists[2],'bass'));
        } else {
            editorRows.append(this.createTable(steps,group,lists,'slap'));
            editorRows.append(this.createTable(steps,group,lists,'tone'));
            editorRows.append(this.createTable(steps,group,lists,'bass'));
        }

        pattern.append(editorRows);
        editorRows.find($("td")).click(function() {
          _this.markCell(this);
        });

        var closeMenu = $('<ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" data-mdl-for="menu'+timeStamp+'"></ul>');
        closeMenu.addClass('mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect');

        var closeButton = $('<li class="mdl-menu__item">remove pattern</li>');
        closeMenu.append(closeButton);

        pattern.append(closeMenu);

        var menuButton = $('<button id="menu'+timeStamp+'"><i class="material-icons">more_vert</i></button>');
        menuButton.addClass('close-btn mdl-button mdl-js-button mdl-button--icon mdl-button--fab mdl-button--mini-fab');

        pattern.prepend(menuButton);
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
        componentHandler.upgradeAllRegistered();
        this.scrollToElement(pattern[0]);
    }

    Editor.prototype.addDundunPattern = function(drumName, steps, group,lists) {
        var timeStamp = new Date().getTime();
        var _this = this;
        var pattern = $('<div></div>');
        pattern.addClass('pattern_container');
        pattern.data("steps",steps);
        pattern.data("group",group);
        pattern.data("type","dundun");
        this.editorContainer.append(pattern);

        var bellRow = $('<div></div>');
        if (lists != null)
            bellRow.append(this.createTable(steps,group,lists[0],'bell'));
        else
            bellRow.append(this.createTable(steps,group,lists,'bell'));
        bellRow.addClass('bell_row');
        pattern.append(bellRow);
        bellRow.find($("td")).click(function() {
            $(this).toggleClass("selected");
        });

        var closedRow = $('<div></div>');
        closedRow.addClass("drum_row closed_row");
        if (lists != null)
            closedRow.append(this.createTable(steps,group,lists[1],'closed'));
        else
            closedRow.append(this.createTable(steps,group,lists,'closed'));
        pattern.append(closedRow);

        var openRow = $('<div></div>');
        openRow.addClass("drum_row open_row");
        if (lists != null)
            openRow.append(this.createTable(steps,group,lists[2],'open'));
        else
            openRow.append(this.createTable(steps,group,lists,'open'));
        pattern.append(openRow);

        closedRow.find($("td")).click(function() {
            $(this).toggleClass("selected");
            var index = $(this).parent().find($("td")).index($(this));
            $(openRow.find($("td")).get(index)).removeClass('selected');
        });

        openRow.find($("td")).click(function() {
            $(this).toggleClass("selected");
            var index = $(this).parent().find($("td")).index($(this));
            $(closedRow.find($("td")).get(index)).removeClass('selected');
        });

        var closeMenu = $('<ul class="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" data-mdl-for="menu'+timeStamp+'"></ul>');
        closeMenu.addClass('mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect');

        var closeButton = $('<li class="mdl-menu__item">remove pattern</li>');
        closeMenu.append(closeButton);

        pattern.append(closeMenu);

        var menuButton = $('<button id="menu'+timeStamp+'"><i class="material-icons">more_vert</i></button>');
        menuButton.addClass('close-btn mdl-button mdl-js-button mdl-button--icon mdl-button--fab mdl-button--mini-fab');

        pattern.prepend(menuButton);
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
        componentHandler.upgradeAllRegistered();
        this.scrollToElement(pattern[0]);
    }

    Editor.prototype.removePattern = function(closeButton) {
      $(closeButton).parents(".pattern_container").remove();
    }

    Editor.prototype.showRemovePatternDialog = function(closeButton) {
      var _this = this;
      var patternName = $(closeButton).parent().parent().siblings(".pattern-title").find("input").val();
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
        json.name = $('.rhythm-title > input').val();
        patterns.each(function (index, value) {
            pattern = {};

            pattern.name = $(value).find(".pattern-title > input").val();
            pattern.group = $(value).data('group');
            pattern.length = $(value).data('steps');
            pattern.type = $(value).data('type');
            pattern.rows = {};

            if (pattern.type == "djembe") {
                pattern.rows.slap = {};
                pattern.rows.tone = {};
                pattern.rows.bass = {};
                pattern.rows.slap.steps = [];
                pattern.rows.tone.steps = [];
                pattern.rows.bass.steps = [];
                row = $(value).find('.pattern_row');
                $($(row)[0]).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.rows.slap.steps.push('slap');
                    else
                        pattern.rows.slap.steps.push('-');
                });
                $($(row)[1]).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.rows.tone.steps.push('tone');
                    else
                        pattern.rows.tone.steps.push('-');
                });
                $($(row)[2]).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.rows.bass.steps.push('bass');
                    else
                        pattern.rows.bass.steps.push('-');
                });
            }

            if (pattern.type == "dundun") {
                pattern.rows.bell = {};
                pattern.rows.bell.steps = [];
                row = $(value).find('.bell_row > .pattern_row');
                $(row).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.rows.bell.steps.push('bell');
                    else
                        pattern.rows.bell.steps.push('-');
                });

                pattern.rows.closed = {};
                pattern.rows.closed.steps = [];
                pattern.rows.open = {};
                pattern.rows.open.steps = [];
                row = $(value).find('.closed_row > .pattern_row');
                $(row).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.rows.closed.steps.push('closed');
                    else
                        pattern.rows.closed.steps.push('-');
                });

                row = $(value).find('.open_row > .pattern_row');
                $(row).find("td").each(function (index,value) {
                    if ($(value).hasClass('selected'))
                        pattern.rows.open.steps.push('open');
                    else
                        pattern.rows.open.steps.push('-');
                });
            }
            json.patterns.push(pattern);
        });
        return JSON.stringify(json);
    }

    Editor.prototype.importJSON = function(json) {
        $("#editor_container").find(".pattern_container").remove();
        $('.rhythm-title > input').val(json.name);
        for (var i = 0; i < json.patterns.length; i++) {
            if (json.patterns[i].type == "djembe") {
                _this.addDjembePattern(json.patterns[i].name, json.patterns[i].length, json.patterns[i].group, [json.patterns[i].rows.slap.steps, json.patterns[i].rows.tone.steps, json.patterns[i].rows.bass.steps]);
            }

            if (json.patterns[i].type == "dundun") {
                _this.addDundunPattern(json.patterns[i].name, json.patterns[i].length, json.patterns[i].group, [json.patterns[i].rows.bell.steps, json.patterns[i].rows.closed.steps, json.patterns[i].rows.open.steps]);
            }
        }
    }

    return Editor;

})();
