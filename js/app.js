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

// Update progress bar
function updateProgressBar(video, progressFill) {
    if (video.duration && !isNaN(video.duration)) {
        const percent = (video.currentTime / video.duration) * 100;
        progressFill.style.width = `${percent}%`;
    }
}

// Load video to the existing container
async function loadVideoIntoContainer(wrapperElement) {
    const index = parseInt(wrapperElement.closest('.videos__item').dataset.index);

    // el → <video>
    const video = document.createElement('video');
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.muted = true;
    video.poster = `videos/${index + 1}.webp`;
    
    // el → <video> → <source>
    const source = document.createElement('source');
    source.src = getVideoUrl(index);
    source.type = 'video/mp4';
    
    video.appendChild(source);
    
    // Add state indicator el → <div class="video__item__state-indicator">
    const indicator = document.createElement('div');
    indicator.className = 'videos__item__state-indicator';
    
    // Add progress bar el → <div class="videos__item__progress-bar">
    const progressBar = document.createElement('div');
    progressBar.className = 'videos__item__progress-bar';
    const progressFill = document.createElement('div');
    progressFill.className = 'videos__item__progress-bar__fill';
    progressBar.appendChild(progressFill);
    
    // Clear wrapper and add all elements at once
    wrapperElement.innerHTML = '';
    wrapperElement.appendChild(video);
    wrapperElement.appendChild(indicator);
    wrapperElement.appendChild(progressBar);
    
    // Update progress bar during video playback
    video.addEventListener('timeupdate', () => {
        updateProgressBar(video, progressFill);
    });
    
    // Update progress bar when video metadata is loaded
    video.addEventListener('loadedmetadata', () => {
        updateProgressBar(video, progressFill);
    });
    
    // Reset progress bar when video ends (for loop)
    video.addEventListener('ended', () => {
        if (video.loop) {
            updateProgressBar(video, progressFill);
        }
    });
    
    // Play/pause on click, and show the pause indicator
    video.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (video.paused) {
            video.play();
            indicator.classList.remove('-paused');
            void indicator.offsetWidth;// Cleanup previous animation
            indicator.classList.add('-play');
        } else {
            video.pause();
            indicator.classList.remove('-play');
            void indicator.offsetWidth;// Cleanup previous animation
            indicator.classList.add('-paused');
        }
    });
    
    // If there is no video (error)
    video.addEventListener('error', async () => {
        console.warn(`Video ${index + 1} not exist`);

        // End of the feed
        if (index === totalVideos - 1) {
            console.warn('This is the end of the feed.')
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
        
        // Wrapper for progress bar correct work
        const wrapper = document.createElement('div');
        wrapper.className = 'videos__item-wrapper';
        div.appendChild(wrapper);
        
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

    // Get wrapper element
    const wrapper = element.querySelector('.videos__item-wrapper');
    
    // Get or create a video
    let video = wrapper.querySelector('video');
    if (!video) video = await loadVideoIntoContainer(wrapper);
    
    // Play current video
    if (video) {
        await video.play().catch(e => console.log('Autoplay error:', e));
        const indicator = wrapper.querySelector('.videos__item__state-indicator');
        if (indicator) indicator.classList.remove('-paused');
    }
    
    return video;
}

// Set item to preloading state
async function setStateToPreloading(element) {
    element.dataset.state = 'preloading';

    // Get wrapper element
    const wrapper = element.querySelector('.videos__item-wrapper');
    
    // Get or create a video
    let video = wrapper.querySelector('video');
    if (!video) {
        video = await loadVideoIntoContainer(wrapper);
        
        // Start playing and immediately pause to preload content
        // This helps to load the video without blinking
        if (video && video.readyState < 3) {// If not enough data
            try {
                await video.play();

                // Pause immediately
                setTimeout(() => {
                    if (video && !video.paused) {
                        video.pause();
                        video.currentTime = 0;// Reset to beginning
                    }
                }, 10);
            } catch(e) {
                console.warn('Preload play/pause error:', e);
            }
        }
    }
    
    return video;
}

// Set item to unload state
function setStateToUnload(element) {
    element.dataset.state = 'unload';

    // Get wrapper element
    const wrapper = element.querySelector('.videos__item-wrapper');
    
    // Get the video
    let video = wrapper.querySelector('video');
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