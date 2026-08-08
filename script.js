// STORAGE


let users =
JSON.parse(localStorage.getItem("users")) || [];



let products =
JSON.parse(localStorage.getItem("products")) || [];



let sales =
JSON.parse(localStorage.getItem("sales")) || [];



// CART


let cart=[];



// CURRENT USER


let sessionUser =
JSON.parse(sessionStorage.getItem("sessionUser")) || null;





function saveUsers(){

localStorage.setItem(
"users",
JSON.stringify(users)
);

}



function saveProducts(){

localStorage.setItem(
"products",
JSON.stringify(products)
);

}



function saveSales(){

localStorage.setItem(
"sales",
JSON.stringify(sales)
);

}





function showSignup(){

document.getElementById("loginPage").style.display="none";

document.getElementById("signupPage").style.display="block";

}




function showLogin(){

document.getElementById("signupPage").style.display="none";

document.getElementById("loginPage").style.display="block";

}

function signup(){


let username =
document.getElementById("signupUser")
.value.trim();


let password =
document.getElementById("signupPass")
.value;


let role =
document.getElementById("accountType")
.value;

let gender =
document.querySelector('input[name="gender"]:checked');


if(
username==="" ||
password==="" ||
role==="" ||
!gender

){

alert("Please fill all fields.");

return;

}




let exists =
users.find(
user=>user.username===username
);



if(exists){

alert("Username already exists.");

return;

}





users.push({

username:username,

password:password,

role:role,

gender:gender.value

});




saveUsers();



alert("Account created successfully.");



document.getElementById("signupUser").value="";

document.getElementById("signupPass").value="";

document.getElementById("accountType").value="";

document.querySelectorAll('input[name="gender"]')
.forEach(radio => radio.checked = false);


showLogin();



}









function login(){



let username =
document.getElementById("loginUser")
.value.trim();



let password =
document.getElementById("loginPass")
.value;



let foundUser =
users.find(

user=>

user.username===username &&

user.password===password

);





if(!foundUser){


alert("Invalid username or password.");

return;


}




sessionUser={


username:foundUser.username,


role:foundUser.role


};






sessionStorage.setItem(

"sessionUser",

JSON.stringify(sessionUser)

);




openDashboard();



}









function openDashboard(){



if(!sessionUser){

return;

}




document.getElementById("loginPage")
.style.display="none";



document.getElementById("signupPage")
.style.display="none";



document.getElementById("dashboard")
.style.display="block";





document.getElementById("currentUser")
.textContent=sessionUser.username;







if(sessionUser.role==="keeper"){



document.getElementById("keeperPanel")
.style.display="block";



document.getElementById("customerPanel")
.style.display="none";



displayKeeperProducts();



}







if(sessionUser.role==="customer"){



document.getElementById("keeperPanel")
.style.display="none";



document.getElementById("customerPanel")
.style.display="block";



displayCustomerProducts();



}



}









function logout(){



sessionStorage.removeItem(

"sessionUser"

);



sessionUser=null;


cart=[];



document.getElementById("dashboard")
.style.display="none";



document.getElementById("loginPage")
.style.display="block";



document.getElementById("loginUser").value="";

document.getElementById("loginPass").value="";



}
function addProduct(){


let name =
document.getElementById("productName")
.value.trim();



let price =
parseFloat(
document.getElementById("productPrice").value
);



let stock =
parseInt(
document.getElementById("productStock").value
);





if(
name==="" ||
isNaN(price) ||
isNaN(stock) ||
price<0 ||
stock<0

){

alert("Enter valid product details.");

return;

}




products.push({

id:Date.now(),

name:name,

price:price,

stock:stock

});





saveProducts();



document.getElementById("productName").value="";

document.getElementById("productPrice").value="";

document.getElementById("productStock").value="";



displayKeeperProducts();



}








function displayKeeperProducts(){



let table =
document.getElementById("keeperProducts");



table.innerHTML="";




products.forEach((product,index)=>{



table.innerHTML+=`


<tr>


<td>${product.name}</td>


<td>$${product.price.toFixed(2)}</td>


<td>${product.stock}</td>


<td>


<button
class="action edit"
onclick="editProduct(${index})">

Edit

</button>



<button
class="action restock"
onclick="restockProduct(${index})">

Restock

</button>



<button
class="action delete"
onclick="deleteProduct(${index})">

Delete

</button>


</td>


</tr>


`;



});



}








function editProduct(index){



let product =
products[index];



let name =
prompt(
"Product name:",
product.name
);



let price =
prompt(
"Product price:",
product.price
);




if(name!==null && name!==""){

product.name=name;

}



if(price!==null && !isNaN(price)){

product.price=parseFloat(price);

}




saveProducts();


displayKeeperProducts();



}









function restockProduct(index){



let amount =
parseInt(
prompt("Quantity to add:")
);





if(
!isNaN(amount) &&
amount>0

){



products[index].stock += amount;



saveProducts();



displayKeeperProducts();



}



}








function deleteProduct(index){



if(confirm("Delete product?")){



products.splice(index,1);



saveProducts();



displayKeeperProducts();



}



}









function displayCustomerProducts(){



let table =
document.getElementById("customerProducts");



table.innerHTML="";



let search =
document.getElementById("searchProduct")
.value
.toLowerCase();





products.forEach((product,index)=>{



if(
product.name
.toLowerCase()
.includes(search)

){



table.innerHTML+=`


<tr>


<td>${product.name}</td>


<td>$${product.price.toFixed(2)}</td>


<td>${product.stock}</td>


<td>


<button
class="action"
onclick="addToCart(${index})">

Add

</button>


</td>


</tr>


`;



}



});



}

function addToCart(index){


let product =
products[index];



if(product.stock<=0){


alert("Product is out of stock.");

return;


}





let item =
cart.find(
c=>c.id===product.id
);



if(item){



if(item.quantity>=product.stock){


alert("Maximum stock reached.");

return;


}



item.quantity++;



}

else{



cart.push({

id:product.id,

name:product.name,

price:product.price,

quantity:1

});



}



displayCart();



}









function displayCart(){



let table =
document.getElementById("cartTable");



table.innerHTML="";



let total=0;




cart.forEach((item,index)=>{



let amount =
item.price * item.quantity;



total+=amount;



table.innerHTML+=`


<tr>


<td>${item.name}</td>


<td>${item.quantity}</td>


<td>$${amount.toFixed(2)}</td>


<td>


<button
class="action delete"
onclick="removeCartItem(${index})">

Remove

</button>


</td>


</tr>


`;



});




document.getElementById("cartTotal")
.textContent=total.toFixed(2);



}









function removeCartItem(index){


cart.splice(index,1);


displayCart();


}









function checkout(){



if(cart.length===0){


alert("Cart is empty.");

return;


}




let total=0;



cart.forEach(item=>{



let product =
products.find(
p=>p.id===item.id
);



if(product){


product.stock-=item.quantity;


}



total+=item.price*item.quantity;



});






sales.push({

customer:sessionUser.username,

date:new Date().toLocaleString(),

total:total

});





saveProducts();

saveSales();



cart=[];



displayCart();


displayCustomerProducts();



alert(
"Purchase completed.\nTotal: $"+
total.toFixed(2)
);



}









// RESTORE LOGIN AFTER REFRESH


window.onload=function(){



let savedSession =
sessionStorage.getItem("sessionUser");



if(savedSession){



sessionUser=
JSON.parse(savedSession);



openDashboard();



}



};
