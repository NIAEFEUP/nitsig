import { getUP } from "./utilities/sigarra";
import { getStorage, setStorage } from "./utilities/storage";

const pagesWithCourseCards = [
    "fest_geral.cursos_list",
    "fest_geral.curso_percurso_academico_view",
    "fest_geral.curso_posicao_plano_view",
    "fest_geral.ucurr_inscricoes_list",
    "fest_geral.estatutos_regimes_view",
    "fest_geral.info_ingresso_view",
    "fest_geral.info_pessoal_completa_view"
];

/**
 * 
 * @param {Element[]} cards
 * @param {string | undefined} favoriteCourse
 */
function rerenderStarIcons(cards, favoriteCourse) {
    cards.forEach((val) => {
        const enrollmentId = val.getAttribute('data-course-enrollment-id')
        if(enrollmentId === null) {
            throw Error('could not find enrollment id in card')
        }

        let isFavoriteCourse = enrollmentId === favoriteCourse 
        const i = val.querySelector('.se-course-star')
        i.classList = []
        
        i.classList.add(
            isFavoriteCourse ? 'ri-star-fill' : 'ri-star-line', 
            'se-course-star'
        )
        if(isFavoriteCourse) i.classList.add('se-favorite-course')
    })
}

function changeProfileLink(favoriteCourses){
    const up = getUP().toString()
    const favoriteCourse = favoriteCourses[up]
    const profileLink = document.querySelector('.se-auth-profile')
    if(favoriteCourse === undefined){
        profileLink.href = `fest_geral.cursos_list?pv_num_unico=${up}`
    } else {
        profileLink.href = `fest_geral.curso_percurso_academico_view?pv_fest_id=${favoriteCourse}`
    }
}

export async function favoriteCardListener(){
    const favoriteCourses = await getStorage('favorite_courses')
    changeProfileLink(JSON.parse(favoriteCourses))
    chrome.storage.local.onChanged.addListener(async (changes) => {
        if(!Object.keys(changes).includes('favorite_courses')){
            return
        }
        changeProfileLink(JSON.parse(changes['favorite_courses'].newValue))
    })
}

export async function addStarIconToCard() {
    await favoriteCardListener();
    const hasProfileRow = pagesWithCourseCards
        .map((value) => document.location.href.toLowerCase().includes(value))
        .reduce((prev, curr) => prev || curr);
    
    if (!hasProfileRow){
        return;
    }
    const up = getUP()
    let favoriteCourses = JSON.parse(await getStorage('favorite_courses'))
    let favoriteCourse = favoriteCourses[up.toString()]
    const cards = document.querySelectorAll('.se-course-card')

    cards.forEach((val) => {
        const titleBar = val.querySelector('.estudante-lista-curso-nome')
        const enrollmentId = val.getAttribute('data-course-enrollment-id')
        if(enrollmentId === null) {
            throw Error('could not find enrollment id in card')
        }
        if(titleBar === null){
            throw Error('Could not find titlebar for the course card')
        }

        let isFavoriteCourse = enrollmentId === favoriteCourse 
        const i = document.createElement('i')
        i.classList.add(
            isFavoriteCourse ? 'ri-star-fill' : 'ri-star-line', 
            'se-course-star'
        )
        if(isFavoriteCourse) i.classList.add('se-favorite-course')

        i.addEventListener('mouseenter', (_) => {
            if(!isFavoriteCourse){
                i.classList.remove('ri-star-line')
                i.classList.add('ri-star-fill')
            }
        })

        i.addEventListener('mouseleave', (_) => {
            if(!isFavoriteCourse){
                i.classList.remove('ri-star-fill')
                i.classList.add('ri-star-line')
            }
        })

        i.addEventListener('click', async (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            if(favoriteCourse === enrollmentId) {
                delete favoriteCourses[up.toString()]
                favoriteCourse = undefined
                isFavoriteCourse = false
                i.classList.remove('se-favorite-course')
            } else {
                favoriteCourses[up.toString()] = enrollmentId
                favoriteCourse = enrollmentId
                isFavoriteCourse = true
                i.classList.add('se-favorite-course')
                
            }
            await setStorage({'favorite_courses': JSON.stringify(favoriteCourses)})
            
            rerenderStarIcons(cards, favoriteCourse)
        })

        titleBar.append(i)
    })
}