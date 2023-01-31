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

const dotBucket = document.querySelector('.dot__img__section');
const dotImg = document.querySelector('.dot__img');

const dotImgTransform = function (e) {
    const link = e.target;
    console.log(link)
    if (link.classList.contains('dot')) {
        dotImg.src = '../img/peter_1.jpg'
    }
}

dotBucket.addEventListener('click', dotImgTransform)

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

gitHubList = {};
const renderData = async function(data) {
    data.forEach(ele => { 
        const { full_name, homepage, html_url, description, updated_at } = ele;
        gitHubList = {
            title: full_name,
            link: html_url,
            description: description,
            last_update: updated_at,
        }
        if (homepage !== undefined) {
            githubList = {
                website: homepage,
            }
        }
        displayData(gitHubList);
})};

const displayData = async function(data) {
    const markup = `
    <li class="gitHub__item"><h2>${data.title}</h2>
    <p>${data.description}</p>
    <a href="${data.link}">Source Material</a>
    <h3>Last Updated: ${data.last_update}</h3>
    `;
    projectElement.insertAdjacentHTML('afterbegin', markup)
    // fixHosted();
}

// const fixHosted = function() {
//     if (hostedElement.href == 'undefined') {
//         hostedElement.innerHTML = ''
//     }
// }

gitHubData();