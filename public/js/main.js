//Client-side JavaScript
//Collecting our client icons to add event Listeners to them
const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//Grabbing each icon, adding event listeners to them to call our delete, markcomplete, and markuncomplete functions
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

//creating async function to delete a task using 'delete' CRUD operation
async function deleteItem(){
    const itemText = this.parentNode.querySelector('span').innerText
    console.log('Deleting item:', itemText);
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//creating async function to update task as completed using 'update'/put CRUD operation on task text
//Here we are sending a PUT request to our server (to our '/markComplete' route/PUT request in server.js) with the request body of the specific task text
async function markComplete(){
    //old school way:
    //const itemText = this.parentNode.childNodes[1].innerText
    const itemText = this.parentNode.querySelector('span').innerText
    console.log('Marking complete:', itemText);
    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //once our server.js 'markComplete' PUT method finds the task/document and makes the property change, it sents a json() response back here
        const data = await response.json()
        //Once the responce from the server.js file is sent back here, we console log our data, and then do a page reload;  WHICH TRIGGERS A GET REQUEST.
        //The GET request goes to the database sees that the task has been changed, 
        //and renders this change on our EJS to the client side for the user
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

//creating async function to update task as uncompleted using 'update'/put CRUD operation on task text
async function markUnComplete(){
    const itemText = this.parentNode.querySelector('span').innerText
    console.log('Marking uncomplete:', itemText);
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}