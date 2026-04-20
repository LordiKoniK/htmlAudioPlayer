const fileInput = document.getElementById('fileInput');
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const backBtn = document.getElementById('backBtn');
const forwardBtn = document.getElementById('forwardBtn');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const currentTime = document.getElementById('currentTime');
const maxTime = document.getElementById('audioLength');
const volumeSlider = document.getElementById('volumeSlider');
const muteBtn = document.getElementById('muteBtn');
const muteIcon = document.getElementById('muteIcon');       // import all elements 



let isPlaying = false;  // state tracker for whether the audio is currently playing or not 

audio.volume = 1;       // set default volume to 1 (100% aka max)

// SVGs defined here too for dynamically swapping play/pause and muted/unmuted
const playSVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>`;
const pauseSVG = `<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
const unmuteSVG = `<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M18.0003 16.7503C17.8403 16.7503 17.6903 16.7003 17.5503 16.6003C17.2203 16.3503 17.1503 15.8803 17.4003 15.5503C18.9703 13.4603 18.9703 10.5403 17.4003 8.45027C17.1503 8.12027 17.2203 7.65027 17.5503 7.40027C17.8803 7.15027 18.3503 7.22027 18.6003 7.55027C20.5603 10.1703 20.5603 13.8303 18.6003 16.4503C18.4503 16.6503 18.2303 16.7503 18.0003 16.7503Z"/><path d="M19.8284 19.2503C19.6684 19.2503 19.5184 19.2003 19.3784 19.1003C19.0484 18.8503 18.9784 18.3803 19.2284 18.0503C21.8984 14.4903 21.8984 9.51027 19.2284 5.95027C18.9784 5.62027 19.0484 5.15027 19.3784 4.90027C19.7084 4.65027 20.1784 4.72027 20.4284 5.05027C23.4984 9.14027 23.4984 14.8603 20.4284 18.9503C20.2884 19.1503 20.0584 19.2503 19.8284 19.2503Z"/><path d="M14.02 3.78168C12.9 3.16168 11.47 3.32168 10.01 4.23168L7.09 6.06168C6.89 6.18168 6.66 6.25168 6.43 6.25168H5.5H5C2.58 6.25168 1.25 7.58168 1.25 10.0017V14.0017C1.25 16.4217 2.58 17.7517 5 17.7517H5.5H6.43C6.66 17.7517 6.89 17.8217 7.09 17.9417L10.01 19.7717C10.89 20.3217 11.75 20.5917 12.55 20.5917C13.07 20.5917 13.57 20.4717 14.02 20.2217C15.13 19.6017 15.75 18.3117 15.75 16.5917V7.41168C15.75 5.69168 15.13 4.40168 14.02 3.78168Z"/></svg>`;
const muteSVG = `<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M18.0003 16.7503C17.8403 16.7503 17.6903 16.7003 17.5503 16.6003C17.2203 16.3503 17.1503 15.8803 17.4003 15.5503C18.6603 13.8703 18.9303 11.6403 18.1203 9.71032C17.9603 9.33032 18.1403 8.89032 18.5203 8.73032C18.9003 8.57032 19.3403 8.75032 19.5003 9.13032C20.5203 11.5503 20.1703 14.3603 18.6003 16.4603C18.4503 16.6503 18.2303 16.7503 18.0003 16.7503Z"/><path d="M19.8284 19.2492C19.6684 19.2492 19.5184 19.1992 19.3784 19.0992C19.0484 18.8492 18.9784 18.3792 19.2284 18.0492C21.3684 15.1992 21.8384 11.3792 20.4584 8.08922C20.2984 7.70922 20.4784 7.26922 20.8584 7.10922C21.2384 6.94922 21.6784 7.12922 21.8384 7.50922C23.4284 11.2892 22.8884 15.6692 20.4284 18.9492C20.2884 19.1492 20.0584 19.2492 19.8284 19.2492Z"/><path d="M14.0405 12.9581C14.6705 12.3281 15.7505 12.7781 15.7505 13.6681V16.5981C15.7505 18.3181 15.1305 19.6081 14.0205 20.2281C13.5705 20.4781 13.0705 20.5981 12.5505 20.5981C11.7505 20.5981 10.8905 20.3281 10.0105 19.7781L9.37047 19.3781C8.83047 19.0381 8.74047 18.2781 9.19047 17.8281L14.0405 12.9581Z"/><path d="M21.77 2.22891C21.47 1.92891 20.98 1.92891 20.68 2.22891L15.73 7.17891C15.67 5.57891 15.07 4.37891 14.01 3.78891C12.89 3.16891 11.46 3.32891 10 4.23891L7.09 6.05891C6.89 6.17891 6.66 6.24891 6.43 6.24891H5.5H5C2.58 6.24891 1.25 7.57891 1.25 9.99891V13.9989C1.25 16.4189 2.58 17.7489 5 17.7489H5.16L2.22 20.6889C1.92 20.9889 1.92 21.4789 2.22 21.7789C2.38 21.9189 2.57 21.9989 2.77 21.9989C2.97 21.9989 3.16 21.9189 3.31 21.7689L21.77 3.30891C22.08 3.00891 22.08 2.52891 21.77 2.22891Z"/></svg>`;

