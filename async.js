//async means , 
//things that happen in sync
//like conolse.log("onn")
//conosle.log("two")
//these will come up lkike
//1
//2

//so happening in sync

//but we sometimes need to move to next function or whatever , we cant stay stuck on something
//so we have async functions
//like setTimeout(function, time) , this will run the function after the time is up
//so we can do something like this

console.log("one")
setTimeout(function(){
    console.log("two")
}, 1000)
console.log("three")

//this will print 
//one
//three
//two

//because the setTimeout is async and it will run after 1 second, while the rest of the code will continue to run without waiting for it to finish.

//so async functions are useful when we want to do something that takes time, like fetching data from an API, 
// or reading a file, or anything that might take some time to complete. We can use async functions 
// to avoid blocking the main thread and keep our application responsive.


//calbacks

//an argument to another function
//like in setTimeout, the first argument is a function, which is called a callback function,
//because it is called back by the setTimeout function after the time is up.


//like
function sum(a,b){
console.log(a+b)
}

function calculator(a,b,sumCallback){
sumCallback(a,b)
    

}
calculator(2,3,sum)//this will print 5, because the sum function is called as a callback function with the arguments 2 and 3, and it will print the result of the sum.



const hello = ()=>{
    console.log("hello")
};
setTimeout(hello, 3000) //this will print "hello" after 3 seconds, because the hello function is passed as a callback to the setTimeout function.


//callback hells
//when we have multiple nested callbacks, it can become difficult to read and maintain the code, this is called callback hell.


//nesting is when we have a function inside another function, and that function is inside another function, and so on.
//  This can lead to code that is hard to read and understand, especially if there are many levels of nesting.

//example of callback hell

let age = 18;
if(age>=60){
    if(age>=80){
        console.log("you are old")
    }else{
        console.log("you are middle aged")
    }
}else{
    console.log("you are young")
}
//to solve this problem we can use promises or async/await, 
// which are more modern ways to handle asynchronous code and avoid callback hell.

//easy example of promises

let promise = new Promise(function(resolve, reject){
    let a = 1 + 1;
    if(a == 2){
        resolve("success")
    }else{
        reject("failure")
    }
})

promise.then(function(message){
    console.log("this is in the then " + message)
}).catch(function(message){
    console.log("this is in the catch " + message)
})

//this will print "this is in the then success" because the promise is resolved 
// with the message "success", and the then function is called with that message.
//  If the promise was rejected, the catch function would be called with the message "failure".

//promises are a way to handle asynchronous code in a more elegant way,
// they allow us to chain multiple asynchronous operations together and handle errors more easily. 
// They also help to avoid callback hell and make our code more readable and maintainable.

//async/await is another way to handle asynchronous code, it is built on top of 
// promises and allows us to write asynchronous code in a more synchronous way, 
// making it easier to read and understand.

//example of async/await

function resolveAfter2Seconds() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve('resolved');
      }, 2000);
    });
  }
  
  async function asyncCall() {
    console.log('calling');
    const result = await resolveAfter2Seconds();
    console.log(result);
  }
  
  asyncCall();


  



  