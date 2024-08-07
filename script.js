// Global Variables
let currentSong = new Audio();
let songs;

// Helper function to format time
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

// Fetch songs from GitHub API
async function getSongs() {
    const repo = 'imranahmad88pr147/SpotifyClone'; // Replace with your GitHub username and repo name
    const dir = 'assets/songs';
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${dir}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    const songs = data.filter(file => file.name.endsWith('.mp3')).map(file => file.name);
    return songs;
}

// Play selected music
const playMusic = (music) => {
    currentSong.src = "/assets/songs/" + music;
    currentSong.play();
    play.src = "/assets/images/pause.svg";
    document.querySelector(".songInfo").innerHTML = decodeURIComponent(music);
}

// Main function to initialize the app
async function main() {
    songs = await getSongs();
    let songUL = document.querySelector(".songsList ul");
    if (!songUL) {
        console.error("No .songList ul element found");
        return;
    }

    songs.forEach(song => {
        songUL.innerHTML += `
            <li>   
                <img width="24" src="/assets/images/musicIcon.svg" alt="">
                <div class="info">${decodeURIComponent(song)}</div>
                <div class="playNow">
                    <span>Play Now</span>
                    <img width="20" src="/assets/images/play.svg" alt="">
                </div> 
            </li>`;
    });

    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(songs.find(s => decodeURIComponent(s) === e.querySelector(".info").innerHTML.trim()));
        });
    });

    // Event Listener to Play/Pause
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "/assets/images/pause.svg";
        } else {
            currentSong.pause();
            play.src = "/assets/images/play.svg";
        }
    });

    // Event Listener to display current time of song
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Event Listener to move the circle on seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    // Event Listener for Home button
    document.querySelector("#Home").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Event Listener for Hamburger icon
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".leftMenu").style.left = "0";
    });

    // Event Listener to close the Hamburger menu
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".leftMenu").style.left = "-120%";
    });

    // Event Listener for Previous button
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").pop());
        let newIndex = (index - 1 + songs.length) % songs.length;
        playMusic(songs[newIndex]);
    });

    // Event Listener for Next button
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").pop());
        let newIndex = (index + 1) % songs.length;
        playMusic(songs[newIndex]);
    });
}

main();
