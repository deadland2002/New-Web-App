const home = document.getElementById('home-bg');
const success = document.getElementById('success');
const span_res = document.getElementById('result-purchase');


async function purchase(category, id, cost) {
    const email = document.getElementById('email').value;


    console.log(category);
    console.log(id);
    console.log(email);

    home.style.pointerEvents = "none";
    home.style.cursor = "none";
    home.style.display = "none";

    success.style.display = "flex";

    span_res.innerText = "Purchasing......";
    span_res.style.color = "rgb(255, 255, 255)";

    var obj;

    const result = await fetch('/api/addid', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            category,
            id,
            cost
        })
    }).then(res => res.json()).then(data => { obj = data; }).catch(err => console.log(err));


    if (obj.status === "OK") {
        span_res.innerText = "Purchased";
        span_res.style.color = "rgb(0, 198, 20)";
    } else {
        span_res.innerText = "Failed";
        span_res.style.color = "rgb(198, 0, 0)";
    }

    setTimeout(async function () {
        success.style.display = "none";
        home.style.pointerEvents = "all";
        home.style.cursor = "auto";
        home.style.display = "flex";
        location.reload();
    }, 3000);
}

function CopyRefer(code) {
    navigator.clipboard.writeText(code);
    const btn_cpy = document.getElementById('copy');
    btn_cpy.innerText = "Copied";
    btn_cpy.style.backgroundColor = "rgb(34, 168, 0)";
}

function logout() {
    localStorage.removeItem('token');
    location.href = "/";
}


function addpost() {
    const post_div = document.getElementById('addpostdiv');
    const home_div = document.getElementById('home-bg');

    post_div.style.display = "flex";
    home_div.style.maxHeight = "100vh";


}

function closeaddpost(){
    const post_div = document.getElementById('addpostdiv');
    const home_div = document.getElementById('home-bg');

    post_div.style.display = "none";
    home_div.style.maxHeight = "100%";

    
}