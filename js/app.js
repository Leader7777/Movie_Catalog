// DOM elements
const elForm = document.querySelector("#form");
const elFormInput = document.querySelector("#InputName");
const elFormSelect = document.querySelector("#category-select");
const elFormSelectRating = document.querySelector("#rating-select");
const elRating = document.querySelector("#InputRating");
const elSearchResults = document.querySelector("#SearchResults");
const elMovieWrapper = document.querySelector("#MovieWrapper");
const elTemplateFilm = document.querySelector("#FilmTemplate").content;

// Get movies

const SlicedMovies = movies.slice(0,100);

let NormolizeOfFilm = SlicedMovies.map(array => {

    return {
        FilmIMG: `https://i.ytimg.com/vi/${array.ytid}/mqdefault.jpg`,
        FilmNAME: array.Title.toString().toUpperCase(),
        FilmCATEGORIES: array.Categories, 
        FilmRATINGS: array.imdb_rating, 
        FilmLINK: `https://www.youtube.com/watch?v=${array.ytid}`  
    }

});

// Generate categories

function GenerateCategories(array,PlaceOfArray) {
    let ControlCategorie = []

    array.forEach(item => {
        let SplittedItem = item.FilmCATEGORIES.split("|")

        SplittedItem.forEach(item => {
            if (!ControlCategorie.includes(item)) {
                ControlCategorie.push(item)
            }
        });
    });

    ControlCategorie.sort()

    let CategoryFragment = document.createDocumentFragment()

    ControlCategorie.forEach(item => {

        let CategoryOption = document.createElement("option")
        CategoryOption.value = item
        CategoryOption.textContent = item
        CategoryFragment.appendChild(CategoryOption)
    } )
    PlaceOfArray.appendChild(CategoryFragment)
}

GenerateCategories(NormolizeOfFilm , elFormSelect)

// Render Movies

function RenderMovies(array , PlaceOfArray) {

    PlaceOfArray.innerHTML = null

    elFragment = document.createDocumentFragment()

    array.forEach(item => {

        let TemplateWrap = elTemplateFilm.cloneNode(true);

        TemplateWrap.querySelector("#FilmImg").src = item.FilmIMG
        TemplateWrap.querySelector("#FilmName").textContent = item.FilmNAME
        TemplateWrap.querySelector("#FilmCategories").textContent = item.FilmCATEGORIES.split("|").join(", ")
        TemplateWrap.querySelector("#FilmRating").textContent = item.FilmRATINGS
        TemplateWrap.querySelector("#FilmPlay").href = item.FilmLINK

        elFragment.appendChild(TemplateWrap)
    })
    
    elSearchResults.textContent = array.length
    PlaceOfArray.appendChild(elFragment)
}

RenderMovies(NormolizeOfFilm,elMovieWrapper)

var FindFunction = function(title , rating , categorie) {
    
    return NormolizeOfFilm.filter(function (item) {

        let CategoryControl = categorie === "All" || item.FilmCATEGORIES.split("|").includes(categorie);

        return item.FilmNAME.match(title) && item.FilmRATINGS >= rating && CategoryControl;
    });
};

// AddEvtListener

elForm.addEventListener("input" , (evt) => {

    evt.preventDefault()

    let Title = elFormInput.value.trim()
    let Rating = elRating.value
    let Categorie = elFormSelect.value
    let SortType = elFormSelectRating.value

    let PatternTitle = new RegExp(Title , "gi")
    let Result = FindFunction(PatternTitle , Rating , Categorie)

    if (SortType === "High") {
        Result.sort((a,b) => a - b)
    }

    if (SortType === "Low") {
        Result.sort((b,a) => a - b)
    }

    RenderMovies(Result,elMovieWrapper)

})






















































































































