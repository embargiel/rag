$(document).ready(  
  function() {
    var data = JSON.parse('{"owners": [{"login": "john","email": "john@example.com"}],"members": [{"login": "jane","email": "jane@example.com"},{"login": "danny","email": "danny@example.com"},{"login": "fred","email": "fred@example.com"}],"invited": [{"email": "alice@example.com"}]}');
    refreshAll(); 

    $('#add_user').click(function(){
      $('#user_form').toggle();
    });

    $(document).on('click', '.button_remove', function(){
      var element = $(this).attr("id").split("_");      
      data[element[0]].splice(parseInt(element[1]),1);
      refreshCategory(element[0]);
    });

    $(document).on('click', '.button_edit', function(){
      var element = $(this).attr("id").split("_");  
      if(element[1] == "members")
      {
        data.owners.push(data[element[1]][element[2]]);
      }
      else
      {
        data.members.push(data[element[1]][element[2]]);
      }
      data[element[1]].splice(parseInt(element[2]),1);
      refreshAll();
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
          data[invited].push( {"login":login, "email":email, "type":type});         
          refreshCategory(invited);
        }           
      });
      ev.preventDefault();          
    });

    function refreshCategory(category) {
      $('#' + category + ' div').remove();
      for(var j = 0; j < data[category].length; j++)
      {
        $('#' + category).append("<div></div>");
        $('#' + category + ' div:last-child').text((data[category][j].login || "unknown") + " - email: " + (data[category][j].email || "unknown"));
        $('#' + category + ' div:last-child').append('<span class="button button_remove" id="' + category + '_' + j + '">Remove</span>');
        if(category == "members")
        {
          $('#' + category + ' div:last-child').append('<span class="button button_edit" id="edit_' + category + '_' + j + '">Upgrade to owners</span>');
        }
        else if(category == "owners")
        {
          $('#' + category + ' div:last-child').append('<span class="button button_edit" id="edit_' + category + '_' + j + '">Downgrade to members</span>');
        }
      }
    };

    function refreshAll() {
      refreshCategory("members");
      refreshCategory("owners");
      refreshCategory("invited");
    };    
  }
  );