const generateLyrics = (textBlock, interval = 4.5) => {
  return textBlock.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map((text, index) => ({
      time: (index + 1) * interval, // Slower mock timing
      text
    }));
};

const happyLyricsText = `
It might seem crazy what I'm 'bout to say
Sunshine she's here, you can take a break
I'm a hot air balloon that could go to space
With the air, like I don't care, baby, by the way
Because I'm happy
Clap along if you feel like a room without a roof
Because I'm happy
Clap along if you feel like happiness is the truth
Because I'm happy
Clap along if you know what happiness is to you
Because I'm happy
Clap along if you feel like that's what you wanna do
Here come bad news, talking this and that
(Yeah!) Well, give me all you got, don't hold it back
(Yeah!) Well, I should probably warn you I'll be just fine
(Yeah!) No offense to you, don't waste your time
Here's why
Because I'm happy
Clap along if you feel like a room without a roof
Because I'm happy
Clap along if you feel like happiness is the truth
Because I'm happy
Clap along if you know what happiness is to you
Because I'm happy
Clap along if you feel like that's what you wanna do
Bring me down... can't nothing
Bring me down... my level's too high
Bring me down... can't nothing
Bring me down, I said (let me tell you now)
Because I'm happy
Clap along if you feel like a room without a roof
Because I'm happy
Clap along if you feel like happiness is the truth
`;

const ripLyricsText = `
Apa kata dunia, oh
Bila aku tak ada
Bila kau tak ada
Bila kita tak ada
Hari demi hari waktu pun berganti
Langkah demi langkah kita lewati
Banyak hal yang telah kita alami
Suka dan duka silih berganti
Kadang kita merasa sepi
Kadang kita merasa sendiri
Namun satu hal yang pasti
Kita takkan pernah mati di dalam hati
Apa kata dunia, oh
Bila aku tak ada
Bila kau tak ada
Bila kita tak ada
Kini saatnya kita harus sadari
Bahwa tak ada yang abadi di dunia ini
Semua yang bernyawa pasti akan pergi
Jadi buatlah hidupmu berarti
Sebelum kau pergi dan takkan kembali
Tinggalkan kenangan yang takkan mati
Rhyme in peace, kawan sejati
Karya dan namamu akan selalu di hati
`;

const menghujamLyricsText = `
Bila aku tatap mata indahmu
Bila aku cium aroma tubuhmu
Bila aku dengar desah nafasmu
Bila aku rasakan hangat pelukmu
Menghujam jantungku
Menembus nadiku
Menyapu nafasku
Menghancurkan aku
Bila aku raba halus kulitmu
Bila aku belai rambut indahmu
Bila aku dengar tutur katamu
Bila aku rasakan tulus cintamu
Menghujam jantungku
Menembus nadiku
Menyapu nafasku
Menghancurkan aku
Tak tertahan lagi rasanya
Ingin ku teriakkan cinta
Pada dunia bahwa kau milikku
Dan ku milikmu untuk selamanya
Menghujam jantungku
Menembus nadiku
Menyapu nafasku
Menghancurkan aku
`;

const chillLyricsText = `
Tak terasa gelap pun jatuh
Di ujung malam menuju pagi yang dingin
Hanya ada sedikit bintang malam ini
Mungkin karena kau sedang cantik-cantiknya
Lalu mataku merasa malu
Semakin dalam ia malu kali ini
Kadang juga ia takut
Tatkala harus berpapasan ditengah pelariannya
Di malam hari
Menuju pagi
Sedikit cemas
Banyak rindunya
Tak terasa gelap pun jatuh
Di ujung malam menuju pagi yang dingin
Hanya ada sedikit bintang malam ini
Mungkin karena kau sedang cantik-cantiknya
Lalu mataku merasa malu
Semakin dalam ia malu kali ini
Kadang juga ia takut
Tatkala harus berpapasan ditengah pelariannya
Di malam hari
Menuju pagi
Sedikit cemas
Banyak rindunya
`;

