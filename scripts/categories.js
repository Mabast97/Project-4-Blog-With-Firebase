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

    FireApp.collection("categories")
     .onSnapshot(res => {
         render(res.docs);
     })

$("#addButton").on("click",()=>{
    let postObj = {
        name:$("#postName").val(),
    }
    FireApp.collection("categories")
     .add({
         ...postObj
     })
});

$("#get-button").click();

function render(arr)
 {
     arr.map((category,i) => {
         const el = {...category.data(),id:category.id};
         console.log(el)
        n = $('<tr>').append(`<td>${(i+1)}</td><td>${el.name}</td>`)
        let bEdit = $('<button>').html('Edit').addClass('btn btn-secondary btn-outline-primary');
        let bDelete = $('<button>').html('Delete').addClass('btn btn-secondary btn-danger margin');
        bDelete.on('click', async () => {
              await FireApp.collection("categories")
               .doc(category.id).delete();

               n.remove();
            });

            bEdit.on("click",()=>{
                let inputsArray = $("#create-form input")
                inputsArray[0].value = el.name;
                let saveButton = $("<button>").html("SAVE").attr("type","button").addClass("btn btn-outline-primary btn-block btn-lg size").on('click', () => {
                    el.name = inputsArray[0].value;
                    FireApp.collection("categories")
                     .doc(category.id).set({
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