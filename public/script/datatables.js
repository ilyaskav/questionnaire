$(document).ready(function () {
    $('#table_id').DataTable({
        serverSide: true,
        ajax: { 
            url: "/getData"
            // type: 'post'
        },
        columns: [ { data: 'user'}, {data: 'email'}]
    });

    $('#addCodeButton').click(function(){
        $.post('/addCode', function(data){
            console.log(data);
        });
    });
    
    $('#addOrgButton').click(function(){
        $.post('/addOrg', function(data){
            console.log(data);
        });
    });
});