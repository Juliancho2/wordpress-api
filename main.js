
//------- variables------------
const d = document,
    $sites = d.querySelector(".sites"),
    $posts = d.getElementById("posts"),
    $loader = d.querySelector(".hide-loader"),
    $template = d.getElementById("container"),
    $fragment = d.createDocumentFragment(),
    DOMAIN = "https://malvestida.com",
    SITE = `${DOMAIN}/wp-json`,
    API_WP = `${SITE}/wp/v2`,
    POSTS = `${API_WP}/posts?_embed`,
    PAGES = `${API_WP}/pages`,
    CATEGORIES = `${API_WP}/categories`;

let page = 1;
let perPage = 8;


//Abrir modal del post.
function openMorePost(id){
    const $post=document.getElementById(id);
    $post.classList.add("visible-post");
}
//Cerrar modal del post.
function closePostMore(id){
    const $post=document.getElementById(id);
    $post.classList.remove("visible-post");
}
//Peticion traer informacion del sitio
function getSiteData() {

    fetch(SITE)
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(res => {
            //Insercion de la informacion del sitio.
            $sites.innerHTML = `
            <h3>Sitio web</h3>
            <h2> 
                <a href="${res.url}" target="_blank">${res.name}</a>
            </h2>
            <p>${res.description}</p>
            <p>${res.timezone_string}</p>
        `

        })
        .catch(err => {
            console.log(err);
            let message = err.statusText || "Ocurrio un error";
            $site.innerHTML = `<p>Error: ${err.status}: ${message}</p>`;

        })
}
//Peticion traer posts.

function getPosts() {
    //agregar loader
    $loader.classList.add("loader");

    fetch(`${POSTS}&page=${page}&per_page=${perPage}`)
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(res => {
            res.forEach(el => {
                let categories= "",
                tags="";
                //iteracion de categorias y tags
                el._embedded["wp:term"][0].forEach(el=> categories += `<li>${el.name}</li>`);
                el._embedded["wp:term"][1].forEach(el=> tags += `<li>${el.name}</li>`);
                
                //Insercion de las cards en elemento.
               $template.innerHTML+=`
               <div class="card-post">
               <div class="card-header" style="background-image: url(${el._embedded["wp:featuredmedia"]?
                   el._embedded["wp:featuredmedia"][0].source_url : "" })">

                   <div class="card-header-slanted-edge">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 200">
                           <path class="polygon" d="M-20,200,1000,0V200Z" />
                       </svg>
                       <a href="${el.link}" target="_blank" class="btn-follow"><span class="sr-only">Follow</span></a>
                   </div>
               </div>
       
               <div class="card-body">
                   <h2 class="name">${el.title.rendered}</h2>
                   <h4 class="job-title">${new Date(el.date).toDateString()}</h4>
                   <h4 class="job-title"><span>Categories:</span> ${categories}</h4>
                   <h4 class="job-title"><span>Tags: </span> ${tags}</h4>
                   <div class="bio">${el.excerpt.rendered.replace("[&hellip;]","...")}</div>
                   <button onclick="openMorePost(${el.id})">Leer mas</button>
                   <div class="post-content" id="${el.id}">
                       <article>
                           <span onclick="closePostMore(${el.id})"><img
                                   src="https://cdn0.iconfinder.com/data/icons/leading-international-corporate-website-app-collec/16/Close_Menu-512.png" /></span>
                           ${el.content.rendered}
                       </article>
                   </div>
               </div>
           </div>
         
              `
            });
            //remover loader
            $loader.classList.remove("loader");
        })
        .catch(err => {
            let message = err.statusText || "Ocurrio un error";
            $posts.innerHTML = `<p>Error: ${err.status}: ${message}</p>`;
            $loader.classList.remove("loader");
        });
}
//Llamar las funciones de post y sites.
d.addEventListener("DOMContentLoaded", (e) => {
    getSiteData();
    getPosts();
});

//Agregar mas cards.
window.addEventListener("scroll", e => {
    const { scrollTop, clientHeight, scrollHeight } = d.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
        page++;
        getPosts();
    }
});


