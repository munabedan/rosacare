/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);


    const createDB = (transactionOBJ) => {
        // DB

        // This is what our customer data looks like.
        //const customerData = [
        //  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
        //{ ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
        //];


        // Let us open our database
        const request = window.indexedDB.open("rosacareposDB", 3);

        request.onerror = (event) => {
            // Do something with request.errorCode!
            console.log("could not create database")
        };
        request.onsuccess = (event) => {
            // Do something with request.result!
            console.log("opened database")
        };



        request.onupgradeneeded = (event) => {
            db = event.target.result;

            // Create an objectStore to hold information about our customers. We're
            // going to use "ssn" as our key path because it's guaranteed to be
            // unique - or at least that's what I was told during the kickoff meeting.
            const objectStore = db.createObjectStore("transactions", { keyPath: "id" });

            // Create an index to search customers by name. We may have duplicates
            // so we can't use a unique index.
            objectStore.createIndex("date", "date", { unique: false });

            // Create an index to search customers by email. We want to ensure that
            // no two customers have the same email, so use a unique index.
            //objectStore.createIndex("email", "email", { unique: true });

            objectStore.transaction.oncomplete = (event) => {

                db.close()

            };



        };
    }

    createDB()

    const saveTransactionToDb = (transactionOBJ) => {
        const request = window.indexedDB.open("rosacareposDB", 3);


        request.onerror = (event) => {
            // Do something with request.errorCode!
            console.log("could not create database")
        };
        request.onsuccess = (event) => {
            // Do something with request.result!
            db = request.result
            console.log("opened database")

            // Store values in the newly created objectStore.
            const customerObjectStore = db.transaction("transactions", "readwrite").objectStore("transactions");

            customerObjectStore.add(transactionOBJ);

            fetchFromDB()

        };



    }
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


        saveTransactionToDb(transactionOBJ)


        //document.getElementById("inputContainer").innerHTML = "";
        document.getElementById("newEntry").classList.remove("show")
    }


    //show input
    const showTransactionInput = () => {
        //hide edit and delete
        document.getElementById("editEntry").classList.remove("show")
        document.getElementById("deleteEntry").classList.remove("show")

        submitButton = document.getElementById("submitButton")
        submitButton.addEventListener("click", readInputs)



    }

    const showTransactionInputButton = document.getElementById("addTransaction")
    showTransactionInputButton.addEventListener("click", showTransactionInput)

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

                const request = window.indexedDB.open("rosacareposDB", 3);


                request.onerror = (event) => {
                    // Do something with request.errorCode!
                    console.log("could not create database")
                };
                request.onsuccess = (event) => {
                    // Do something with request.result!
                    db = request.result


                    // open a read/write db transaction, ready for retrieving the data
                    const transaction = db.transaction("transactions", "readwrite");

                    // report on the success of the transaction completing, when everything is done
                    transaction.oncomplete = (event) => {
                        console.log("Transaction completed.")
                    };

                    transaction.onerror = (event) => {
                        console.log(transaction.error)
                    };

                    // create an object store on the transaction
                    const objectStore = transaction.objectStore("transactions");

                    // Make a request to get a record by key from the object store


                    const objectStoreRequest = objectStore.openCursor();

                    objectStoreRequest.onsuccess = (event) => {
                        // report the success of our request
                        const cursor = event.target.result;
                        if (cursor) {
                            if (cursor.value.id === primaryKey) {
                                const updateData = cursor.value;

                                updateData.service = service;
                                updateData.attendant = attendant;
                                updateData.client = client;
                                updateData.price = price;
                                updateData.hasPaid = hasPaid;
                                updateData.balance = balance;



                                const request = cursor.update(updateData);
                                request.onsuccess = () => {
                                    console.log('A better album year?');
                                };
                            };


                            cursor.continue();
                        } else {
                            console.log('Entries displayed.');
                        }
                        fetchFromDB()
                        document.getElementById("editEntry").classList.remove("show")


                    };


                };



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

    const editTransactionInputButton = document.getElementById("editTransaction")
    editTransactionInputButton.addEventListener("click", processEditInput)

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

                const request = window.indexedDB.open("rosacareposDB", 3);


                request.onerror = (event) => {
                    // Do something with request.errorCode!
                    console.log("could not create database")
                };
                request.onsuccess = (event) => {
                    // Do something with request.result!
                    db = request.result


                    // open a read/write db transaction, ready for retrieving the data
                    const transaction = db.transaction("transactions", "readwrite");

                    // report on the success of the transaction completing, when everything is done
                    transaction.oncomplete = (event) => {
                        console.log("Transaction completed.")
                    };

                    transaction.onerror = (event) => {
                        console.log(transaction.error)
                    };

                    // create an object store on the transaction
                    const objectStore = transaction.objectStore("transactions");

                    // Make a request to get a record by key from the object store


                    const objectStoreRequest = objectStore.openCursor();

                    objectStoreRequest.onsuccess = (event) => {
                        // report the success of our request
                        const cursor = event.target.result;
                        if (cursor) {
                            if (cursor.value.id === primaryKey) {
                                


                                const request = cursor.delete();
                                request.onsuccess = () => {
                                    console.log('A better album year?');
                                };
                            };


                            cursor.continue();
                        } else {
                            console.log('Entries displayed.');
                        }
                        fetchFromDB()
                        document.getElementById("deleteEntry").classList.remove("show")


                    };


                };



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
    const deleteTransactionInputButton = document.getElementById("deleteTransaction")
    deleteTransactionInputButton.addEventListener("click", processDeleteInput)

    // get todays date
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd
    console.log(today)

    //set default date input value to today

    datePicker = document.getElementById("datePicker");
    datePicker.value = today;
    datePicker.max = today;

    //listen for selection event
    const readDatePickerInput = (e) => {
        selectedDate = e.target.value
        datePicker.value = selectedDate

        //set date header
        /*dateHeader = document.getElementById("dateHeader")
        dateHeader.innerHTML = selectedDate*/

        fetchFromDB()


    }

    datePicker.addEventListener("change", readDatePickerInput)

    //set date header
    /*dateHeader = document.getElementById("dateHeader")
    dateHeader.innerHTML = today*/











    const fetchFromDB = () => {
        console.log("fetchFromDB()")
        var res = new Array()

        const request = window.indexedDB.open("rosacareposDB", 3);


        request.onerror = (event) => {
            // Do something with request.errorCode!
            console.log("could not create database")
        };
        request.onsuccess = (event) => {
            // Do something with request.result!
            db = request.result


            // open a read/write db transaction, ready for retrieving the data
            const transaction = db.transaction("transactions", "readwrite");

            // report on the success of the transaction completing, when everything is done
            transaction.oncomplete = (event) => {
                console.log("Transaction completed.")
            };

            transaction.onerror = (event) => {
                console.log(transaction.error)
            };

            // create an object store on the transaction
            const objectStore = transaction.objectStore("transactions");

            // Make a request to get a record by key from the object store
            /*const objectStoreRequest = objectStore.getAll();

            objectStoreRequest.onsuccess = (event) => {
                // report the success of our request
                console.log("successful")

                const myRecord = objectStoreRequest.result;
                console.log(myRecord)

                
            };*/

            dateSelected = document.getElementById("datePicker").value
            console.log("dateSelected", dateSelected)
            const objectStoreRequest = objectStore.openCursor();

            objectStoreRequest.onsuccess = (event) => {
                // report the success of our request
                console.log("successful")

                const cursor = event.target.result;

                if (cursor) {
                    if (cursor.value.date === dateSelected) {

                        res.push(cursor.value)
                    } else {

                    }
                    cursor.continue()


                }
                else {
                    console.log("done")
                    reloadTableBody(res)
                }

            };


        };



    }


    const reloadTableBody = (res) => {
        console.log("updateTable():res", res)

        const container = document.getElementById("listContainer");
        container.innerHTML = ""

        /*res.forEach(element => {
            
            console.log("forLOOP():res", element)

            const template = document.getElementById("listItemTemplate");
            
            const listItem = template.content.firstElementChild.cloneNode(true);



            var id = listItem.querySelector("div.col-1.id")
            id.innerText = "1"

            var service = listItem.querySelector("div.col-3.service")
            service.innerText = element.service

            var attendant = listItem.querySelector("div.col-4.attendant")
            attendant.innerText = element.attendant

            var client = listItem.querySelector("div.col-4.client")
            client.innerText = element.client

            
            console.log(listItem)

            container.appendChild(listItem)

        });*/

        for (let [index, element] of res.entries()) {
            console.log("forLOOP():res", element, index)

            const template = document.getElementById("listItemTemplate");

            const listItem = template.content.firstElementChild.cloneNode(true);

            //set content
            listItem.id = index + 1
            listItem.dataset.primaryKey = element.id

            var id = listItem.querySelector("div.col-1.id")
            id.innerText = index + 1


            var service = listItem.querySelector("div.col-3.service")
            service.innerText = element.service

            var attendant = listItem.querySelector("div.col-4.attendant")
            attendant.innerText = element.attendant

            var client = listItem.querySelector("div.col-3.client")
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
            //accordionButton.aria - controls = "flush-collapse" + entryId
            accordionButton.dataset.bsTarget = "#flush-collapse" + entryId

            var accordionCollapse = listItem.querySelector("div.accordion-collapse")
            accordionCollapse.id = "flush-collapse" + entryId

            console.log(listItem)

            container.appendChild(listItem)
        }




    }
    fetchFromDB()

}
