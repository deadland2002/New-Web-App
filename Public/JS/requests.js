async function accept(category,id,opr) {

    var obj;

    const result = await fetch("/api/adminpost", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            category,
            id,
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