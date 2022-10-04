// create database if it does not exist

const createDB = () => {


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

        // Create an objectStore to hold information on our records. We're
        // going to use "id" as our key path because it's guaranteed to be
        // unique.
        const objectStore = db.createObjectStore("transactions", { keyPath: "id" });

        // Create an index to search records by date.
        objectStore.createIndex("date", "date", { unique: false });



        objectStore.transaction.oncomplete = (event) => {

            db.close()

        };



    };
}

//save record to database
//const saveTransactionToDb = (transactionOBJ) => {
//=>const createTransaction = (transactionOBJ) => {

const createTransaction = (transactionOBJ) => {
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

        updateTable()

    };



}


//update record
//const updateTransaction = (transactionOBJ) => {
//=>const updateTransaction = (transactionOBJ) => {

const updateTransaction = (transactionOBJ) => {
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
                if (cursor.value.id === transactionOBJ.id) {
                    const updateData = cursor.value;

                    updateData.service = transactionOBJ.service;
                    updateData.attendant = transactionOBJ.attendant;
                    updateData.client = transactionOBJ.client;
                    updateData.price = transactionOBJ.price;
                    updateData.hasPaid = transactionOBJ.hasPaid;
                    updateData.balance = transactionOBJ.balance;



                    const request = cursor.update(updateData);
                    request.onsuccess = () => {
                        console.log('A better album year?');
                    };
                };


                cursor.continue();
            } else {
                console.log('Entries displayed.');
            }
            updateTable()
            document.getElementById("editEntry").classList.remove("show")


        };


    };
}


//delete record
//const deleteTransaction = (transactionOBJ) => {
//=>const deleteTransaction = (transactionOBJ) => {

const deleteTransaction = (transactionOBJ) => {
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
                if (cursor.value.id === transactionOBJ.primaryKey) {



                    const request = cursor.delete();
                    request.onsuccess = () => {
                        console.log('A better album year?');
                    };
                };


                cursor.continue();
            } else {
                console.log('Entries displayed.');
            }
            updateTable()
            document.getElementById("deleteEntry").classList.remove("show")


        };


    };
}

//read from db
//const fetchFromDB = () => {
//=>const readTransaction = () => {

const readTransaction = () => {
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
                updateTableRows(res)
            }

        };


    };



}
