$(document).ready(function() {


    // $('#data_table').DataTable();

	// $.ajax({
	// 	url: 'https://maps.googleapis.com/maps/api/geocode/xml?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyAJw4dXGz1eT7rHN2ov6oY90hV4c-trNAI',
	// 	type: 'post',
	// 	ContentType: "application/x-www-form-urlencoded",
 //        Accept: "application/json; charset=UTF-8",
	// 	success: function(data) {
	// 		console.log(data);
	// 	},
	// 	error: function(error) {
	// 		console.log(error);
	// 	}
	// })

	// $('#import').click(function() {
	// 	var path = this.files[0].mozFullPath;
	// 	console.log(path);
	// })

	var locations=[];
	$("#search").keypress(function(e){
        var asc=e.keyCode;
        if(asc != '13') {
	        var location=$("#search").val()+String.fromCharCode(asc);
	        search(location);
	    }
    });

    $("#search").keyup(function(e){
        var key_val=e.keyCode;
        if(key_val==8){
            var location=$("#search").val();
            search(location);
        }
    });

    function search(place) {
    	var locationData = {"location": place};
    	$.ajax({
    		url:'/find/location',
    		type: 'post',
    		data: locationData,
    		success: function(data) {
    			console.log(data);
    			if(data.length > 0) {
        			locations.length = 0;
        			$('#data_table tbody').empty();
        			$('#data_table tbody').append('<tr><th>Name</th><th>Age</th><th>Location</th><th>Department</th><th>Edit</th><th>Delete</th></tr>');
        			for(var i=0;i<data.length;i++){
                        locations.push(data[i].location);
                        $("#data_table tbody").append(`<tr><td> ${data[i].name} </td><td> ${data[i].age} </td><td> ${data[i].location}</td><td> ${data[i].department} </td><td><a href="#" class="edit" data-toggle="modal" data-target="#myModal" id="`+ data[i].user_id +`">Edit</a></td><td><a href="#" class="delete" data-toggle="modal" data-target="#delete-modal" id="`+ data[i].user_id +`">Delete</a></td></tr>`);
                    }
        		} else {
        			$('#data_table tbody').empty();
        			$('#data_table tbody').append('<tr><th>Name</th><th>Age</th><th>Location</th><th>Department</th><th>Edit</th><th>Delete</th></tr><tr><td colspan="6"align="center">No records found</td></tr>');
        		}
    		},
    		error: function(error) {
    			console.log(error);
    		}
    	})
    }

	$('#file').on('change',function ()
    {
        var filePath = URL.createObjectURL(event.target.files[0]);
        console.log(filePath);
        $.ajax({
        	url:'/student/upload',
        	type: 'post',
        	data: filePath,
        	success: function(data) {
        		console.log(data);
        	},
        	error: function(error) {
        		console.log(error);
        	}
        })
    });

	$("#data_table").on('click', '.edit', function(e){
		console.log("edit clicked"); 
		 $("#myModal").modal(); 
		var userId = e.currentTarget.id;
		var data = {"userId": userId};
		console.log("user id===>", userId);
		$.ajax({
			url: '/student/id',
			type: 'GET',
			data: data,
			success: function(res) {
				console.log(res);
				$('#user').val(res.data.user_id);
				$('#name').val(res.data.name);
				$('#age').val(res.data.age);
				$('#location').val(res.data.location);
				$('#department').val(res.data.department);
			},
			error: function(error) {
				console.log(error);
			}
		})
	})

	function getUnique(array){
        var uniqueArray = [];
        
        // Loop through array values
        for(i=0; i < array.length; i++){
            if(uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i]);
            }
        }
        return uniqueArray;
    }

	$("#data_table").on('click', '.delete', function(e){
		var userId = e.currentTarget.id;
		console.log("user_id",userId);
		$('#delete').val(userId);
	});

	$('#delete-user').click(function() {
		var userId= $('#delete').val();
		console.log("ok click delete");
		var userData = {'user_id': userId};
		$.ajax({
			url: '/student/delete',
			type: 'post',
			data: userData,
			success: function(data) {
				if(data.status == 200) {
					location.href = "http://localhost:4000/";
				}
			},
			error: function(error) {
				console.log(error);
			}
		})
	})
});