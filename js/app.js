const container = document.querySelector('.videos');
const videos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => `videos/${n}.mp4`);

// 1. Create all initial items
// ******************************************************
function createInitialItems() {
    for (let i = 0; i < videos.length; i++) {
        createItem(i);
    }
}

// 2. Observe items
// ******************************************************
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

// 3. Load and unload videos
// ******************************************************
function toggleActiveItem(direction) {
    const nextIndex = (direction === 'down') ? getActive('index') + 1 : getActive('index') - 1;
    const nextItem = container.querySelector(`.videos__item[data-index="${nextIndex}"]`);

    const afterNextIndex = (direction === 'down') ? getActive('index') + 2 : getActive('index') - 2;
    const afterNextItem = container.querySelector(`.videos__item[data-index="${afterNextIndex}"]`);

    const otherItems = container.querySelectorAll('.videos__item:not([data-state="active"])');

    // Set previous item to preloading state
    setStateToPreloading(getActive('item'));

    // Set current item to active state
    if (nextItem) setStateToActive(nextItem);

    // Set after current item to preloading state
    if (afterNextItem) setStateToPreloading(afterNextItem);

    // Set other items to unload state
    otherItems.forEach(item => {
        const index = parseInt(item.dataset.index);
        const distance = Math.abs(index - nextIndex);
        
        if (distance > 1) {
            setStateToUnload(item);
        }
    });
}

// 4. Assistive functions
// ******************************************************

// Get video URL
function getVideoUrl(index) {
    return `videos/${index + 1}.MP4`;
}


// Load video to the existing container
async function loadVideoIntoContainer(containerElement) {
    containerElement.innerHTML = '';
    
    const index = parseInt(containerElement.dataset.index);

    const video = document.createElement('video');
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.muted = true;
    video.poster = `videos/${index + 1}.webp`;
    
    const source = document.createElement('source');
    source.src = getVideoUrl(index);
    source.type = 'video/mp4';
    
    video.appendChild(source);
    containerElement.appendChild(video);
    
    // If there is no video (error)
    video.addEventListener('error', async () => {
        console.warn(`Video ${index + 1} not exist`);

        // End of the feed
        if (index === totalVideos - 1) {
            console.warn('This is the end of the feed.')
        }
    });
    
    // Play/pause on click
    video.addEventListener('click', (e) => {
        e.stopPropagation();

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });
    
    return video;
}

// Create an empty video container
function createItem(index) {
    let elementExist = container.querySelector(`.videos__item[data-index="${index}"]`);

    if (!elementExist) {
        const div = document.createElement('div');
        div.className = 'videos__item';
        div.dataset.index = index;
        if (index === 0) setStateToActive(div);
        else if (index === 1) setStateToPreloading(div);
        else setStateToUnload(div);

        container.append(div);
    }
}

// Set item to active state
async function setStateToActive(element) {
    element.dataset.state = 'active';

    const elementIndex = element.dataset.index;

    // Pause all other videos
    const otherVideos = container.querySelectorAll(`.videos__item:not([data-index="${elementIndex}"]) video`);
    otherVideos.forEach(video => video.pause());

    // Get or create a video
    let video = element.querySelector('video');
    if (!video) video = await loadVideoIntoContainer(element);
    
    // Play current video
    await video.play().catch(e => console.log('Autoplay error:', e));
    
    return video;
}

// Set item to preloading state
async function setStateToPreloading(element) {
    element.dataset.state = 'preloading';

    // Get or create a video
    let video = element.querySelector('video');
    if (!video) video = await loadVideoIntoContainer(element);
    
    return video;
}

// Set item to unload state
function setStateToUnload(element) {
    element.dataset.state = 'unload';

    // Get the video
    let video = element.querySelector('video');
    if (video) video.remove();
}

// Get active item or item index
function getActive(thing) {
    if (thing === 'item') {
        return activeItem = container.querySelector('.videos__item[data-state="active"]');
    } else if (thing === 'index') {
        return activeIndex = parseInt(container.querySelector('.videos__item[data-state="active"]').getAttribute('data-index'));
    } else {
        return null;
    }
}

// Show next video (down direction of scrolling)
async function nextVideo() {
    toggleActiveItem('down');
}

// Show previous video (up direction of scrolling)
async function prevVideo() {
    toggleActiveItem('up');
}

// 5. Initialization
// ******************************************************
async function init() {
    createInitialItems();
    observeActiveVideo();
}
document.addEventListener('DOMContentLoaded', init);