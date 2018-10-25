    // //GET (READ)
    // $("#get-button").on('click', function(){
    //     $.ajax({
    //         url: 'http://localhost:3000/posts',
    //         method: 'GET',
    //         contentType: 'application/json',
    //         success: function(response)
    //         {
    //             let arr = [];
    //             for (let i=0; i<response.length; i++)
    //             {
    //         n = $('<tr>').append(`<td>${response[i].id}</td><td>${response[i].name}</td><td>${response[i].categoryId}</td>`);
    //         let bEdit = $('<button>').html('Edit').addClass('btn btn-secondary btn-outline-primary');
    //         let bDelete = $('<button>').html('Delete').addClass('btn btn-secondary btn-danger margin');
    //         bDelete.on('click', () => {
    //         axios.delete('http://localhost:3000/posts/'+response[i].id);
    //         $("#get-button").click(); 
    //             });

    //             bEdit.on("click",()=>{
    //                 let inputsArray = $("#create-form input")
    //                 inputsArray[0].value = response[i].title;
    //                 inputsArray[1].value = response[i].name;
    //                 inputsArray[2].value = response[i].categoryId;
    //                 $("#postBody").val(response[i].body);
    //                 $("#comment").val(response[i].comment);
    //                 let saveButton = $("<button>").html("SAVE").attr("type","button").addClass("btn btn-outline-primary btn-block btn-lg size").on('click', () => {
    //                     response[i].title = inputsArray[0].value;
    //                     response[i].name = inputsArray[1].value;
    //                     response[i].categoryId = inputsArray[2].value;
    //                     response[i].body = $('#postBody').val();
    //                     response[i].comment = $('#comment').val();

    //                     axios.put('http://localhost:3000/posts/'+response[i].id, response[i]);
    //                     saveButton.remove();
    //                     $("input,textarea").val("")
    //                     });
    //                     $('#create-form').append(saveButton);
    //             });
    //             n.append($('<td>').append([bEdit, bDelete])); 
    //             arr.push(n);
    //             }
    //              $('tbody').html(arr);
    //         } 
    //     });
    // });
    //
  
    var config = {
        apiKey: "AIzaSyDeVaoO7vMENkM5uuVx3hRw3LUe3Isl9U4",
        authDomain: "week-4project.firebaseapp.com",
        databaseURL: "https://week-4project.firebaseio.com",
        projectId: "week-4project",
        storageBucket: "week-4project.appspot.com",
        messagingSenderId: "62785037028"
      };
      firebase.initializeApp(config);
    
    
      const FireApp = firebase.firestore();
      const auth= firebase.auth();
       FireApp.settings({ timestampsInSnapshots: true})

      FireApp.collection("posts")
       .onSnapshot(res => {
           render(res.docs)
       })
$("#addButton").on("click",()=>{
    let postObj = {
        title:$("#postTitle").val(),
        name:$("#postOwner").val(),
        body:$("#postBody").val(),
        categoryId:$("#CategoryID").val()
    }
   FireApp.collection("posts")
    .add({
        ...postObj
    })
});


function render(arr)
 {
     arr.map((post,i) => {
         const el = {...post.data(),id:post.id};
         console.log(el)
        n = $('<tr>').append(`<td>${(i+1)}</td><td>${el.title}</td><td>${el.name}</td><td>${el.body.substring(0,20).concat("...")}</td>`)
        let bEdit = $('<button>').html('Edit').addClass('btn btn-secondary btn-outline-primary');
        let bDelete = $('<button>').html('Delete').addClass('btn btn-secondary btn-danger margin');
        bDelete.on('click', () => {
              FireApp.collection("posts")
               .doc(post.id).delete();

               n.remove();
            });

            bEdit.on("click",()=>{
                let inputsArray = $("#create-form input")
                inputsArray[0].value = el.title;
                inputsArray[1].value = el.name;
                inputsArray[1].setAttribute("disabled",true)
                inputsArray[2].value = el.categoryId;
               $("#create-form textarea").val(el.body)
                let saveButton = $("<button>").html("SAVE").attr("type","button").addClass("btn btn-outline-primary btn-block btn-lg size").on('click', () => {
                    el.title = inputsArray[0].value;
                    el.name = inputsArray[1].value;
                    el.categoryId = inputsArray[2].value;
                    el.body = $("textarea").val();
            
                    FireApp.collection("posts")
                     .doc(post.id).set({
                         ...el
                     })
                    saveButton.remove();
                    $("input,textarea").val("")
                    });
                    $('#create-form').append(saveButton);
            });
            n.append($('<td>').append([bEdit, bDelete])); 
            $('tbody').append(n);
     })
 }