// helper function for swapping mute SVGs since it's done in a number of places 
function setMuteIcon(muted) {
    if (muted) {
        muteIcon.innerHTML = muteSVG;
    } else {
        muteIcon.innerHTML = unmuteSVG;
    }
}

// the raw time data comes with a lot of decimals, so we need use a helper function to format it to be only minutes and seconds for viewability
function formatTime(time) {
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.floor(time % 60) || 0;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;   // if the seconds is <10, add a 0 in front of it e.g. 2:05 instead of 2:5
}

// basic player functionality
function playPause(){
     if (!audio.src) return;    // dont try to play if there's nothing there

    if (isPlaying) {            // swap svgs and audio state
        audio.pause();          
        playBtn.innerHTML = playSVG;
    } else {                        // dont need an explicit else condition since isPlaying a boolean
        audio.play();
        playBtn.innerHTML = pauseSVG;   
    }

    isPlaying = !isPlaying;     // always flip the state when this function is called
}

function skipBack5(){
    if (!audio.src) return;                 // if no audio dont try
    audio.currentTime = Math.max(0, audio.currentTime - 5); // max argument to make sure we dont try to skip outside of the song 
}

function skipForward5(){
    if (!audio.src) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);    // same as before just min this time
}

// EVENT LISTENERS

// load user's audio file
fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) {
        const url = URL.createObjectURL(file);      // create url (i.e. file path) so we can set it as the audio element's src
        audio.src = url;
        playBtn.innerHTML = playSVG;
        isPlaying = false;              // if successful set up the player to default paused state
    }
});

// set max time from the uploaded file (more consistent to use metadata load event instead of our own file input change due to browser loading time) 
audio.addEventListener('loadedmetadata', () => {
    maxTime.textContent = formatTime(audio.duration);
});

// PLAYBACK CONTROLS

// play/pause button
playBtn.addEventListener('click', () => {
    playPause();
});

// also play/pause when we press space
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();   // prevent default spacebar action of redoing the last thing you did (it opens the file upload dialog again)
        playPause();
    }
});

// skip back 5 seconds
backBtn.addEventListener('click', () => {
    skipBack5();
});

// skip forward 5 seconds
forwardBtn.addEventListener('click', () => {
    skipForward5();
});

// skip back/forward with left and right arrow keys as well
document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft') {
        skipBack5();
    } else if (e.code === 'ArrowRight') {
        skipForward5();
    }
});

// VOLUME CONTROLS

// adjust volume
volumeSlider.addEventListener('input', function() {
    audio.volume = this.value;      // manual slider controls
    if (audio.volume == 0) {
        audio.muted = true;
        setMuteIcon(true);      // toggle mute icon and flag if the slider is set to 0
    } else {
        audio.muted = false;
        setMuteIcon(false);
    }
});

// mute/unmute button
muteBtn.addEventListener('click', function() {
    audio.muted = !audio.muted;         // HTML audio element has built in muted property that we can toggle
    setMuteIcon(audio.muted);
    if (audio.muted) {
        volumeSlider.value = 0;         // when muted, set the slider to 0 (extra responsiveness) NB: ONLY the slider, the actual audio.volume value is preserved for later
    } else {
        if (audio.volume === 0) {       
            audio.volume = 1;           // if the volume slider was set to 0 but the mute button wasn't pressed, unmuting sets volume to max
            volumeSlider.value = 1;
        } else {
            volumeSlider.value = audio.volume;  // otherwise just restore the slider/volume to what it was before
        }
    }
});

// SONG PROGRESS FEATURES

// update playback progress 
audio.addEventListener('timeupdate', () => {    // audio element has built in time update event so we just use that
    const percent = (audio.currentTime / audio.duration) * 100;     // convert to percentage of how much of the song has played
    progress.style.width = percent + "%";   // 100% will be the full width of its parent element (AKA the progress bar container)

    currentTime.textContent = formatTime(audio.currentTime);    // update time as well
});

// when the song ends, show that it ended
audio.addEventListener('ended', () => {     // audio element also has built in ended event for when the song ends
    playBtn.innerHTML = playSVG;
    isPlaying = false;                      // return to default paused state
});


// skip to specific time when we click somewhere on the progress bar
progressBar.addEventListener('click', (e) => {
    const width = progressBar.clientWidth;  // get total width of progress bar
    const clickX = e.offsetX;               // get x coordinate of click event relative to progress bar (how far in we clicked)
    const duration = audio.duration;        // fetch total length time of audio file

    audio.currentTime = (clickX / width) * duration;    // new time = (click position / total width) * total duration
});