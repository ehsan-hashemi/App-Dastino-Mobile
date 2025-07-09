const stories = [
  { title: "سلمان کر و شعبان کر", code: "۰۰۰۱", type: "حکایت، طنز", url: "/dastanz/سلمان کر و شعبان کر - 0001/" },
  { title: "ملانصرالدین و دانشمند", code: "۰۰۰۲", type: "حکایت، طنز", url: "/dastanz/ملانصرالدین و دانشمند - 0002/" },
  { title: "ماه یا خورشید؟ ملانصرالدین", code: "۰۰۰۳", type: "حکایت، طنز", url: "/dastanz/ماه یا خورشید؟ ملانصرالدین - 0003/" },
  { title: "نقاشی فرشته و شیطان", code: "۰۰۰۴", type: "حکایت", url: "/dastanz/نقاشی فرشته و شیطان - 0004/" },
  { title: "مسلمان واقعی", code: "۰۰۰۵", type: "حکایت، طنز", url: "/dastanz/ماه یا خورشید؟ ملانصرالدین - 0005/" },
  { title: "درخت مراد", code: "۰۰۰۶", type: "حکایت", url: "/dastanz/درخت مراد - 0006/" }
  // داستان‌های بیشتر رو اینجا اضافه کن
];

function normalize(text) {
  return text
    .replace(/\s/g, "")
    .replace(/[۰-۹]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728))
    .toLowerCase();
}

function searchStories(query) {
  const resultContainer = document.getElementById("results");

  if (!query.trim()) {
    resultContainer.innerHTML = "<p style='text-align:center;'>لطفاً عبارتی برای جستجو وارد کنید.</p>";
    return;
  }

  const resultLimit = parseInt(document.getElementById("resultLimit").value);
  const normQuery = normalize(query);
  const queryLetters = normQuery.split("");

  const scores = stories.map(story => {
    const normTitle = normalize(story.title);
    let matchScore = 0;
    let matchedLetters = 0;

    // امتیاز ویژه برای تطابق کامل عبارت
    if (normTitle.includes(normQuery)) {
      matchScore += normQuery.length * 4;
    }

    // امتیاز حروف جداگانه با موقعیت
    queryLetters.forEach(letter => {
      const index = normTitle.indexOf(letter);
      if (index !== -1) {
        matchedLetters++;
        matchScore += index < 3 ? 3 : index < 6 ? 2 : 1;
      }
    });

    const missingLetters = queryLetters.length - matchedLetters;
    const isAcceptable = matchedLetters > 0 && missingLetters <= 5;

    return { story, matchScore, isAcceptable };
  });

  const filteredScores = scores
    .filter(item => item.isAcceptable)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, resultLimit);

  resultContainer.innerHTML = `
    <p style="text-align: center; margin: 15px; font-size: x-large;">
      نتایج برای "<strong>${query}</strong>":
    </p>
  `;

  if (filteredScores.length === 0) {
    resultContainer.innerHTML += "<p style='text-align:center;'>نتیجه‌ای یافت نشد. لطفاً عبارت دقیق‌تری وارد کنید.</p>";
    return;
  }

  filteredScores.forEach(({ story }) => {
    resultContainer.innerHTML += `
      <h3 class="cardsne" style="text-align:center;">
        <a class="cardsa" href="${story.url}">${story.title}</a>
      </h3>
      <p class="cardsinfo" style="text-align:center;">کد: ${story.code} - نوع: ${story.type}</p>
      <br><hr class="hrcards"><br>
    `;
  });
}

// اجرا با دکمه کلیک
document.querySelector(".searchbutton").addEventListener("click", e => {
  e.preventDefault();
  const query = document.getElementById("search").value;
  searchStories(query);
});

// اجرا با کلید Enter
document.getElementById("search").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = this.value;
    searchStories(query);
  }
});