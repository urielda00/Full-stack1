const user= req.user.name;
let userPname=user.charAt(0).toUpperCase() + user.slice(1);
document.getElementById("H1").innerHTML = `hello ${user}`;

