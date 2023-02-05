//const reloadTableBody = (res) => {
//=>const updateTable = (res) => {


const updateTableRows = (res) => {
    console.log("updateTable():res", res)

    const container = document.getElementById("listContainer");
    container.innerHTML = ""



    for (let [index, element] of res.entries()) {
        console.log("forLOOP():res", element, index)

        const template = document.getElementById("listItemTemplate");

        const listItem = template.content.firstElementChild.cloneNode(true);

        //set content
        listItem.id = index + 1
        listItem.dataset.primaryKey = element.id

        var id = listItem.querySelector("div.col-1.id")
        id.innerText = index + 1


        var service = listItem.querySelector("div.col-4.service")
        service.innerText = element.service

        var attendant = listItem.querySelector("div.col-5.attendant")
        attendant.innerText = element.attendant

        var client = listItem.querySelector("div.col-6.client")
        client.innerText = element.client

        var price = listItem.querySelector("div.col-6.price")
        price.innerText = element.price

        if (element.hasPaid === false) {
            var hasPaid = listItem.querySelector("div.col-6.haspaid")
            hasPaid.innerText = "NO"
        } else {
            var hasPaid = listItem.querySelector("div.col-6.haspaid")
            hasPaid.innerText = "Yes"
        }



        var balance = listItem.querySelector("div.col-6.balance")
        balance.innerText = element.balance


        //set accordion 
        var entryId = element.id

        var accordionHeader = listItem.querySelector("h2.accordion-header")
        accordionHeader.id = "flush-heading" + entryId

        var accordionButton = listItem.querySelector("button.accordion-button")
       
        accordionButton.dataset.bsTarget = "#flush-collapse" + entryId

        var accordionCollapse = listItem.querySelector("div.accordion-collapse")
        accordionCollapse.id = "flush-collapse" + entryId


        //set accordionButtons
        //edit button
        editButton = listItem.querySelector("button.btn.btn-outline-primary")
        editButton.dataset.bsTarget = "#editEntry"+entryId
        editButton.setAttribute("aria-contols" , "editEntry" + entryId)

        editCollapse = listItem.querySelector("div.editentry")
        editCollapse.id = "editEntry" + entryId

        //delete button
        

        // set event listeners

        const editTransactionInputButton = listItem.querySelector("button.btn.btn-outline-primary")
        editTransactionInputButton.addEventListener("click", ()=>{
            processEditInput(listItem)
        })


        const deleteTransactionInputButton = listItem.querySelector("button.btn.btn-outline-danger")
        deleteTransactionInputButton.addEventListener("click", ()=>{
            processDeleteInput(listItem)
        })

        console.log(listItem)



        container.appendChild(listItem)
    }




}
//update table
const updateTable = () => {
    readTransaction()
}
