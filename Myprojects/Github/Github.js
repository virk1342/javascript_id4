const container = document.querySelector('.container');
const input = document.querySelector('#searchbar');
const button = document.querySelector('#searchbtn');


button.addEventListener('click',getUser);

const url = 'https://api.github.com/users/';

const api = 'abcd'


let repositories = [];

function getUser(){

    //data = input.value;   //enu use ni kr skde kiunki eh string value dinda
    

//try  n   catch   
// appa nu data eda da kuj milda fetch nal
//                   status: 200,
//                   ok: true
// 
//. taan fer appa try catch use krange error hadling lyi odo chakkar a

//chakkar ki a k catch sirf runtime error handle krda , fetch nal aunda error netrwork ala
//ohde lyi appa ik check krde a k j ok di value false a taa error a nhita thika 

//pr j appa catch use krna fer appa error throw krwona j ok false aunda jihnu catch ,catch lrlwe.

try{


const response = await fetch(url)

if (response.ok ===false){
    throw new Error('API request failed with status ' + response.status);

const data = await response.json();
}

}
catch(error){
}


repositories = repoData;//means repositories ch repoData store krde a
//why? kinki appa repositories ch data store krna chaunde a jinu appa sort krange te display krange

//appa ure data nu sort kita

//jive j sort  10,3,7 nu 3,7,10 krda a

//sort ta kita kiunki Repo ja repositories CH STARS count a (stargazer_count)

//example
//a = {
//    name: "redux",
//    stargazers_count: 60000
// }

// b = {
//    name: "react",
//    stargazers_count: 235000
// }

//ethe sort krn te b.stargazers_count - a.stargazers_count krn te react redux 
// to upar a jayega kyunki react de stargazers_count zyada ne

// kinki 235000 - 60000 = 175000 > 0


repositories.sort((a,b)=>{
    return b.stargazers_count - a.stargazers_count;

});


//taking top five repositories

const TopRepos = repositories.slice(0,5); //slice 0 to 5 krde a top 5 repositories nu

//displaying top 5 repositories

TopRepos.forEach(repo => {
    const repoElement = document.createElement('div');
    repoElement.classList.add('repo');
    repoElement.innerHTML = `
        <h2>${repo.name}</h2>
        <p>Stars: ${repo.stargazers_count}</p>
    `;
    container.appendChild(repoElement);
});



//render profile

