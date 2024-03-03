const search = document.querySelector('.search');
const searchButton = document.querySelector('#search-button');
const countriesWrapper = document.querySelector('.content__countries');

const filter = document.querySelector('.filter');
const filterWrapper = document.querySelector('.filter-wrapper');
const filterList = document.querySelector('.filter-list');
const filterItems = document.querySelectorAll('.filter-item');

const allCountriesButton = document.querySelector('.all-countries');
const loader = document.querySelector('.loader');
const changeMode = document.querySelector('.header__mode');
const modeText = document.querySelector('.header__mode-text');
const icon = document.querySelector('#arrow-icon');

const API_URL = 'https://restcountries.com/v3.1';

let pageMode = localStorage.getItem('mode');
let itemsArr = [];
let selected;

// LISTENERS

window.addEventListener('load', () => {
    inactive();

    requestApiAll();
})

searchButton.addEventListener('click', () => {
    if(search.value.length > 0){
        startSearch();
    }
});

window.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && search.value.length > 0){
        startSearch();
    }
});

changeMode.addEventListener('click', () => {
    if(!document.body.classList.contains('dark')){
        document.body.classList.add('dark');
        modeText.innerText = 'Light Mode';
        localStorage.setItem('mode', 'dark');
    } else {
        document.body.classList.remove('dark');
        modeText.innerText = 'Dark Mode';
        localStorage.clear();
    }
});

filter.addEventListener('click', () => {
    filterList.classList.toggle('hide');
    icon.classList.toggle('rotate');
});

filterItems.forEach(item => {
    item.addEventListener('click', () => {
        icon.classList.toggle('rotate');
        selectedItem(filterItems, item);
    })
})


checkMode();

function checkMode(){
    if (pageMode) {
        modeText.innerText = 'Light Mode';
        document.body.classList.add('dark');
    } else {
        modeText.innerText = 'Dark Mode';
        document.body.classList.remove('dark');
    }
}

function startSearch(){
    clearPage();
    searchByCountry(search.value);
    filterWrapper.classList.add('hide');
    allCountriesButton.classList.remove('hide');
    search.value = '';
}

function searchByCountry(country){
    const findCountry = itemsArr.find(el => {
        if (country === el.name.common || country === el.name.common.toLowerCase()
            || country === el.name.common.toUpperCase()) {
            return el;
        }
    })

    if(findCountry){
        templateHTML([findCountry]);
    } else {
        errorTemplate('Something went wrong.');
    }
}

function clearPage(){
    countriesWrapper.innerHTML = '';
}

function selectedItem(arr, item) {
    arr.forEach(el => {
        if (el === item) {
            el.classList.add('selected');
            selected = el;
        } else {
            el.classList.remove('selected');
        }
    });
    clearPage();
    filterList.classList.add('hide');
    if (selected.innerText == 'All') {
        templateHTML(itemsArr);
    } else {
        const regionArr = itemsArr.filter(filterByRegion)
        templateHTML(regionArr);
    }
}

function filterByRegion(item){
    if (item.region === selected.innerText) {
        return item;
    } else {
        return false
    }
}

function inactive(){
    search.classList.add('inactive');
    filterWrapper.classList.add('inactive');
}

function active(){
    search.classList.remove('inactive');
    filterWrapper.classList.remove('inactive');
}


function templateHTML(data) {
    let template = '';

    data.forEach(item => {
        template += `<div class="item">
                        <div class="image-wrapper">
                            <img src="${item.flags.png}" alt="flag">
                        </div>
                        <div class="info">
                            <div class="country-name">${item.name.common}</div>
                            <div class="population"><span>Population:</span> <span>${item.population}</span></div>
                            <div class="region"><span>Region:</span> <span>${item.region}</span></div>
                            <div class="capital"><span>Capital:</span> <span>${item.capital || 'none'}</span></div>
                        </div>
                    </div>`
    })
    countriesWrapper.insertAdjacentHTML('afterbegin', template);
    active();
}

function errorTemplate(error){
    let templateErr = '';
    templateErr = `<div class="error">
                            ${error}
                        </div>`;
    countriesWrapper.insertAdjacentHTML('afterbegin', templateErr);
}

function requestApiAll() {
    fetch(`${API_URL}/all`)
        .then(response => {
            if (response.ok) {
                return response.json();
            }

            throw new Error('Something went wrong.');
        })
        .then(data => {
            itemsArr = data;
            templateHTML(itemsArr)
        })
        .catch(err => errorTemplate(err.message))
}

function allCountries(){
    allCountriesButton.classList.add('hide');
    filterWrapper.classList.remove('hide');
    clearPage();
    filterItems.forEach(item => {
        if(item.innerText === 'All'){
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    })
    templateHTML(itemsArr);
}

