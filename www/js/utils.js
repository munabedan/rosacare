// get todays date

const getDateToday = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + "-" + mm + "-" + dd
    console.log(today)
    return today
}




//set defaults
const loadPresets = () => {
    //set default date input value to today

    (() => {
        datePicker = document.getElementById("datePicker");
        datePicker.value = getDateToday();
        datePicker.max = getDateToday();
    })();


    //create db if it does not exist

    createDB();


    //update table

    updateTable();

    //set event listeners
    (() => {
        const newTransactionInputButton = document.getElementById("addTransaction")
        newTransactionInputButton.addEventListener("click", processNewInput)

        const editTransactionInputButton = document.getElementById("editTransaction")
        editTransactionInputButton.addEventListener("click", processEditInput)

        const deleteTransactionInputButton = document.getElementById("deleteTransaction")
        deleteTransactionInputButton.addEventListener("click", processDeleteInput)

        datePicker.addEventListener("change", processDatePickerInput)
    })();

}