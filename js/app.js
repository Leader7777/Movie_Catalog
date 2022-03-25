// DOM elements
const elForm = document.querySelector("#form");
const elFormInput = document.querySelector("#InputName");
const elFormSelect = document.querySelector("#category-select");
const elSearchResults = document.querySelector("#SearchResults");
const elMovieWrapper = document.querySelector("#MovieWrapper");
const elTemplateFilm = document.querySelector("#FilmTemplate").content;

// Get movies
const SlicedMovies = movies.slice(0,100);

let NormolizeOfFilm = SlicedMovies.map(ItemMovie => {

    return {
        FilmIMG: `https://i.ytimg.com/vi/${ItemMovie.ytid}/mqdefault.jpg`,
        FilmNAME: ItemMovie.Title.toString().toUpperCase(),
        FilmCATEGORIES: ItemMovie.Categories, 
        FilmRATINGS: ItemMovie.imdb_rating, 
        FilmLINK: `https://www.youtube.com/watch?v=${ItemMovie.ytid}`  
    }
})

// Generate Categories
function GeneretedCategories(array) {
    let ArrayMovies = []

    array.forEach(item => {
        let ControlCategorie = item.FilmCATEGORIES.split("|")

        ControlCategorie.forEach(item => {
            if (!ArrayMovies.includes(item)) {
                ArrayMovies.push(item)
            }
        });
    });

    ArrayMovies.sort()

    let CategoryFragment = document.createDocumentFragment()

    ArrayMovies.forEach(item => {
        let CategoryOption = document.createElement("option")
        CategoryOption.value = item
        CategoryOption.textContent = item
        CategoryFragment.appendChild(CategoryOption)
    });
    elFormSelect.appendChild(CategoryFragment)
}

GeneretedCategories(NormolizeOfFilm)

// Render movies
function RenderMovies(array , PlaceOfArray) {
    PlaceOfArray.innerHTML = null

    let elFragment = document.createDocumentFragment()

    array.forEach(item => {

        let TemplateWrap = elTemplateFilm.cloneNode(true);

        TemplateWrap.querySelector("#FilmImg").src = item.FilmIMG
        TemplateWrap.querySelector("#FilmName").textContent = item.FilmNAME
        TemplateWrap.querySelector("#FilmCategories").textContent = item.FilmCATEGORIES.split("|").join(" ")
        TemplateWrap.querySelector("#FilmRating").textContent = item.FilmRATINGS
        TemplateWrap.querySelector("#FilmPlay").href = item.FilmLINK

        elFragment.appendChild(TemplateWrap);
    });

    elMovieWrapper.appendChild(elFragment);
    elSearchResults.textContent = array.length
    
}

RenderMovies(NormolizeOfFilm,elMovieWrapper);

// AddEvtList Form
elForm.addEventListener("submit", (evt) => {
    evt.preventDefault()

    let OptionSelect = elFormSelect.value
    let ArraySide = []

    if (OptionSelect === "All") {
        ArraySide = NormolizeOfFilm
    } else {
        ArraySide = NormolizeOfFilm.filter(function (item) {
            return item.FilmCATEGORIES.split("|").includes(OptionSelect)
        })
    }

    RenderMovies(ArraySide, elMovieWrapper)
})

elForm.addEventListener("input", (evt) => {
    evt.preventDefault()

    let InputName= elFormInput.value.toUpperCase()
    let arraySide = []

    if (arraySide = NormolizeOfFilm.filter(function (item) {
        return item.FilmNAME.includes(InputName)
    })) 
    

    RenderMovies(arraySide, elMovieWrapper)
})












































































