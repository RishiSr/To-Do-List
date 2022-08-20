const gotologout = () => {
    window.location = '/logout';
}
const fetchcrrow = async () => {
    let result = await fetch("/note");
    let datal = await result.json();
    for (var i = 0; i < datal.data.length; i++) {

        check(datal.data[i]);

    }
}
const creatediv = (e) => {

    //   var container = document.getElementById("maindiv");
    //   var section = document.getElementById("maindata");
    //   container.appendChild(section.cloneNode(true));
    //   section.innerHTML=`${e} `;

}
let el = document.getElementById("inputtext");
el.addEventListener("keydown", function(event) {
if (event.key === "Enter") {
    addtodb();
    document. getElementById("inputtext"). value = "";

}
});
function check(e) {

    document.getElementById("maincontainer").innerHTML +=
    // ` <div id="${e._id}parent" class="taskcontainer">
    //         <p id=""  class="task">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, at? Omnis, deserunt
    //             nam. Ut, facilis.</p>
    //         <div id="${e._id}" class="buttondiv">
    //             <button class="donebutton">X</button>

    //         </div>
    //     </div>`
    `<li id="${e._id}parent"
              class="list-group-item d-flex d-flex justify-content-between align-items-center border-start-0 border-top-0 border-end-0 border-bottom rounded-0 mb-2">
              <div class="d-flex align-items-center w-75">
               
            <p class="w-100">${e.note}</p>
              </div>
              <button  id="${e._id}" onclick="deletediv(this.id)" class="btn btn-success">Success</button>
                           
            </li>`
}
fetchcrrow();
let addtodb = () => {

    let task = document.getElementById("inputtext").value;
    console.log(task);
    let obj = {
        note: task
    }
    fetch('/addnote', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
    })
        .then(response => response.json())
        .then(data => {
            check(data[data.length - 1]);
            // console.log('Success:', data);
        })
        .catch((error) => {
            // console.log('Error:', error);
        });

}
const deletediv = (e) => {
    let obj = {
        note: e
    }


    fetch('/delnote', {
        method: 'DELETE', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
    })
        .then(response => response.json())
        .then(data => {

            // console.log('Success:', data.stringify().length);

            if (JSON.stringify(data).length != 2) {
                document.getElementById(e + "parent").classList.add('d-none');
            }
            else {
                window.location = '/login';
            }
        })
        .catch((error) => {
            console.log('Error:', error); document.getElementById(e + "parent").classList.add('text-warning');
        });


}