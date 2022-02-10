const form = document.getElementById('userForm');
const firstName = document.getElementById('firstname');
const lastName = document.getElementById('lastname');
const pincode = document.getElementById('pincode');
const address = document.getElementById('address');
const genderArr = document.userForm.gender;
const foodArr = document.querySelectorAll('input[type=checkbox]');
const state = document.getElementById('state');
const country = document.getElementById('country');
const tableRowCount = document.querySelectorAll("#table-body tr");
const tableBody = document.getElementById('table-body');
var gender;
var id = 1;


form.addEventListener('submit', (e) => {
    var foodPref = [];
    //Address field validation
    if (address.value == '' || address.value == ' ') {
        e.preventDefault();
        alert('Address field cannot be null');
        address.focus();
        return false;

    }

    //Gender validation
    for (let i = 0; i < genderArr.length; i++) {

        if (genderArr[i].checked) {
            gender = genderArr[i].value;
            break;
        }

        if (i == genderArr.length - 1) {
            e.preventDefault();
            alert('A gender need to be selected');
            return false;
        }
    }

    //food  pref validation
    for (let i = 0; i < foodArr.length; i++) {

        if (foodArr[i].checked) {
            foodPref.push(foodArr[i].value);
        }
    }

    if (foodPref.length === 0 || foodPref.length < 2 || foodPref == 'undefined') {
        e.preventDefault();
        alert('You should select atleast 2 food items');
        return false;
    }
    //
    if (state.value == '' || state.value == ' ') {
        e.preventDefault();
        alert('State field cannot be null');
        state.focus();
        return false;
    }

    //
    if (country.value == '' || country.value == ' ') {
        e.preventDefault();
        alert('Country field cannot be null');
        country.focus();
        return false;
    }



    //validate success add row


    const html = `
            <tr>
                <td class="text-wrap">${id++}</td>
                <td class="text-wrap">${firstName.value} ${lastName.value}</td>
                <td class="text-wrap">${address.value}</td>
                <td class="text-wrap">${gender}</td>
                <td class="text-wrap">${foodPref.join(", ")}</td>
                <td class="text-wrap">${state.value}, ${country.value}</td>
            </tr>
            `

    tableBody.innerHTML = tableBody.innerHTML.concat(html);
    e.preventDefault();
    form.reset();
});