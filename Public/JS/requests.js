async function accept(id, category, title, content, coin, email, opr) {

    var obj;

    const result = await fetch("/api/adminpost", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id,
            category,
            title,
            content,
            coin,
            email,
            opr
        })
    }).then(res => res.json()).then(data => { obj = data; });

    if (obj.status === "OK") {
        alert("Submitted successfully");
        location.reload();
    } else {
        alert(obj.data);
    }


}