export const songsData = {
  happy: {
    title: "Happy - Pharrell Williams",
    audioSrc: "/happy.mp3",
    lyrics: [
      { time: 5, text: "(upbeat music) ♪ It might seem crazy what I'm 'bout to say ♪" },
      { time: 13, text: "♪ Sunshine she's here, you can take a break ♪ ♪ I'm a hot air balloon that could go to space ♪" },
      { time: 24, text: "♪ With the air, like I don't care, baby, by the way ♪ ♪ Because I'm happy ♪" },
      { time: 31, text: "♪ Clap along if you feel like a room without a roof ♪ ♪ Because I'm happy ♪" },
      { time: 37, text: "♪ Clap along if you feel like happiness is the truth ♪ ♪ Because I'm happy ♪" },
      { time: 43, text: "♪ Clap along if you know what happiness is to you ♪ ♪ Because I'm happy ♪" },
      { time: 49, text: "♪ Clap along if you feel like that's what you wanna do ♪" },
      { time: 55, text: "♪ Here come bad news, talking this and that ♪ ♪ Yeah ♪" },
      { time: 61, text: "♪ Give me all you got, don't hold it back ♪ ♪ Yeah ♪" },
      { time: 67, text: "♪ Well, I should probably warn ya, I'll be just fine ♪ ♪ Yeah ♪ ♪ No offense to you, don't waste your time ♪" },
      { time: 77, text: "♪ Here's why ♪ ♪ Because I'm happy ♪ ♪ Clap along if you feel like a room without a roof ♪ ♪ Because I'm happy ♪" },
      { time: 85, text: "♪ Clap along if you feel like happiness is the truth ♪ ♪ Because I'm happy ♪" },
      { time: 91, text: "♪ Clap along if you know what happiness is to you ♪ ♪ Because I'm happy ♪" },
      { time: 97, text: "♪ Clap along if you feel like that's what you wanna do ♪ ♪ Bring me down ♪" },
      { time: 104, text: "♪ Can't nothing bring me down ♪ ♪ My level's too high to bring me down ♪ ♪ Can't nothing bring me down, I said ♪" },
      { time: 114, text: "♪ Tell you now ♪ ♪ Bring me down ♪ ♪ Can't nothing bring me down ♪ ♪ My level's too high to bring me down ♪" },
      { time: 123, text: "♪ Can't nothing bring me down, I said ♪ ♪ Because I'm happy ♪ ♪ Clap along if you feel like a room without a roof ♪" },
      { time: 131, text: "♪ Because I'm happy ♪ ♪ Clap along if you feel like happiness is the truth ♪ ♪ Because I'm happy ♪" },
      { time: 139, text: "♪ Clap along if you know what happiness is to you ♪ ♪ Because I'm happy ♪" },
      { time: 145, text: "♪ Clap along if you feel like that's what you wanna do ♪ ♪ Because I'm happy ♪" },
      { time: 151, text: "♪ Clap along if you feel like a room without a roof ♪ ♪ Because I'm happy ♪" },
      { time: 157, text: "♪ Clap along if you feel like happiness is the truth ♪ ♪ Because I'm happy ♪" },
      { time: 163, text: "♪ Clap along if you know what happiness is to you ♪ ♪ Because I'm happy ♪" },
      { time: 169, text: "♪ Clap along if you feel like that's what you wanna do ♪ ♪ Bring me down ♪" },
      { time: 177, text: "♪ Can't nothing bring me down ♪ ♪ My level's too high to bring me down ♪ ♪ Can't nothing bring me down, I said ♪" },
      { time: 186, text: "♪ Because I'm happy ♪ ♪ Clap along if you feel like a room without a roof ♪ ♪ Because I'm happy ♪" },
      { time: 193, text: "♪ Clap along if you feel like happiness is the truth ♪ ♪ Because I'm happy ♪" },
      { time: 199, text: "♪ Clap along if you know what happiness is to you ♪ ♪ Because I'm happy ♪" },
      { time: 205, text: "♪ Clap along if you feel like that's what you wanna do ♪ ♪ Because I'm happy ♪" },
      { time: 211, text: "♪ Clap along if you feel like a room without a roof ♪ ♪ Because I'm happy ♪" },
      { time: 217, text: "♪ Clap along if you feel like happiness is the truth ♪ ♪ Because I'm happy ♪" },
      { time: 223, text: "♪ Clap along if you know what happiness is to you ♪ ♪ Because I'm happy ♪" },
      { time: 229, text: "♪ Clap along if you feel like that's what you wanna do ♪ ♪ Come on ♪" }
    ]
  },
  sad: {
    title: "R.I.P - Bondan Prakoso & Fade2Black",
    audioSrc: "/rip.mp3",
    lyrics: generateLyrics(ripLyricsText)
  },
  exciting: {
    title: "Menghujam Jantungku - Tompi",
    audioSrc: "/menghujam.mp3",
    lyrics: generateLyrics(menghujamLyricsText)
  },
  chill: {
    title: "Untuk Perempuan Yang Sedang Di Pelukan - Payung Teduh",
    audioSrc: "/perempuan.mp3",
    lyrics: generateLyrics(chillLyricsText)
  }
};
