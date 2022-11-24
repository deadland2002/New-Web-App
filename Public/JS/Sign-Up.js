var index = 0;
var wid = 500;

const cards = document.querySelectorAll("#card");
const Prev = document.getElementsByClassName("prev");
const next = document.getElementsByClassName("next");
const form1 = document.getElementById('form');

Prev[0].style.opacity = .5;
Prev[0].style.pointerEvents = 'none';

next[next.length - 1].style.opacity = .5;
next[next.length - 1].pointerEvents = 'none';

function change(val) {
    const cards = document.querySelectorAll("#card");

    if (val == -1) {
        if (index === 0) {
            return 0;
        }
        else {
            cards[index].style.display = 'none';
            index -= 1;
            cards[index].style.display = 'flex';
        }
    } else {
        if (index+1 >= cards.length) {
            return;
        }
        else {
            cards[index].style.display = 'none';
            index += 1;
            cards[index].style.display = 'flex';
        }
    }

}

function show() {
    document.getElementById('home-bg').style.display = "none";
    document.getElementById('sub').style.display = "flex";
}

function containsSpecialChars(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}

function containsNumbers(str) {
    return /\d/.test(str);
}


async function submitotp(){
    const Otp = document.getElementById('OTP').value;
    const span_otp = document.getElementById('invalid-otp');
    const otp_btn = document.getElementById('otp-submit');

    if(Otp.length != 6){
        span_otp.innerText = "Enter Valid OTP";
        return;
    }
    
    const result = await fetch('/api/verifyotp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fullname,
            email,
            password
        })
    }).then(res => res.json()).then(data => { obj = data; }).catch(err => console.log(err));

    if (obj.status === "OK") {
        document.getElementById('fullname').value = "";
        document.getElementById('email').value = "";
        document.getElementById('password').value = "";
        otp_div.style.display = "block";
    } else if (obj.data === "1400") {
        span_email.innerText = "Email Exists"
    }
    else{
        alert(obj.data);
    }


    
}