
let audio = new Audio(); 
let currentTrack = "";
let songsList = [];
let currentIndex = 0;
let section = "";

async function getsongs(section) {
  let a = await fetch(`http://127.0.0.1:3000/songs/${section}`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${section}/`)[1]);
    }
  }
  
  songsList = songs;
  return songs;
}

function playMusic(track) {
  let activesection = section;
  currentTrack = track;
  currentIndex = songsList.indexOf(track);

  audio.src = `http://127.0.0.1:3000/songs/${activesection}/${track}`;
  audio.play().then(() => {
    console.log(`Playing: ${track}`);
  }).catch(err => console.error("Audio playback error:", err));


let seekbar = document.querySelector(".seekbar");
let progress = document.querySelector(".circle");

// Move the circle with the same width and height
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    let percentage = (audio.currentTime / audio.duration) * 100;
    progress.style.left = `${percentage}%`;
  }
});

// Seek to a specific portion when clicking on the seekbar
seekbar.addEventListener("click", (e) => {
  let clickPosition = e.offsetX / seekbar.clientWidth;
  audio.currentTime = clickPosition * audio.duration;
});

  
 let playButton = document.querySelector(".play");
 let nextButton = document.querySelector(".next");
 let prevButton = document.querySelector(".previous");

 if (playButton) {
   playButton.addEventListener("click", () => {
     if (audio.paused) {
       audio.play();
     } else {
       audio.pause();
     }
   });
 } else {
   console.error("Play button not found!");
 }

 if (nextButton) {
   nextButton.addEventListener("click", () => {
     if (currentIndex < songsList.length - 1) {
       playMusic(songsList[currentIndex + 1]);
     }
   });
 } else {
   console.error("Next button not found!");
 }

 if (prevButton) {
   prevButton.addEventListener("click", () => {
     if (currentIndex > 0) {
       playMusic(songsList[currentIndex - 1]);
     }
   });
 } else {
   console.error("Previous button not found!");
 }
}

async function loadSongs(section) {
  let songs = await getsongs(section);
  let songUl = document.querySelector(".songlist ul");
  songUl.innerHTML = "";

  songs.forEach(song => {
    let li = document.createElement("li");
    li.innerHTML = `
      <div class="musicinfo">
        <img src="svgs/music.svg" alt="">
        <div class="songinfo">${song.replaceAll("%20", " ")  
          .replace(".mp3", " ") 
          .trim() 
          } </div>
      </div>
      <div class="playnow">
        <span>Play Now</span>
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="24" color="#ffffff" fill="#000000">
            <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
        </svg>
      </div>
    `;
    songUl.appendChild(li);

    li.addEventListener("click", () => {
      playMusic(song);
    });
  });
}

window.onload = function () {
  let navItems = document.querySelectorAll(".nav-item");

  navItems.forEach((nav) => {
    nav.addEventListener("click", async () => {
      document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
      nav.classList.add("active");
      section = nav.dataset.section;

      // let section = nav.dataset.section;
      let submain = document.querySelector(".submain");
      if (!submain) return;

      let response = await fetch("http://127.0.0.1:3000/html/songs.html");
      if (!response.ok) throw new Error("Network response was not ok");

      let data = await response.text();
      submain.innerHTML = data;

      await loadSongs(section);

      setTimeout(() => {
        let titlesub = submain.querySelector(".text");
        let imgsub = submain.querySelector(".img");
        let titleElements = nav.querySelectorAll(".font-style3");
        let img = nav.querySelector("img");

        if (titlesub && titleElements.length) {
          titlesub.innerHTML = Array.from(titleElements).map(el => el.innerHTML).join(" - ");
        }
        if (imgsub && img) {
          imgsub.innerHTML = `<img src="${img.src}" alt="Image" />`;
        }
      }, 100);
    });
  });
};

  let SignUp = document.querySelector(".sign-up");
  SignUp.addEventListener("click", async ()=>{
   let response = await fetch("http://127.0.0.1:3000/html/signup.html")
   let page = document.querySelector(".body");
   let data = await response.text();
   page.innerHTML = data;
  })
 
  let Login = document.querySelector(".login");
  Login.addEventListener("click", async ()=>{
   let response = await fetch("http://127.0.0.1:3000/html/login.html")
   let page = document.querySelector(".body");
   let data = await response.text();
   page.innerHTML = data;
  })

