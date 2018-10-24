    // //GET (READ)
    // $("#get-button").on('click', function(){
    //     $.ajax({
    //         url: 'http://localhost:3000/comments',
    //         method: 'GET',
    //         contentType: 'application/json',
    //         success: function(response)
    //         {
    //             let arr = [];
    //             for (let i=0; i<response.length; i++)
    //             {
    //         n = $('<tr>').append(`<td>${response[i].id}</td><td>${response[i].name}</td><td>${response[i].body}</td>`)
    //         let bEdit = $('<button>').html('Edit').addClass('btn btn-secondary btn-outline-primary');
    //         let bDelete = $('<button>').html('Delete').addClass('btn btn-secondary btn-danger margin');
    //         bDelete.on('click', () => {
    //         axios.delete('http://localhost:3000/comments/'+response[i].id);
    //         $("#get-button").click(); 
    //             });

    //             bEdit.on("click",()=>{
    //                 let inputsArray = $("#create-form input")
    //                 inputsArray[0].value = response[i].name;
    //                 inputsArray[1].value = response[i].userName;
    //                 $("textarea").val(response[i].body);
    //                 let saveButton = $("<button>").html("SAVE").attr("type","button").addClass("btn btn-outline-primary btn-block btn-lg size").on('click', () => {
    //                     response[i].title = inputsArray[0].value;
    //                     response[i].name = inputsArray[1].value;
    //                     response[i].body = $('textarea').val();

    //                     axios.put('http://localhost:3000/comments/'+response[i].id, response[i]);
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
    FireApp.settings({timestampsInSnapshots: true})

    FireApp.collection("comments")
     .onSnapshot(res => {
         render(res.docs);
     })
$("#addButton").on("click",()=>{
    let postObj = {
        name:$("#postTitle").val(),
        userName:$("#postOwner").val(),
        body:$("#postBody").val(),
    }
      FireApp.collection("comments")
       .add({
           ...postObj
       })
 });

$("#get-button").click();

function render(arr)
 {
     arr.map((comment,i) => {
         const el = {...comment.data(),id:comment.id};
         console.log(el)
        n = $('<tr>').append(`<td>${(i+1)}</td><td>${el.body}</td>`);
        let bEdit = $('<button>').html('Edit').addClass('btn btn-secondary btn-outline-primary');
        let bDelete = $('<button>').html('Delete').addClass('btn btn-secondary btn-danger margin');
        bDelete.on('click', () => {
              FireApp.collection("comments")
               .doc(comment.id).delete();

               n.remove();
            });

            bEdit.on("click",()=>{
                let inputsArray = $("#create-form input")
                inputsArray[0].value = el.name;
                inputsArray[1].value = el.userName;
                 $("textarea").val( el.body);
                let saveButton = $("<button>").html("SAVE").attr("type","button").addClass("btn btn-outline-primary btn-block btn-lg size").on('click', () => {
                    el.name = inputsArray[0].value;
                    el.userName = inputsArray[1].value;
                    el.body = $("textarea").val();
            
                    FireApp.collection("comments")
                     .doc(comment.id).set({
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