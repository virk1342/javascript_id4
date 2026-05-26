const container =document.querySelector('.container');
const searchbtn = document.querySelector('.button');
const input = document.querySelector('.input');



searchbtn.addEventListener('click',GetMovie);

const apiKey = 'abcd'

async function GetMovie(){
    const movieName= input.value;


    try{
    const url = `http://www.omdbapi.com/?s=${movieName}&apikey=${apiKey}`;
                                      // ^ t =one movie search, s=search for multiple movies
    
    
    //cram this
    const response = await fetch(url);
    const data = await response.json();
const movies = data.Search;



//simple way to display movies
// movies.forEach(movie => {
//     const movieElement = document.createElement('div');
//     movieElement.classList.add('movie');

//     const title = document.createElement('h2');
//     title.textContent = movie.Title;
//     movieElement.appendChild(title);

//     const poster = document.createElement('img');
//     poster.src = movie.Poster;
//     movieElement.appendChild(poster);

//     container.appendChild(movieElement);
    


    
// )};

//but our assignment says using map method to display movies

container.innerHTML =movies.map(movie=>{



    return `
    <div class="moviee">
        <h2>${movie.Title}</h2>
        <img src="${movie.Poster}" alt="${movie.Title}">
    </div>


    `
}).join("");

//.join converts array into strings


    }
    catch(error){
        console.error('error fetching movie data:', error);
    }
}