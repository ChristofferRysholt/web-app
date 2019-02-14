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
  document.querySelector(`#${pageId}`).style.display = "grid";
  setActiveTab(pageId);
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
  .then(function(response) {
    return response.json();
  })
  .then(function(pages) {
    appendPages(pages);
  });

/*
Appends and generate pages
*/
function appendPages(pages) {
  var menuTemplate = "";
  for (let page of pages) {
    addMenuItem(page);
    addPage(page);
  }
  setDefaultPage(pages[0].slug); // selecting the first page in the array of pages
  getMovies();
  getCategories();
}

// appends menu item to the nav menu
function addMenuItem(page) {
  document.querySelector("#menu").innerHTML += `
  <a href="#${page.slug}" onclick="showPage('${page.slug}')">${page.title.rendered}</a>
  `;

}

// appends page section to the DOM
function addPage(page) {
  document.querySelector("#pages").innerHTML += `
  <section id="${page.slug}" class="page">
    <header class="topbar">
      <h2>${page.title.rendered}</h2>
    </header>
    ${page.content.rendered}
  </section>
  `;
}
// Fetches post data from my headless cms

function getMovies() {
  fetch('http://rysholt.com/wordpress/wp-json/wp/v2/posts?_embed')
    .then(function(response) {
      return response.json();
    })
    .then(function(movies) {
      appendMovies(movies);
    });
}

// Appends json data to the DOM

function appendMovies(movies) {
  let htmlTemplate = "";
  for (let movie of movies) {
    console.log();
    htmlTemplate += `
      <article>
      <img src="${getFeaturedImageUrl(movie)}">
        <h3>${movie.title.rendered}</h3>
        <p>${movie.content.rendered}</p>
      </article>
    `;
  }
  document.querySelector("#forside").innerHTML += htmlTemplate;
}

function getCategories() {
  fetch('http://rysholt.com/wordpress/wp-json/wp/v2/categories')
    .then(function(response) {
      return response.json();
    })
    .then(function(categories) {
      appendCategories(categories);
    });
}


function appendCategories(categories) {
  let htmlTemplate = "";
  for (let category of categories) {
    console.log();
    htmlTemplate += `
      <article>
        <h3>${category.name}</h3>
      </article>
    `;
  }
  document.querySelector("#kategorier").innerHTML += htmlTemplate;
}

// returns the source url of the featured image of given post or page
function getFeaturedImageUrl(post) {
  let imageUrl = "";
  if (post._embedded['wp:featuredmedia']) {
    imageUrl = post._embedded['wp:featuredmedia'][0].source_url;
  }
  return imageUrl;
}
