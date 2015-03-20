(function ($, $S) {
    // $jQuery
    // $S window.localStorage
    // variables
    var $board = $('#board'),
        // Placement of post-its
        Postick, //contains the functions to work on the LocalStorage
        len = 0,
        // name of objects LocalStorage
        currentNotes = '',
        // Storage HTML element the Post-It
        o; // Current data of Post-It in the localStorage



    // Manage Post-It in the LocalStorage
	  // Each object is stored in the localStorage as an Object
    Postick = {
        add: function (obj) {
            obj.id = $S.length;
            $S.setItem(obj.id, JSON.stringify(obj));
        },

        retrive: function (id) {
            return JSON.parse($S.getItem(id));
        },

        remove: function (id) {
            $S.removeItem(id);
        },

        removeAll: function () {
            $S.clear();
        }

    };

    //If there are Post-It on creating
    len = $S.length;
    if (len) {
        for (var i = 0; i < len; i++) {
            // Create all Post-It located in the localStorage
            var key = $S.key(i);
            o = Postick.retrive(key);
            currentNotes += '<div class="postick"';
            currentNotes += ' style="left:' + o.left;
            currentNotes += 'px; top:' + o.top;
						// The data- key attribute lets you know which note we will remove the localStorage
            currentNotes += 'px"><div class="toolbar"><span class="delete" data-key="' + key;
            currentNotes += '">x</span></div><div contenteditable="true" class="editable">';
            currentNotes += o.text;
            currentNotes += '</div></div>';
        }

        // Adds all Post-It on the dashboard
        $board.html(currentNotes);
    }

    // Once the document is loaded , it makes all the Post-It Draggable
    $(document).ready(function () {
        $(".postick").draggable({
            cancel: '.editable',
			"zIndex": 3000,
			"stack" : '.postick'
        });
    });

    // Delete the Post-It
    $('span.delete').live('click', function () {
        if (confirm('Do you want to delete this note ?')) {
            var $this = $(this);
					  // The data- key attribute lets you know which note we will remove the localStorage
            Postick.remove($this.attr('data-key'));
            $this.closest('.postick').fadeOut('slow', function () {
                $(this).remove();
            });
        }
    });

    // Creates the Post-It
    $('#btn-addNote').click(function () {
        $board.append('<div class="postick" style="left:20px;top:70px"><div class="toolbar"><span class="delete" title="Fermer">x</span></div><div contenteditable class="editable"></div></div>');
        $(".postick").draggable({
            cancel: '.editable'
        });
    });

    // Backup all Post-It when the user leaves the page
    window.onbeforeunload = function () {
        // Cleaning the localStorage
        Postick.removeAll();
        // Then inserts each Post-It in the LocalStorage
				// Safeguard the position of Post-It to replace it when the page is loaded again
        $('.postick').each(function () {
            var $this = $(this);
            Postick.add({
                top: parseInt($this.position().top),
                left: parseInt($this.position().left),
                text: $this.children('.editable').text()
            });
        });
    }
})(jQuery, window.localStorage);
