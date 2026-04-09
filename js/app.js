// State
let currentIndex = 0;
let loadedVideos = new Map();
let totalVideos = 0;
const container = document.querySelector('.videos');
const videos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => `videos/${n}.mp4`);

// Get next video
function getVideoUrl(index) {
    return `videos/${index + 1}.mp4`;
}

// Create an empty video container
function createVideoContainer(index) {
    console.log(index);

    const div = document.createElement('div');
    div.className = 'videos__item';
    div.dataset.index = index;
    if (index === 0) stateActive(div);
    else if (index === 1) statePreloading(div);
    else stateWaiting(div);
    return div;
}

function createItem(index) {
    let containerElement = container.querySelector(`.videos__item[data-index="${index}"]`);

    if (!containerElement) {
        containerElement = createVideoContainer(index);
        containerElement.textContent = index;
        container.append(containerElement);
    }
}

function createInitialItems() {
    for (let i = 0; i < videos.length; i++) {
        createItem(i);
    }
}

function stateActive(element) {
    element.dataset.state = 'active';
}

function statePreloading(element) {
    element.dataset.state = 'preloading';
}

function stateWaiting(element) {
    element.dataset.state = 'waiting';
}

function getActive(thing) {
    if (thing === 'item') return activeItem = container.querySelector('.videos__item[data-state="active"]');
    else if (thing === 'index') return activeIndex = parseInt(container.querySelector('.videos__item[data-state="active"]').getAttribute('data-index'));
}

function setActive(direction) {
    const nextIndex = (direction === 'down') ? getActive('index') + 1 : getActive('index') - 1;
    const nextItem = container.querySelector(`.videos__item[data-index="${nextIndex}"]`);

    const afterNextIndex = (direction === 'down') ? getActive('index') + 2 : getActive('index') - 2;
    const afterNextItem = container.querySelector(`.videos__item[data-index="${afterNextIndex}"]`);

    statePreloading(getActive('item'));

    if (nextItem) stateActive(nextItem);

    if (afterNextItem) statePreloading(afterNextItem);
}

function manageItemsInDOM(direction) {
    if (direction === 'down' && getActive('index') > 1) {
        console.log('create item AFTER, then remove FIRST item');

        // setTimeout(() => {
        //     createItem(parseInt(container.querySelector('.videos__item:last-child').getAttribute('data-index')) + 1);
        //     container.querySelector('.videos__item:first-child').remove();
        // }, 500);

        // container.querySelector('.videos__item[data-index="' + (getActive('index') - 3) + '"]').remove();
        // container.querySelector('.videos__item[data-index="' + (getActive('index') + 2) + '"]');
    } else if (direction === 'up' && getActive('index') > 1 && getActive('index') < 3) {
        console.log('create item BEFORE, then remove LAST item');
    }
}

async function nextVideo() {
    setActive('down');
    manageItemsInDOM('down');
}

async function prevVideo() {
    setActive('up');
    manageItemsInDOM('up');
}

function observeActiveVideo() {
    const observer = new IntersectionObserver((entries) => {
        const currentIndex = (container.querySelector('.videos__item[data-state="active"]')) ? parseInt(container.querySelector('.videos__item[data-state="active"]').getAttribute('data-index')) : 0;
        
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                const index = parseInt(entry.target.dataset.index);
                
                if (index !== currentIndex) {
                    const direction = index > currentIndex ? 'down' : 'up';
                    
                    if (direction === 'down') nextVideo();
                    else prevVideo();
                }
            }
        });
    }, {
        threshold: 0.5
    });
    
    // Observe all the containers
    const observeAllContainers = () => {
        const containers = container.querySelectorAll('.videos__item');
        containers.forEach(container => observer.observe(container));
    };
    
    observeAllContainers();
    
    // Observe the new created containers
    const mutationObserver = new MutationObserver(() => {
        observeAllContainers();
    });
    
    mutationObserver.observe(container, { childList: true });
}

// Initialization
async function init() {
    createInitialItems();
    observeActiveVideo();
}

document.addEventListener('DOMContentLoaded', init);