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
    });

    $(document).on('click', '#members_login', function(){
      sortTable("members", "login");
    });
    $(document).on('click', '#invited_login', function(){
      sortTable("invited", "login");
    });
    $(document).on('click', '#owners_login', function(){
      sortTable("owners", "login");
    });

    $(document).on('click', '#members_email', function(){
      sortTable("members", "email");
    });
    $(document).on('click', '#invited_email', function(){
      sortTable("invited", "email");
    });
    $(document).on('click', '#owners_email', function(){
      sortTable("owners", "email");
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
          $('#user_form').hide();                      
        }           
      });
      ev.preventDefault();          
    });

    function refreshCategory(category) {      
      $('#' + category + ' table' + ' tr').remove();
      $('#' + category + "_table").append("<tr><td>id</td><td id='" + category + "_login'>login \\/</td><td id='" + category + "_email'>email \\/</td><td>remove</td><td>edit</td></tr>");
      for(var j = 0; j < data[category].length; j++)
      {
        $('#' + category + "_table").append("<tr></tr>");
        $('#' + category + '_table' + ' tr:last-child').append('<td>' + parseInt(j+1) + '</td><td>' + (data[category][j].login || "unknown") + '</td><td>' + (data[category][j].email || "unknown") + '</td>');
        $('#' + category + '_table' + ' tr:last-child').append('<td><i class="fa fa-times button_remove" id="' + category + '_' + j + '"><span class="hint">Remove</span></i></td>');
        if(category == "members")
        {
          $('#' + category + '_table' + ' tr:last-child').append('<td><i class="fa fa-pencil-square-o button_edit" id="edit_' + category + '_' + j + '"><span class="hint">Upgrade</span></i></td>');
        }
        else if(category == "owners")
        {
          $('#' + category + '_table' + ' tr:last-child').append('<td><i class="fa fa-pencil-square-o button_edit" id="edit_' + category + '_' + j + '"><span class="hint">Downgrade</span></i></td>');
        }
      }
    };

    function refreshAll() {
      refreshCategory("members");
      refreshCategory("owners");
      refreshCategory("invited");
    }; 

    function sortTable(category, field) {
      data[category].sort(function(a, b){
        var a1 = a[field];
        var b1 = b[field];
        if(a1 == b1){
          return 0;
        }
        else{
          return a1 > b1? 1: -1;
        }
      });
      refreshCategory(category);
    };   
  }
);