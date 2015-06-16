$(document).ready(	
	function() {
		var data = JSON.parse('{"owners": [{"login": "john","email": "john@example.com"}],"members": [{"login": "jane","email": "jane@example.com"},{"login": "danny","email": "danny@example.com"},{"login": "fred","email": "fred@example.com"}],"invited": [{"email": "alice@example.com"}]}');
		var members = "members";
		var owners = "owners";
		var invited = "invited";
		refreshCategory(members);
		refreshCategory(owners);
		refreshCategory(invited);		

		$('#add_user').click(function(){
			$('#user_form').toggle();
		});

		$('.button_remove').click(function(){
			var element = $(this).attr("id").split("_");			
			var child = parseInt(element[1]) + 1;
			data[element[0]].splice(parseInt(element[1]),1);
			refreshCategory(element[0]);
		});

		$("#form").submit(function (ev) {			
			$.ajax({				
        type: "POST",
        data: $(this).serialize(),
        success: function () {
          $('#user_form').hide();
					var login = $('#username').val();
					var email = $('#email').val();
					var type = "members"
					if($('#radio_owner').prop('checked'))
					{						
						type = "owners"
					}	
					data.invited.push( {"login":login, "email":email, "type":type});
					printUser();
        }           
			});
			ev.preventDefault();     			
		});

		function printUser() {			
			var length = data.invited.length;
			$('#invited').append("<div></div>");
			$('#invited div:last-child').text(data.invited[length - 1].login + " - email: " + data.invited[length - 1].email + " - account type: " + data.invited[length - 1].type);		
		};

		function refreshCategory(category) {
			$('#' + category + ' div').remove();
			for(var j = 0; j < data[category].length; j++)
			{
				$('#' + category).append("<div></div>");
				$('#' + category + ' div:last-child').text(data[category][j].login + " - email: " + data[category][j].email);
				$('#' + category + ' div:last-child').append('<span class="button button_remove" id="' + category + '_' + j + '">X</span>');
			}
		};		
	}
);