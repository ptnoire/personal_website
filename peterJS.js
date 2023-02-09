const contentCards = document.querySelectorAll('.contentCard')
const section = document.querySelector('.section__blog')


// Intersectional Observer API
const obsCallback = function(entries, obs) {
    const [entry] = entries;
    const target = entry.target;
    if(!entry.isIntersecting) return
    target.classList.remove('hidden');
    target.classList.remove('no__width');
    obs.unobserve(entry.target);
}

const obsOptions = {
    root: null,
    threshold: [0, 0.2],
}

const observer = new IntersectionObserver(obsCallback, obsOptions);

contentCards.forEach(card => {
    card.classList.add('hidden')
    card.classList.add('no__width')
    observer.observe(card)
});

document.querySelector('.welcome__nav').addEventListener('click', function(e) {
    e.preventDefault();
    if(e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    }
  })

const projectElement = document.querySelector('.project__list')

const gitHubData = async function() {
    const retrieve = await fetch(`https://api.github.com/users/ptnoire/repos`)
    const data = await retrieve.json();
    renderData(data)
}

// Implementing Pagination for GitHub project list, move renderdata to push into an array inside the state model then render results based off of a spliced version of the array. - FEB 8th 2023

gitHubList = {
    page: 1,
    resultsPerPage: 5,
    results: [],
};

const clear = function(parentContainer) {
    parentContainer.innerHTML = ''
}

const renderData = async function(data, pageNum = gitHubList.page) {
    gitHubList.results = data.map(ele => { 
        const { full_name, html_url, description, updated_at, clone_url } = ele;
        return {
            title: full_name,
            link: html_url,
            description: description,
            last_update: updated_at,
            clone: clone_url,
            profilePic: ele.owner.avatar_url,
        }
    })
    clear(projectElement);
    displayData(pagination(pageNum));
};

const controlPagination = function(newPage) {
    gitHubList.page = newPage;
    displayData(pagination(gitHubList.page))
}

const paginationButtonsContainer = document.querySelector('.pagination__project_list');

paginationButtonsContainer.addEventListener('click', function(e) {
        e.preventDefault();
        const btn = e.target.closest('.btn--inline');
        if(!btn) return;
        const goto = +btn.dataset.goto;
        controlPagination(goto);
    })

const pagination = function(page = gitHubList.page) {
    gitHubList.page = page;
    const start = (page -1) * gitHubList.resultsPerPage;
    const end = page * gitHubList.resultsPerPage;
    return gitHubList.results.slice(start, end);
}

const changePagination = function() {
    const curPage = gitHubList.page;
    const numPages = Math.ceil(gitHubList.results.length / gitHubList.resultsPerPage);

    if (curPage === 1 && numPages > 1) {
        return `
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
             <h2>Page ${curPage + 1}➡</h2>
        </button>
        `
    }

    if(curPage === numPages && numPages > 1) {
        return `
        <button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
            <h2>⬅ Page ${curPage - 1}</h2>
        </button>
        `;
    }

    if(curPage < numPages) {
        return `
        <button data-goto="${curPage - 1}"  class="btn--inline pagination__btn--prev">
            <h2>⬅ Page ${curPage - 1}</h2>
        </button>
        <button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
            <h2>Page ${curPage + 1}➡</h2>
        </button>
        `;
    }
}


const displayData = async function(data) {
    clear(projectElement);
    data.forEach(el => {
        const markup = `
    <li class="gitHub__item condense" style="
        background: url('${el.profilePic}'), linear-gradient(to top left, rgba(0, 0, 0, 1), rgba(49, 46, 46, 0.90));
        background-position: 100%;
        background-repeat : no-repeat;
        padding-left:30px;">
            <h2>${el.title}</h2>
            <p>${el.description}</p>
            <a href="${el.link}">Source Material</a>
            <a href="${el.clone}">Clone</a>
            <h3>Last Updated: ${el.last_update}</h3>
    </li>
    `;
    projectElement.insertAdjacentHTML('afterbegin', markup)
    });
    clear(paginationButtonsContainer);
    const buttons = changePagination();
    paginationButtonsContainer.insertAdjacentHTML('afterbegin', buttons)
}

projectElement.addEventListener('mouseover', function(e) {
    const target = e.target.closest('.gitHub__item');
    if(!target) return;
    const gitHubItems = document.querySelectorAll('.gitHub__item');
    gitHubItems.forEach(el => el.classList.add('condense'))
    target.classList.remove('condense');
})


gitHubData();