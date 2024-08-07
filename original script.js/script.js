
//Golbal Variable
let currentSong = new Audio();
let songs=[];

function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
}

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/assets/songs/");
    let response = await a.text(); //it means we could'nt use the DOM methods on the response we get as text that's why we converted it into temporary div html container. You can't use DOM methods like getElementsByTagName, querySelector, or innerHTML directly on a text string.
    //console.log("Response: "+response);
   // console.log("A: "+a)
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    
    

   
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        
        if (element.href.endsWith(".mp3")) {
            console.log("Loop: "+element)
            songs.push(element.href.split("/songs/")[1]);
        }
    }
    // console.log(songs)
    return songs;
}


const playMusic = (music) => {
    //let audio = new Audio("/songs/" +music)
    // audio.play();
    //We can write the above lines as:

    currentSong.src = "/assets/songs/" + music;
    currentSong.play();
    play.src = "/assets/images/pause.svg"
    document.querySelector(".songInfo").innerHTML = music.replaceAll("%20"," ")
    // document.querySelector(".songTime").innerHTML="00:00:00"


}
async function main() {


    let songs = await getSongs() //When you log songs right after calling getSongs(), you’re actually logging the promise returned by getSongs(), not the resolved value. At this point, the promise is still pending, so you see Promise { <pending> }. That's why we have used another async function main to get all the promises returned by getSongs function.
    // console.log(songs)

    let songUL = document.querySelector(".songsList ul")
    if (!songUL) {
        console.error("No .songList ul element found");
        return;
    }

    // console.log(songUL); // This should log the ul element or null if not found
    for (const song of songs) {
        console.log("ok")
        //Here songUL have the tag "ul" and its inner html means the content inside ul tag. We are writing html to store the list of songs under ul tag by the following code.
        songUL.innerHTML = songUL.innerHTML + `<li>   
        <img width="24" src="/assets/images/musicIcon.svg" alt="">
                <div class="info">
                 ${song.replaceAll("%20", " ")} 
                </div>
                <div class="playNow">
                  <span>Play Now</span>
                  <img width="20" src="/assets/images/play.svg" alt="">
                </div> 
                </li>`;
        //If we do not use $ sign in above code then we cannot access songs sotred in songs array.
    }

    //play the song
    // var audio = new Audio(songs[0]);
    // audio.play();

    // Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(e => {
    //     e.addEventListener("click", element => {
    //         console.log(e.querySelector(".info").innerHTML);// This line is for testing purpose you can comment this.
    //         playMusic(e.querySelector(".info").innerHTML.trim())
    //     })

    // })

    //let test=songUL.getElementsByTagName("li");//LINE 1
    //console.log(test)//LINE1

    //To understand the following function , just read the function1 word document.
    Array.from(songUL.getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => { //e is a  "li" here. Uncomment above line 1 to understand this.
            console.log(e.querySelector(".info").innerHTML);
            playMusic(e.querySelector(".info").innerHTML.trim());
        });
    });

    //Event Listener to Play, Next and Previous.
    play.addEventListener("click", () => {

        if (currentSong.paused) {
            currentSong.play();
            play.src = "/assets/images/pause.svg"

        }
        else {
            currentSong.pause();
            play.src = "/assets/images/play.svg"
        }


    })

    //Event Listener to display the current time of song
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration)
        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`

        //For seekbar circle continuous movement. we can also change the style of an element through javascript as we are doing following

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";



    })

    //Event Listener to move the circle on seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {

       // console.log(e.target.getBoundingClientRect().width, e.offsetX)
       let percent=(e.offsetX / e.target.getBoundingClientRect().width) * 100
       //console.log(percent);
      // console.log("Duration: "+currentSong.duration)
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentSong.currentTime=((currentSong.duration)*percent)/100;
    })

    //Event Listener for Home button

   document.querySelector("#Home").addEventListener("click",()=>{

    window.location.href = "index.html";

   })

      //Event Listener for Hamburger icon
      document.querySelector(".hamburger").addEventListener("click",()=>{
        //console.log("Hamburger click is working!")
        document.querySelector(".leftMenu").style.left="0"
    })

     //Event Listener for Hamburger icon
     document.querySelector(".close").addEventListener("click",()=>{
       
        document.querySelector(".leftMenu").style.left="-120%"
    })

    //Event Listener for Song Previous button
    previous.addEventListener("click",()=>{

        //previous in above line is "id" of previous button
        
        let index=songs.indexOf(currentSong.src.split("/")[5])
        console.log(songs,"Index: "+index)
        Newindex = (index - 1 + songs.length) % songs.length;
        playMusic(songs[Newindex])


    })

     //Event Listener for Song Next button
     next.addEventListener("click",()=>{

        //next in above line is "id" of previous button
       //console.log(currentSong.src.split("/")[5])
      

        let index=songs.indexOf(currentSong.src.split("/")[5])
        console.log(songs,"Index: "+index)
        Newindex = (index + 1) % songs.length;
        playMusic(songs[Newindex])
    })



}

main()
