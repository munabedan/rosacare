//show input
const processNewInput = () => {
    //hide edit and delete
    document.getElementById("editEntry").classList.remove("show")
    document.getElementById("deleteEntry").classList.remove("show")

    //read  input values
    const readInputs = () => {
        serviceInput = document.getElementById("service").value
        attendantInput = document.getElementById("attendant").value
        clientInput = document.getElementById("client").value
        priceInput = Number(document.getElementById("price").value)
        paidInput = Number(document.getElementById("paid").value)


        //calculate balance
        balance = priceInput - paidInput

        id = "tr" + Math.random().toString(16).slice(2)
        console.log(id)

        if (balance === 0) {
            hasPaid = true
        } else {
            hasPaid = false
        }

        today = getDateToday()


        transactionOBJ = {
            service: serviceInput,
            attendant: attendantInput,
            client: clientInput,
            price: priceInput,
            hasPaid: hasPaid,
            balance: balance,
            date: today,
            id: id
        }

        console.log(transactionOBJ)


        createTransaction(transactionOBJ)


        //document.getElementById("inputContainer").innerHTML = "";
        document.getElementById("newEntry").classList.remove("show")
    }


    submitButton = document.getElementById("submitButton")
    submitButton.addEventListener("click", readInputs)



}



// edit entry
const processEditInput = () => {
    //hide new and delete
    document.getElementById("newEntry").classList.remove("show")
    document.getElementById("deleteEntry").classList.remove("show")

    const submitChangesToDb = () => {

        let editEntryId = document.getElementById("editEntryId").value

        console.log(editEntryId)

        //get listItem values
        var listItem = document.getElementById(editEntryId)
        console.log("getlistItem:", listItem)

        if (listItem === null) {

        } else {
            var primaryKey = listItem.dataset.primaryKey
            console.log("getPrimaryKey", primaryKey)

            //get editForm values
            var editForm = document.getElementById("editEntry")

            service = editForm.querySelector("#service").value

            attendant = editForm.querySelector("#attendant").value

            client = editForm.querySelector("#client").value

            price = Number(editForm.querySelector("#price").value)

            paid = Number(editForm.querySelector("#paid").value)

            //calculate balance
            balance = price - paid



            if (balance === 0) {
                hasPaid = true
            } else {
                hasPaid = false
            }

            transactionOBJ = {
                service: service,
                attendant: attendant,
                client: client,
                price: price,
                hasPaid: hasPaid,
                balance: balance,
                date: today,
                id: primaryKey
            }
            updateTransaction(transactionOBJ)


        }


    }
    //submit event listener
    document.getElementById("editFormSubmitButton").addEventListener("click", submitChangesToDb)


    //get edit id 
    const getFormValues = () => {
        let editEntryId = document.getElementById("editEntryId").value

        console.log(editEntryId)

        //get listItem values
        var listItem = document.getElementById(editEntryId)
        console.log("getlistItem:", listItem)

        if (listItem === null) {

        } else {
            var primaryKey = listItem.dataset.primaryKey
            console.log("getPrimaryKey", primaryKey)

            var service = listItem.querySelector("div.col-3.service").innerHTML


            var attendant = listItem.querySelector("div.col-4.attendant").innerHTML

            var client = listItem.querySelector("div.col-4.client").innerHTML

            var price = listItem.querySelector("div.col-6.price").innerHTML

            var hasPaid = listItem.querySelector("div.col-6.haspaid").innerHTML


            if (hasPaid === "YES") {
                hasPaid = true
            } else {
                hasPaid = false
            }



            var balance = listItem.querySelector("div.col-6.balance").innerHTML


            //set editForm values
            var editForm = document.getElementById("editEntry")

            serviceInput = editForm.querySelector("#service")
            serviceInput.value = service

            attendantInput = editForm.querySelector("#attendant")
            attendantInput.value = attendant

            clientInput = editForm.querySelector("#client")
            clientInput.value = client

            priceInput = editForm.querySelector("#price")
            priceInput.value = price

            paid = price - balance
            paidInput = editForm.querySelector("#paid")
            paidInput.value = paid

        }




    }

    let idInput = document.getElementById("editEntryId").addEventListener("keyup", getFormValues)



}



// delete entry
const processDeleteInput = () => {
    //hide edit and new
    document.getElementById("newEntry").classList.remove("show")
    document.getElementById("editEntry").classList.remove("show")

    const deleteEntryFromDB = () => {
        let deleteEntryId = document.getElementById("deleteEntryId").value

        console.log(deleteEntryId)

        //get listItem values
        var listItem = document.getElementById(deleteEntryId)
        console.log("getlistItem:", listItem)

        if (listItem === null) {

        } else {
            var primaryKey = listItem.dataset.primaryKey
            console.log("getPrimaryKey", primaryKey)

            //get editForm values
            var editForm = document.getElementById("editEntry")

            service = editForm.querySelector("#service").value

            attendant = editForm.querySelector("#attendant").value

            client = editForm.querySelector("#client").value

            price = Number(editForm.querySelector("#price").value)

            paid = Number(editForm.querySelector("#paid").value)

            //calculate balance
            balance = price - paid



            if (balance === 0) {
                hasPaid = true
            } else {
                hasPaid = false
            }

            transactionOBJ = {
                service: service,
                attendant: attendant,
                client: client,
                price: price,
                hasPaid: hasPaid,
                balance: balance,
                date: today,
                id: primaryKey
            }

            deleteTransaction(transactionOBJ)



        }
    }

    document.getElementById("confirmDeleteButton").addEventListener("click", deleteEntryFromDB)


    //get edit id 
    const getFormValues = () => {
        let deleteEntryId = document.getElementById("deleteEntryId").value

        console.log(deleteEntryId)

        //get listItem values
        var listItem = document.getElementById(deleteEntryId)
        console.log("getlistItem:", listItem)

        if (listItem === null) {

        } else {
            var primaryKey = listItem.dataset.primaryKey
            console.log("getPrimaryKey", primaryKey)

            var service = listItem.querySelector("div.col-3.service").innerHTML


            var attendant = listItem.querySelector("div.col-4.attendant").innerHTML

            var client = listItem.querySelector("div.col-4.client").innerHTML

            var price = listItem.querySelector("div.col-6.price").innerHTML

            var hasPaid = listItem.querySelector("div.col-6.haspaid").innerHTML


            if (hasPaid === "YES") {
                hasPaid = true
            } else {
                hasPaid = false
            }



            var balance = listItem.querySelector("div.col-6.balance").innerHTML


            //set editForm values
            var editForm = document.getElementById("deleteEntry")

            serviceInput = editForm.querySelector("#service")
            serviceInput.value = service

            attendantInput = editForm.querySelector("#attendant")
            attendantInput.value = attendant

            clientInput = editForm.querySelector("#client")
            clientInput.value = client

            priceInput = editForm.querySelector("#price")
            priceInput.value = price

            paid = price - balance
            paidInput = editForm.querySelector("#paid")
            paidInput.value = paid

        }




    }

    let idInput = document.getElementById("deleteEntryId").addEventListener("keyup", getFormValues)

}


//listen for selection event
const processDatePickerInput = (e) => {
    selectedDate = e.target.value
    datePicker.value = selectedDate

    //set date header
    /*dateHeader = document.getElementById("dateHeader")
    dateHeader.innerHTML = selectedDate*/

    updateTable()


}