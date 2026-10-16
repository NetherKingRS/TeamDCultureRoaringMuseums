// Add your video here, or use the Video Studio tab to download a replacement file.
// Accepts a YouTube link or a direct .mp4/.webm URL (including assets/intro.mp4).
window.MUSEUM_CONFIG = {
  backgroundMusic: "assets/jazz.mp3", // Optional: "assets/jazz.mp3". Blank uses the built-in jazz.
  // Upload MP3s to assets/narration/; set paths for each exhibit below.
  useDeviceNarration: false, // false disables the device voice for unrecorded exhibits.
  exhibitNarration: {  
    radio: "", leisure: "", advert: "",
    vote: "", flapper: "", work: "",
    lost: "assets/narration/lost.mp3", gatsby: "assets/narration/gatsby.mp3", dada: "assets/narration/dada.mp3",
    city: "assets/narration/city.mp3", rural: "assets/narration/rural.mp3", road: "assets/narration/road.mp3",
    jazzrecord: "assets/narration/jazzrecord.mp3", harlem: "assets/narration/harlem.mp3", dance: "assets/narration/dance.mp3",
    sport: "assets/narration/sport.mp3", cinema: "assets/narration/cinema.mp3", homefilm: "assets/narration/homefilm.mp3"
  },
  introVideo: "assets/intro.mp4",
  captions: "",
  studentNarration: "",
  studentNames: "",
  introTranscript: ""
};
