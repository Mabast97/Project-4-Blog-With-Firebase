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
                    

    //         // $('#titleCount').html(response[i].title);
    //         // $('.writer').html(response[i].name);
            
    //             }
    //         } 
    //     });
    // });

$("#addButton").on("click",()=>{
    let postObj = {
        title:$("#postTitle").val(),
        name:$("#postOwner").val(),
        body:$("#postBody").val(),
        categoryId:$("#CategoryID").val(),
        comment:$("#comment").val()
    }
    $("input,textarea").val("")
    axios.post('http://localhost:3000/posts',postObj);
    $("#get-button").click();
});

$("#get-button").click();

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
  FireApp.settings({timestampsInSnapshots:true});

  FireApp.collection("posts")
   .onSnapshot(res => {
       render(res.docs)
   })
  $("#sign-up").on("click",() => {
      auth.createUserWithEmailAndPassword($("#postEmail").val(),$("#postPassword").val())
       .then(res=> {
           $("div#myform").css({"display":"none"});
           $(".main-contents").css({"display":"block"})
       })
  })

  $("#login").on("click",() => {
      auth.signInWithEmailAndPassword($("#postEmail").val(),$("#postPassword").val())
      .then(res=> {
        $("div#myform").css({"display":"none"});
        $(".main-contents").css({"display":"block"})
    })
  })

  $("#sign-out").on("click",() => {
      auth.signOut()
       .then(res => {
        $("div#myform").css({"display":"block"});
        $(".main-contents").css({"display":"none"})
       });
  })


function render(arr)
{
    arr.map(async(post,i) => {
        const el = {...post.data(),id:post.id}
        let bEdit = $('<button>').html('Edit').addClass('btn btn-secondary btn-outline-primary');
            let bDelete = $('<button>').html('Delete').addClass('btn btn-secondary btn-danger margin');
            bDelete.on('click', () => {
            FireApp.collection("posts")
             .docs(post.id).delete();
                });

                bEdit.on("click",()=>{
                    let inputsArray = $(".posts-form input")
                    inputsArray[0].value = el.title;
                    inputsArray[1].value = el.name;
                    inputsArray[1].setAttribute("disabled",true)
                    inputsArray[2].value = el.categoryId;
                   $(".posts-form textarea").val(el.body)
                    let saveButton = $("<button>").html("SAVE").attr("type","button").addClass("btn btn-outline-primary btn-block btn-lg size").on('click', async() => {
                        el.title = inputsArray[0].value;
                        el.name = inputsArray[1].value;
                        el.categoryId = inputsArray[2].value;
                        el.body = $("textarea").val();
                
                        await FireApp.collection("posts")
                         .doc(post.id).set({
                             ...el
                         })
                        saveButton.remove();

                        $("input,textarea").val("")
                        });
                        $('.posts-form').append(saveButton);
                });
                //  $('footer').append([bEdit, bDelete]);
                //  $('.body').html(response[i].body);
                //  $('.card-text').html(response[i].comment);
                let postTemplate = `<div class="wrapper"  id="row-${i}">\
                <div class="card" style="margin-top:20px;">\
                <div class="card-header">\
                  The <span id="titleCount">${el.title}</span> Title\
                  <div class="card-header">written by: <span class="writer">${el.name}</span></div>\
                  <div class="card-body">${el.body}</div>
                </div>\
                    <footer class="blockquote-footer p-4">You Can Edit or Delete !!!<div id="buttons"></div></footer>\
                  </blockquote>\
                </div>\
              </div>\
            </div>`;

            let comments = [];
            let parentDiv = $("<div>");
           await FireApp.collection("comments")
             .onSnapshot(async res => {
                await res.docs.filter(comment => {
                    let c = {...comment.data(),id:comment.id};
                      if(c.postId === post.id)
                       console.log(c);

                       return c;
                 })
                 .map(c => {
                    let comment = {...c.data(),id:c.id}
                     let commentTemplate = `<div class="wrapper">
                     <div class="card-header"><span class="writer">${comment.name}</span> Says : </div>\
                     <div class="card-body border-info" style="background-color: lightgray;">\
                     <h5 class="card-title"></h5>\
                     <p class="card-text">${comment.body}</p>\
                   </div>
                     </div>`
                    parentDiv.append(commentTemplate);
                 })
             })
              parentDiv.prepend(postTemplate)
  
 

                $('.posts').append(parentDiv).find(`#row-${i} footer`).append([bEdit, bDelete]);

    })
}