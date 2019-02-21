"use strict";

// ---------- default SPA Web App setup ---------- //
// hide all pages
function hideAllPages() {
    let pages = document.querySelectorAll(".page");
    for (let page of pages) {
        page.style.display = "none";
    }
}

// show page or tab
function showPage(pageId) {
    hideAllPages();
    console.log(pageId);
    document.querySelector(`#${pageId}`).style.display = "grid";
    setActiveTab(pageId);
    if (pageId == "forside") {
      showAllMovies();
    }
}

// set default page
function setDefaultPage(defaultPageName) {
    if (location.hash) {
        defaultPageName = location.hash.slice(1);
    }
    showPage(defaultPageName);
}

// sets active tabbar/ menu item
function setActiveTab(pageId) {
    let pages = document.querySelectorAll(".tabbar a");
    for (let page of pages) {
        if (`#${pageId}` === page.getAttribute("href")) {
            page.classList.add("active");
        } else {
            page.classList.remove("active");
        }

    }
}

// ---------- Fetch data from data sources ---------- //

// Fetches pages json data from headless cms

fetch("http://rysholt.com/wordpress/wp-json/wp/v2/pages?_embed")
    .then(function (response) {
        return response.json();
    })
    .then(function (pages) {
        appendPages(pages);
    });


// Appends and generate pages

function appendPages(pages) {
    var menuTemplate = "";
    for (let page of pages) {
        addPage(page);
    }
    setDefaultPage("forside"); // selecting the first page in the array of pages
    getMovies();
    getCategories();
    getTags();
}

// appends page section to the DOM
function addPage(page) {
    document.querySelector("#pages").innerHTML += `
  <section id="${page.slug}" class="page">
    ${page.content.rendered}
  </section>
  `;
}

function addCategory(category) {
    document.querySelector("#pages").innerHTML += `
  <section id="${category.slug}" class="page">
    <section class="container"></section>
  </section>
  `;
}

// Fetches post data from headless cms
function getMovies() {
    fetch('http://rysholt.com/wordpress/wp-json/wp/v2/posts?_embed')
        .then(function (response) {
            return response.json();
        })
        .then(function (movies) {
            appendMovies(movies);
        });
}

// Appends json data to the DOM
function appendMovies(movies) {
    let htmlTemplate = "";
    for (let movie of movies) {
        console.log(movie);
        htmlTemplate += `
        <div class="flip-container tag-${movie.tags[0]}" onclick="this.classList.toggle('click');">
        <div class="flipper">
        <article class="front">
        <div style="background-image:url(${getFeaturedImageUrl(movie)})" class="front1"></div>
          <div class="front2">
            <h3>${movie.title.rendered}</h3>
            <h5>${movie.acf.subtitle}</h5>
          </div>
        </article>
        <article class="back">
          <section class="secwhite">
            <iframe width="100% auto" height="auto" frameborder="0" allowfullscreen="allowfullscreen" gyroscope; picture-in-picture"
              src="https://youtube.com/embed/${movie.acf.trailer}">
            </iframe>
              <div class="fronttit">
                <h3>${movie.title.rendered}</h3>
                <h5>${movie.acf.subtitle}</h5>
              </div>
              <p>${movie.acf.description}</p>
        </section>
        <section class="backbutt">
          <h4>FAKTA</h4>
          <h4>MEDVIRKENDE</h4>
          <h4>ANMELDELSER</h4>
          <h4 class="buy">BILLETTER</h4>
        </section>
        </article>
        </div>
        </div>
    `;
    }
    document.querySelector("#forside").innerHTML += htmlTemplate;
}

function showFakta() {
  document.getElementById("demo").innerHTML = "Hello World";
}



// Appends json data to the DOM
function appendCategoriesMovies(movies, slug) {
    let htmlTemplate = "";
    for (let movie of movies) {
        console.log();
        htmlTemplate += `
        <div class="flip-container" onclick="this.classList.toggle('click');">
        <div class="flipper">
        <article class="front">
        <div style="background-image:url(${getFeaturedImageUrl(movie)})" class="front1"></div>
          <div class="front2">
            <h3>${movie.title.rendered}</h3>
            <h5>${movie.acf.subtitle}</h5>
          </div>
        </article>
        <article class="back">
          <section class="secwhite">
            <iframe width="100% auto" height="auto" frameborder="0" allowfullscreen="allowfullscreen" gyroscope; picture-in-picture"
              src="https://youtube.com/embed/${movie.acf.trailer}">
            </iframe>
              <div class="fronttit">
                <h3>${movie.title.rendered}</h3>
                <h5>${movie.acf.subtitle}</h5>
              </div>
              <p>${movie.acf.description}</p>
        </section>
        <section class="backbutt">
          <h4>FAKTA</h4>
          <h4>MEDVIRKENDE</h4>
          <h4>ANMELDELSER</h4>
          <h4 class="buy">BILLETTER</h4>
        </section>
        </article>
        </div>
        </div>
    `;
    }
    document.querySelector("#" + slug + " .container").innerHTML = htmlTemplate;
}

function getCategories() {
    fetch('http://rysholt.com/wordpress/wp-json/wp/v2/categories')
        .then(function (response) {
            return response.json();
        })
        .then(function (categories) {
            appendCategories(categories);
        });
}

function appendCategories(categories) {
    let htmlTemplate = "";
    for (let category of categories) {
        console.log(category);
        addCategory(category)
        htmlTemplate += `
      <article>
        <h3 onclick="showCategory('${category.slug}','${category.id}')">${category.name}</h3>
      </article>
    `;
    }
    document.querySelector("#genrer").innerHTML += htmlTemplate;
}

function showCategory(slug, id) {
    console.log(slug, id);
    showPage(slug);

    fetch('http://rysholt.com/wordpress/wp-json/wp/v2/posts?_embed&categories=' + id)
        .then(function (response) {
            return response.json();
        })
        .then(function (movies) {
            console.log(slug);
            appendCategoriesMovies(movies, slug);
        });
}


function getTags() {
    fetch('http://rysholt.com/wordpress/wp-json/wp/v2/tags?_embed')
        .then(function (response) {
            return response.json();
        })
        .then(function (tags) {
            appendTags(tags);
        });
}

function appendTags(tags) {
    let htmlTemplate = "";
    for (let tag of tags) {
        console.log(tag);
      htmlTemplate += `
        <span class="nav-item" onclick="showTags('${tag.slug}','${tag.id}')">${tag.name}</span>
    `;
    }
    document.querySelector(".vertical-align-middle").innerHTML += htmlTemplate;
}

  function showTags(slug, id) {
      console.log(slug, id);
      let moviesToShow = document.querySelectorAll(`.tag-${id}`)
        for (let movie of moviesToShow) {
          movie.style.display = "grid"
        }
      let moviesToHide = document.querySelectorAll(`.flip-container:not(.tag-${id})`)
        for (let movie of moviesToHide) {
            movie.style.display = "none"
        }
    }

    function showAllMovies() {
      let moviesToShow = document.querySelectorAll(`.flip-container`)
        for (let movie of moviesToShow) {
          movie.style.display = "grid"
        }
    }

// returns the source url of the featured image of given post or page
function getFeaturedImageUrl(post) {
    let imageUrl = "";
    if (post._embedded['wp:featuredmedia']) {
        imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
    }
    return imageUrl;
}

var myVar;

function myFunction() {
    myVar = setTimeout(showPageSpinner, 1500);
}

function showPageSpinner() {
    document.getElementById("loader").style.display = "none";
    document.getElementById("myDiv").style.display = "grid";
}
