/*

cant keep track of things due to so much comments but I cant remeber what i did so let them be there!!
lots of if-else, find a way around to keep things simple


*/

const mainDisp = document.querySelector('.main-disp');
const subDisp = document.querySelector('.sub-disp');
const regDisp = document.querySelector('.reg-disp');
var text = '';
var subTxt = '';
var result1 = 0;
let operator, num1, num2;

const operatorRegEx = /[-+/*%]/g;
const numberRegExp = /[0-9]/g;

function Calculator(keyPressed) {

    //if key pressed is not a number || shift||enter||arith operators || = || backspace||%
    //alert char is not allowed
    //if there is a text already ,then keep it
    if (!(keyPressed.match(numberRegExp) || keyPressed == 'Shift' || keyPressed == 'Enter' || keyPressed.match(operatorRegEx) || keyPressed == '='
        || keyPressed == 'Backspace' || keyPressed == '%' || keyPressed == '.' || keyPressed == '!'
        || keyPressed == 'MP' || keyPressed == 'MS' || keyPressed == 'MC')) {
        alert('Text not allowed')
        mainDisp.innerHTML = text;
        return;
    }
    else {

        if (keyPressed == 'MP' || keyPressed == 'MS' || keyPressed == 'MC') {
            MemoryFunctions(keyPressed);
        }

        //% in calculator , my phone always divides it by 100, and then it allows you to append numbers
        //i am doing the same thing here
        if (keyPressed == '%' && mainDisp.innerHTML.length > 0) {

            const percent = Calculate('/', mainDisp.innerHTML, '100');
            mainDisp.innerHTML = percent;
            subDisp.innerHTML = percent;
            text = percent;
            return;
        }

        //if a valid key is pressed then:
        //-> keep storing or append the incoming stream in to a variable 
        //show this in the main display

        if (keyPressed.match(numberRegExp) || keyPressed == '.') {

            if (subDisp.innerHTML.includes('=')) {
                Clear();
                text = '';
            }

            text = text + keyPressed;
            ShowInputInDisplay(text);
            return;
        }

        // pressing backspace :
        //if this is during the initial stage then allow backspace keep slicing the text -> one can go until 0
        //if the last part of the string in sub display is an operator then do nothing, keep it, continue append
        //if this is after performing an operation with a result then dont allow backspace ,
        //clear the sub display are keep the main entry - but resets on button 
        if (keyPressed == 'Backspace') {
            if (subDisp.innerHTML == '' && text.length > 0) {
                text = text.slice(0, text.length - 1);
                text.length > 0 ? ShowInputInDisplay(text) : ShowInputInDisplay(0);
            }

            if (subDisp.innerHTML.length > 0 && !(subDisp.innerHTML[subDisp.innerHTML.length - 1].match(operatorRegEx))) {
                subDisp.innerHTML = '';
                text = '';
            }

        }

        //if key pressed is an operator:
        //move the string with operator pressed and show this in the sub display
        //on enter or = if the user have not entered a second number, use the first number as the second to perfor the operation
        //on continuous enter or = , keep operating with the last entered value
        //enter or eual without any value returns 0

        if (keyPressed.match(operatorRegEx) || keyPressed == 'Enter' || keyPressed == '=') {

            if (subTxt.length == 0 && text.length == 0) {
                ShowInputInDisplay(0);
                return;
            }


            //subTxt 
            //if sub disp is not yet enabled ie; only first value is entered and when an operator is pressed,
            //move the string with operator to sub disp, what is there in the main disp is assigned to text,
            //we use this when a result is use again for an operation 
            if (subTxt.length == 0 && keyPressed.match(operatorRegEx)) {
                text = mainDisp.innerHTML;
                operator = keyPressed;
                subTxt = subTxt + text + keyPressed;
                subDisp.innerHTML = subTxt;
                text = '';
            }
            else {
                //on what case subtxt becomes 0? initial case and after carrying out a calculation
                if (subTxt.length == 0 && (keyPressed == 'Enter' || keyPressed == '=')) {
                    //if a value is already available in the sub disp? 
                    //on multiple operations use the result from previous operation as num1
                    //find the number after operator that will be your num2
                    //return 0 if we dont have anything in sub disp user would have hit backspace, now start fresh
                    if (subDisp.innerHTML.length > 0) {
                        num1 = mainDisp.innerHTML;
                        num2 = subDisp.innerHTML.substring(subDisp.innerHTML.lastIndexOf(operator) + 1, subDisp.innerHTML.length - 1).trim();
                    } else {

                        return 0;
                    }

                } else {
                    ///there is a value in sub txt, we might have got it initially after pressing an operator
                    //if the text is null (when you hit enter without entering the second number),
                    //keep using the same number else use what the user enters as num2
                    num1 = subTxt.slice(0, subTxt.length - 1);
                    num2 = text == '' ? num1 : text;

                }

                //pressed key is enter or = calculate and display

                if (keyPressed == 'Enter' || keyPressed == '=') {

                    if (text == '') {
                        result1 = Calculate(operator, num1, num2);
                        subDisp.innerHTML = `${num1} ${operator} ${num2} =`;
                        ShowInputInDisplay(result1);
                        subTxt = '';
                        text = num2;

                    } else {

                        result1 = Calculate(operator, num1, num2);
                        subDisp.innerHTML = `${num1} ${operator} ${num2} =`;
                        ShowInputInDisplay(result1);
                        subTxt = '';
                        text = num2;
                    }

                }
            }
        }

        if (keyPressed == '!' && mainDisp.innerHTML != '') {
            if (mainDisp.innerHTML > 0) {
                text = -Math.abs(mainDisp.innerHTML);
                ShowInputInDisplay(text)
            } else {
                text = Math.abs(mainDisp.innerHTML);
                ShowInputInDisplay(text)
            }

        }
    }

    // console.log(keyPressed);

}

function MemoryFunctions(k) {
    var reg, regTxt;
    regTxt = regDisp.innerHTML;
    if (mainDisp.innerHTML.length > 0 && (k == 'MP' || k == 'MS')) {
        console.log('inhere');
        k == 'MP' ? k = 'M+' : k = 'M-'
        reg = mainDisp.innerHTML;
        if (regTxt.length <= 0) {
            console.log('yes')
            regDisp.innerHTML = `${k} ${reg}`;
            return;
        }

        if (regTxt.length > 0) {
            let n1 = regTxt[1] == '+' ? regTxt.slice(regTxt.indexOf('+') + 1, regTxt.length).trim() : regTxt.slice(regTxt.indexOf('-') + 1, regTxt.length).trim();
            console.log('n1', n1);
            let n2 = reg;
            console.log('n2', n2);
            let op = k == 'M+' ? '+' : '-';
            console.log('op', op)
            let res = Calculate(op, n1, n2);
            regDisp.innerHTML = `${k} ${res}`;
        }


    }

    if (k == 'MC') {
        regDisp.innerHTML = ''
    }

}



const ShowInputInDisplay = (data) => {
    mainDisp.innerHTML = data;

}

//calculation happens here
const Calculate = (operator, num1, num2) => {
    let result = 0;
    switch (operator) {
        case '+':
            result = +(num1) + +(num2);
            return result;

        case '-':
            result = num1 - num2;
            return result;

        case '*':
            result = num1 * num2;
            return result;

        case '/':
            result = num1 / num2;
            return result;

        default:
            break;
    }
}

function Animate(k) {
    const key = k == 'Enter' ? document.querySelector(`.keys[data-key="="]`) : document.querySelector(`.keys[data-key="${k}"]`);
    key.classList.add('pressed');
}

function Clear() {
    mainDisp.innerHTML = '';
    subDisp.innerHTML = '';
    text = '';
    subTxt = '';

    return 0;
}

function Clicked(e) {
    keyPressed = e.target.dataset.key;
    Animate(keyPressed);

    if (keyPressed == 'ce') {
        mainDisp.innerHTML = 0;
        text = '';
        return;
    }

    if (keyPressed == 'c') {
        Clear();
        return;
    }




    Calculator(keyPressed);
}

function Pressed(e) {
    //get the pressed key
    const keyPressed = e.key;
    Animate(keyPressed);
    Calculator(keyPressed);
}


function removeTransform(e) {
    //console.log(e);
    if (e.propertyName !== 'transform') return;
    this.classList.remove('pressed'); 1
};

//this is the main part, everything rolls from here

const keys = document.querySelectorAll('.keys');

keys.forEach(key => {
    key.addEventListener('click', Clicked);
    key.addEventListener('transitionend', removeTransform);

});


window.addEventListener('keydown', Pressed);


