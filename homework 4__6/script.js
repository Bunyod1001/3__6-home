let KEY = "50d9d72e";

let elForm = select("#form");
let elGenreSelect = select("#genreSelect");
let elList = select("#list");
let cardTemplate = select("#card-template").content;
let modalTemplate = select("#modal-template").content;

elForm.addEventListener("submit", evt => {
    evt.preventDefault()

    let {search, genre, sortBy} = evt.target.elements

    
    elList.innerHTML = `<div class="spinner-border color-red" style="width: 3rem; height: 3rem;" role="status">
    <span class="visually-hidden color-red">Loading...</span>
  </div>
  <div class="spinner-grow color-red" style="width: 3rem; height: 3rem; color-red" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>`
    getApi(search.value.trim(), KEY);

    let regex = new RegExp (search.value.trim(),"gi");
 
    let searchedFilms = films.filter(film => film.Title.match(regex));    
    if (genre.value != "all"){
        let filteredByGenre = searchedFilms.filter(film => film.genres.includes(genre.value));
        searchedFilms = filteredByGenre;
    }

    if(sortBy.value == "a-z"){
        searchedFilms.sort((a, b) => {
            if(a.Title > b.Title){
                return 1
            }else if (a.Title < b.Title){
                return -1
            }else {
                return 0
            }
        })
        }else if (sortBy.value =="z-a"){
            searchedFilms.sort((a, b) => {
                if(b.Title > a.Title){
                    return 1
                }else if (b.Title < a.Title){
                    return -1
                }else {
                    return 0
                }
            });
        }
        renderFunc(searchedFilms, elList);
    })

        
    async function getApi(search , key , year){
        let data =await fetch(`http://www.omdbapi.com/?apikey=${key}&s=${search}&y=${year}`)
    .then((res )=> res.json())
    .then((data) => (data.Search))
    .catch((error) => console.log(error));
    console.log(data);
    renderFunc(data, elList,films);
    }

        
    function renderFunc(array, element){
        element.innerHTML = null 

        array.forEach(film => {
            let newLi = document.createElement("li");
            let img = document.createElement("img")
            let year = document.createElement("year")
        

        img.src = film.Poster;    
        newLi.textContent = film.Title;
        year.textContent = film.Year;
        
        element.append(img, newLi, year);
    });
    }

        function renderGenre(array, element){
        let genereArr = [];
        
        array.forEach((film) => {
            film.genres.forEach(genre => {
                !genereArr.includes(genre) ? genereArr.push(genre) : null;
            })
        });
        
        genereArr.forEach((genre) => {
            let newOption = create("Option");
            newOption.textContent = genre;
            newOption.value = genre;
            
            element.append(newOption);
        });
    }
    renderGenre(films, elGenreSelect);
 
           

function renderFunc(array, element){
    element.innerHTML = null;
    array.forEach(film => {
        let cloneTemplate = cardTemplate.cloneNode(true);
        
        let li = select("li", cloneTemplate);
        let img = select("img", cloneTemplate);
        let h2 = select("h2", cloneTemplate);
        let h4 = select("h4", cloneTemplate);
        let btn = select("button", cloneTemplate);
        
        img.src = film.Poster;
        h2.textContent = film.Title;
        h4.textContent = film.Year;
        btn.dataset.id = film.id;

        btn.addEventListener("click", (evt) => {
    let filmId = evt.target.dataset.id;
    let cloneTemplateModal = modalTemplate.cloneNode(true);

    let foundFilm = array.find((item) => item.id == filmId);
    
    let modal = select("#modal", cloneTemplateModal );
    let iframe = select("iframe", cloneTemplateModal);
    let h2 = select("h2", cloneTemplateModal);
    let h3 = select("h3", cloneTemplateModal);
    let p = select("p", cloneTemplateModal);
    let h4 = select("h4", cloneTemplateModal);
    
    
    iframe.src = foundFilm.link;
    h2.textContent = foundFilm.Title;
    h3.textContent = `Genres: ${ foundFilm.genres.join(", ")}`;
    p.textContent = foundFilm.overview;
    h4.textContent =foundFilm.Year;
    document.querySelector("body").append(modal);
    

})


     
        element.append(li)
    })
}
renderFunc(films, elList);


function deleteModal(){
    const elModal = document.getElementById("modal");
    elModal.remove();
}