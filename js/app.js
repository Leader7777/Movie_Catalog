// DOM elements
const elForm = document.querySelector("#form");
const elFormInput = document.querySelector("#InputName");
const elFormSelect = document.querySelector("#category-select");
const elFormSelectRating = document.querySelector("#rating-select");
const elRating = document.querySelector("#InputRating");
const elMovieWrapper = document.querySelector("#MovieWrapper");
const elTemplateFilm = document.querySelector("#FilmTemplate").content;
const elTemplateBookmarked = document.querySelector("#bookmarkedTemplate").content;
const elBookmarkedList = document.querySelector("#bookmarkedList");
const elMoviemodal = document.querySelector(".movie-modal");
const elAlert = document.querySelector("#alert");


// Get movies

const SlicedMovies = movies.slice(0,100);

let NormolizeOfFilm = SlicedMovies.map((array , index) => {
    
    return {
        id: index + 1, 
        FilmIMG: `https://i.ytimg.com/vi/${array.ytid}/mqdefault.jpg`,
        FilmNAME: array.Title.toString().toUpperCase(),
        FilmCATEGORIES: array.Categories, 
        FilmRATINGS: array.imdb_rating, 
        FilmLINK: `https://www.youtube.com/watch?v=${array.ytid}`,
        summary:array.summary
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
        TemplateWrap.querySelector("#FilmPlayBookmarked").dataset.bookmarkedId = item.id
        TemplateWrap.querySelector("#FilmPlayMoreInfo").dataset.modalId = item.id
       

        
        elFragment.appendChild(TemplateWrap)
    })

    var arrayLenght = array.length

    if (arrayLenght === 0) {
        elAlert.textContent = "Not found!"
        elAlert.classList.add("alert-dander")
    }else{
        elAlert.textContent = `${arrayLenght}` + " ta kinolar topildi"
        elAlert.classList.remove("alert-dander")
    }
    


    PlaceOfArray.appendChild(elFragment)
}

RenderMovies(NormolizeOfFilm,elMovieWrapper)

var FindFunction = function(title , rating , categorie) {
    
    return NormolizeOfFilm.filter(function (item) {
        
        let CategoryControl = categorie === "All" || item.FilmCATEGORIES.split("|").includes(categorie);
        
        return item.FilmNAME.match(title) && item.FilmRATINGS >= rating && CategoryControl;
    });
};

// AddEvtListener Form

elForm.addEventListener("input" , (evt) => {
    
    evt.preventDefault()
    
    let Title = elFormInput.value.trim()
    let Rating = elRating.value
    let Categorie = elFormSelect.value
    let SortType = elFormSelectRating.value
    
    let PatternTitle = new RegExp(Title , "gi")
    let Result = FindFunction(PatternTitle , Rating , Categorie)
    
    if (SortType === "High") {
        Result.sort((a,b) => a.FilmRATINGS - b.FilmRATINGS)
        console.log(Result);
    }
    
    if (SortType === "Low") {
        Result.sort((b,a) => a.FilmRATINGS - b.FilmRATINGS)
        console.log(Result);
    }
    
    RenderMovies(Result, elMovieWrapper)
})

// Get bookmarked movies

let storage = window.localStorage

let bookmarkeds = JSON.parse(storage.getItem("movieArray")) || []

elMovieWrapper.addEventListener("click" , function (evt) {
    let MovieId = evt.target.dataset.bookmarkedId
    
    if (MovieId) {
        let foundMovie = NormolizeOfFilm.find(item => MovieId == item.id)
        
        let controlbook = bookmarkeds.findIndex(item => foundMovie.id === item.id)
        
        if (controlbook === -1) {
            bookmarkeds.push(foundMovie)
            storage.setItem("movieArray", JSON.stringify(bookmarkeds))
            RenderBookmarkeds(bookmarkeds , elBookmarkedList )
        }
    }    
})

function RenderBookmarkeds(array , PlaceOfArray) {
    PlaceOfArray.innerHTML = null
    
    let elFragment = document.createDocumentFragment()
    
    array.forEach(item => {
        let templateBookmark = elTemplateBookmarked.cloneNode(true)
        
        templateBookmark.querySelector("#bookmarkedImg").src = item.FilmIMG
        templateBookmark.querySelector("#bookmarkedName").textContent = item.FilmNAME
        templateBookmark.querySelector("#bookmarkedBtn").dataset.removeBtn = item.id
        templateBookmark.querySelector("#bookmarkedBtnPlay").href = item.FilmLINK
        
        elFragment.appendChild(templateBookmark)
    });
    
    PlaceOfArray.appendChild(elFragment)
}

RenderBookmarkeds(bookmarkeds , elBookmarkedList )


// Get Modal Movies
elBookmarkedList.addEventListener("click" , (evt) => {
    let deleteId = evt.target.dataset.removeBtn
    
    if (deleteId) {
        let indexOfMovie = bookmarkeds.findIndex(function (item) {
            return item.id == deleteId
        })
        
        bookmarkeds.splice(indexOfMovie, 1)
        storage.setItem("movieArray", JSON.stringify(bookmarkeds))
        storage.clear()
        
        RenderBookmarkeds(bookmarkeds, elBookmarkedList);
    }
    
})

elMovieWrapper.addEventListener("click" , (evt) => {
    let modalbtn = evt.target.dataset.modalId

    if (modalbtn) {
        let foundModal = NormolizeOfFilm.find(item => modalbtn == item.id)

        elMoviemodal.querySelector(".modal-heading").textContent = foundModal.FilmNAME
        elMoviemodal.querySelector(".modal-text").textContent = foundModal.summary
        
    }    


})

// Get clock
function clock() {
    var today = new Date();
    
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();

    
    if (hours < 10) {
        hours = "0" + hours;
    }
    
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    
    document.querySelector(".hours").innerHTML = hours;
    document.querySelector(".minutes").innerHTML = minutes;
    document.querySelector(".seconds").innerHTML = seconds;
    document.querySelector(".period").innerHTML = period;
}

let updateClock = setInterval(clock, 1000)
















































































































