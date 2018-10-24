    //GET (READ)
    // $("#get-button").on('click', function(){
    //     $.ajax({
    //         url: 'http://localhost:3000/users',
    //         method: 'GET',
    //         contentType: 'application/json',
    //         success: function(response)
    //         {
    //             let arr = [];
    //             for (let i=0; i<response.length; i++)
    //             {
    
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
    FireApp.collection("users")
     .onSnapshot(res => {
         render(res.docs)
     })
    

$("#addButton").on("click",()=>{
    let postObj = {
        name:$("#postName").val(),
        email:$("#postEmail").val(),
        userName:$("#postOwner").val()
    }
     FireApp.collection("users")
      .add({
          ...postObj
      })

});

$("#get-button").click();


 function render(arr)
 {
     arr.map((user,i) => {
         const el = {...user.data(),id:user.id};
         console.log(el)
        n = $('<tr>').append(`<td>${(i+1)}</td><td>${el.name}</td><td>${el.email}</td>`)
        let bEdit = $('<button>').html('Edit').addClass('btn btn-secondary btn-outline-primary');
        let bDelete = $('<button>').html('Delete').addClass('btn btn-secondary btn-danger margin');
        bDelete.on('click', () => {
              FireApp.collection("users")
               .doc(user.id).delete();

               n.remove();
            });

            bEdit.on("click",()=>{
                let inputsArray = $("#create-form input")
                inputsArray[0].value = el.name;
                inputsArray[1].value = el.userName;
                inputsArray[2].value = el.email;
                let saveButton = $("<button>").html("SAVE").attr("type","button").addClass("btn btn-outline-primary btn-block btn-lg size").on('click', () => {
                    el.name = inputsArray[0].value;
                    el.userName = inputsArray[1].value;
                    el.email = inputsArray[2].value;
            
                    FireApp.collection("users")
                     .doc(user.id).set({
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