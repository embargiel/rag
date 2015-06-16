$(document).ready(  
  function() {
    var data = JSON.parse('{"owners": [{"login": "john","email": "john@example.com"}],"members": [{"login": "jane","email": "jane@example.com"},{"login": "danny","email": "danny@example.com"},{"login": "fred","email": "fred@example.com"}],"invited": [{"email": "alice@example.com"}]}');
    refreshAll(); 

    $('#add_user').click(function(){
      $('#user_form').fadeIn(400);
      $('#background_div').show();
    });

    $('#background_div').click(function(){
      $('#user_form').fadeOut(400);
      $('#background_div').hide();
    })

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
          data["invited"].push( {"login":login, "email":email, "type":type});         
          refreshCategory("invited");
          $('#background_div').hide();
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
        $('#' + category + ' div:last-child').append('<i class="fa fa-times button_remove" id="' + category + '_' + j + '"><span class="hint">Remove</span></i>');
        if(category == "members")
        {
          $('#' + category + ' div:last-child').append('<i class="fa fa-pencil-square-o button_edit" id="edit_' + category + '_' + j + '"><span class="hint">Upgrade</span></i>');
        }
        else if(category == "owners")
        {
          $('#' + category + ' div:last-child').append('<i class="fa fa-pencil-square-o button_edit" id="edit_' + category + '_' + j + '"><span class="hint">Downgrade</span></i>');
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