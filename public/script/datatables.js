$(document).ready(function(){
        $('#table_id').DataTable({
            "serverSide": true,
            "ajax" : "/getData"
        });
    });