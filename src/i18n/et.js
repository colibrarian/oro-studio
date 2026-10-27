// Eestikeelne versioon. Kõik tekstid on siin; komponendid võtavad need võtmete järgi.
// NB: tõlge vajab enne avaldamist emakeelse lugeja ülevaatust.
const MONTHS = [
  "jaanuar", "veebruar", "märts", "aprill", "mai", "juuni",
  "juuli", "august", "september", "oktoober", "november", "detsember",
];

const et = {
  lang: "et",
  meta: {
    title: "ORO Studio – ruum kohtumisteks ja üritusteks Tallinna südames",
    description:
      "Hubane stuudio Tallinna kesklinnas: rent kohtumisteks, konsultatsioonideks ja töötubadeks, sünnipäevad ja polterõhtud võtmed kätte. Kuni 15 inimest, Narva mnt 4.",
    ogTitle: "ORO Studio – ruum, kus on hea kokku saada",
    ogDescription: "Hubane stuudio Tallinna kesklinnas kohtumisteks, töötubadeks, sünnipäevadeks ja polterõhtuteks. Kuni 15 inimest.",
  },

  wa: {
    format: "Tere! Palun aidake mul valida ORO Studios sobiv ürituse formaat.",
    turnkey: "Tere! Sooviksin teada, kui palju maksab võtmed-kätte üritus ORO Studios.",
    regular: "Tere! Sooviksin ORO Studios regulaarselt üritusi korraldada.",
    booking: ({ type, date, time, hours, guests, name, contact, comment, price }) =>
      [
        "Tere! Sooviksin ORO Studios aega broneerida.",
        `Formaat: ${type}`,
        `Kuupäev: ${date}`,
        `Kellaaeg: ${time} (${hours})`,
        `Külalisi: ${guests}`,
        `Nimi: ${name}`,
        `Kontakt: ${contact}`,
        comment ? `Kommentaar: ${comment}` : null,
        `Rendi hind kalkulaatori järgi: €${price}`,
      ]
        .filter(Boolean)
        .join("\n"),
  },

  common: {
    swipe: "Libista →",
    photoSoon: "Foto lisandub peagi",
    perHour: "/ tund",
    book: "Broneeri",
    bookStudio: "Broneeri stuudio",
    seeCalendar: "Vaata kalendrit",
  },

  nav: {
    links: [
      ["Stuudiost", "#about"],
      ["Formaadid", "#formats"],
      ["Võtmed kätte", "#turnkey"],
      ["Galerii", "#gallery"],
      ["Hinnad", "#pricing"],
      ["Kalender", "#booking"],
    ],
    toTop: "ORO Studio – üles",
    openMenu: "Ava menüü",
    closeMenu: "Sulge menüü",
    switchTo: { code: "RU", label: "На русском" },
  },

  hero: {
    eyebrow: "Tallinna südames",
    titleA: "Ruum, kus on hea ",
    titleB: "kokku saada",
    text:
      "Hubane stuudio kohtumisteks, töötubadeks, sünnipäevadeks ja polterõhtuteks. Rendi ruum või telli üritus võtmed kätte – kuni 15 inimest.",
    photoAlt: "ORO Studio puhkenurk",
    photoLabel: "Stuudio foto – puhkenurk",
  },

  about: {
    photoAlt: "Natalia, ORO Studio looja",
    photoLabel: "Natalia foto",
    eyebrow: "Stuudiost",
    title: "Minu nimi on Natalia ja ma olen ORO Studio looja",
    paragraphs: [
      "Mulle on alati meeldinud inimesi kokku tuua, uusi asju avastada ja luua enda ümber ruumi, kus on huvitav olla. Nii sündiski ORO.",
      "Ma ei tahtnud luua lihtsalt ilusat stuudiot paariks tunniks, vaid elavat paika inimestele ja nende ideedele. Siia võib tulla naisteringi, tutvuda põneva eksperdiga, viia läbi oma töötuba – või kutsuda kokku lähedased ja tähistada ilusalt sünnipäeva või polterõhtut.",
      "Täna tutvutakse siin eeterlike õlide ja mineraalidega, homme mängitakse transformatsioonimängu, maalitakse, räägitakse rahast või astroloogiast, ning mõne päeva pärast muutub ruum täielikult kellegi isikliku sündmuse järgi.",
    ],
    quote: "„ORO on iga kord natuke erinev. Sest seda täidavad inimesed.“",
    closing: "Ruum ja atmosfäär on siin juba olemas. Sina tule oma ideega.",
  },

  formats: {
    eyebrow: "Formaadid",
    title: "Siin saad korraldada oma ürituse",
    lead:
      "ORO Studio sobib väikestele ja hubastele sündmustele – mugavalt kuni 15 inimesele. Võid lihtsalt ruumi rentida või valida võtmed-kätte ürituse.",
    expertsTitle: "Ekspertidele",
    experts: [
      "Konsultatsioonid ja individuaalne töö",
      "Psühholoogi- ja coachingukohtumised",
      "Töötoad ja loovtegevused",
      "Loengud ja väikesed koolitused",
      "Naisteringid ja regulaarsed grupid",
      "Transformatsioonimängud",
      "Foto- ja videovõtted",
    ],
    privateTitle: "Eraüritusteks",
    private: ["Sünnipäevad", "Polterõhtud", "Sõbrannade kokkusaamised", "Teemaõhtud", "Loomingulised peod"],
  },

  why: {
    eyebrow: "Miks ORO Studio",
    title: "Hubane ruum, kus ei pea alustama tühjast toast",
    items: [
      { title: "Linna südames", text: "Ilusa ürituse pärast ei pea kaugele sõitma – külalistel on mugav kohale jõuda." },
      { title: "Hubane formaat", text: "Inimesed suhtlevad siin päriselt, mitte ei kao suurde saali ära. Kuni 15 inimest – mugavalt." },
      { title: "Ilusad fotonurgad", text: "Valmis nurgad ühispiltide, sisuloome ja kaadrite jaoks, mida tahad alles hoida." },
      { title: "Kõik meeleolu jaoks", text: "Kohv, tee, piim ja kerged suupisted – pisiasjad, mis muudavad kohtumise meeldivaks õhtuks." },
    ],
  },

  programs: [
    {
      slug: "perfume",
      title: "Oma parfüümi loomine",
      text: "Iga osaleja tutvub lõhnadega ja paneb eeterlikest õlidest kokku oma kompositsiooni. Mälestuseks jääb oma lõhn.",
    },
    {
      slug: "perfume-lecture",
      title: "Parfüümiloeng",
      text: "Brändid ja huvitavad lõhnad, nootide ja muljete arutelu. Meeldinud parfüümi saab osta kohe kohapeal.",
    },
    {
      slug: "candles",
      title: "Kavatsusküünlad",
      text: "Valid teema, millega soovid töötada, ja lood rituaalse küünla – oma kavatsuse sümboli.",
    },
    {
      slug: "painting",
      title: "Loominguline õhtu: maal lõuendil",
      text: "Loo kogenud meistri juhendamisel oma ainulaadne maal akrüülvärvidega. Joonistamisoskust pole vaja! Hubane õhkkond, inspiratsioon ja valmis maal, mille saad endaga kaasa võtta. Sobib suurepäraselt nii täiskasvanutele kui ka lastele, ka sünnipäevadeks.",
    },
    {
      slug: "astrology",
      title: "Astroloogiaõhtu",
      text: "Sinu astroloogiline portree. Teema valid ette: suhted, elu eesmärk, raha, tugevad küljed, oluline eluperiood või midagi muud.",
    },
    {
      slug: "numerology",
      title: "Numeroloogia",
      text: "Pilk iseendale ja oma elule numbrite kaudu. Programmi teema valime just teie seltskonnale.",
    },
    {
      slug: "minerals",
      title: "Mineraalid ja käevõrud",
      text: "Tutvume mineraalidega, valime sobivad kivid ja meisterdame oma käevõru – mälestuskingituse igale osalejale.",
    },
    {
      slug: "game",
      title: "Transformatsioonimäng „Kuhu unistused viivad“",
      text: "Kui tahad midagi enamat kui meelelahutust: vaata oma soove ja eesmärke uue nurga alt – naerdes ja mõtiskledes.",
    },
  ],

  turnkey: {
    eyebrow: "Üritused võtmed kätte",
    title: "Aga kui soovid enamat kui lihtsalt ruumi?",
    lead:
      "Tahad korraldada sünnipäeva või polterõhtu, aga ei taha ise programmi, eksperti ja toitu otsida ega iga pisiasja läbi mõelda? Jäta korraldamine meie hooleks.",
    chips: ["Alates 5 inimesest", "Pudel proseccot kingituseks", "Valmis fotonurgad"],
    cta: "Küsi hinda",
    priceNote: "Hind sõltub formaadist ja külaliste arvust.",
    cardTitle: "Stuudio on sinu päralt 4 tundi",
    timeline: [
      { hours: "2 tundi", text: "Valitud programm koos eksperdiga" },
      { hours: "2 tundi", text: "Aeg ainult teie seltskonnale: suhtlemine, pildid, prosecco, kingitused ja toit – keegi ei kiirusta" },
    ],
    programsEyebrow: "Vali programm",
    programsTitle: "Programmid sinu peoks",
    photoLabel: (title) => `Foto: ${title.toLowerCase()}`,
    cateringTitle: "Toitlustus",
    cateringText: "Aitame korraldada toidu ja suupisted teie seltskonnale.",
    cakeTitle: "Tort",
    cakeText: "Saab tellida eraldi.",
    addonsNote: "Saab peole juurde lisada, et ei peaks kõike ise korraldama.",
    addonsSmall: "Lisateenuste eest tasutakse eraldi.",
  },

  occasions: [
    {
      eyebrow: "Sünnipäev",
      title: "Pidu, mis sobib just sulle",
      text: "Ei pea valima restorani ja kodus koosviibimise vahel. Kutsu oma inimesed ilusasse ruumi ja lisa programm – või lihtsalt ilus õhtu toidu, tordi ja piltidega. Sina valid, meie aitame kõik kokku panna.",
      cta: "Vali kuupäev",
    },
    {
      eyebrow: "Polterõhtu",
      title: "Kutsu sõbrannad kokku ja tee õhtust eriline",
      text: "Võib tulla lihtsalt juttu ajama. Või luua oma lõhna, teha küünlaid või käevõrusid, saada teada oma astroloogiline portree või mängida transformatsioonimängu. Alates 5 inimesest.",
      cta: "Vali kuupäev",
    },
    {
      eyebrow: "Ekspertidele",
      title: "Ilus ruum sinu kohtumiseks",
      text: "Konsultant, psühholoog, coach, õpetaja, mängujuht või meister – vii siin läbi konsultatsioone, gruppe, loenguid ja töötubasid. Ei pea iga kord uut ruumi otsima.",
      cta: "Arutame regulaarseid kohtumisi",
    },
  ],

  gallery: {
    eyebrow: "Galerii",
    title: "Vaata, milline on elu stuudios",
    lead: "Päris inimesed. Päris kohtumised. Erinevad põhjused. Üks ruum.",
    open: (label) => `Ava foto: ${label}`,
    close: "Sulge",
    prev: "Eelmine foto",
    next: "Järgmine foto",
    photos: [
      { label: "Pidu stuudios", alt: "Pidu ORO Studios" },
      { label: "Meditatiivne ring", alt: "Grupikohtumine" },
      { label: "Töötuba", alt: "Töötuba stuudios" },
      { label: "Peo detailid", alt: "Pidulik magustoit" },
      { label: "Soojad kohtumised", alt: "Stuudio külalised" },
      { label: "Ruum praktikateks", alt: "Praktika stuudios" },
      { label: "Vaikuse hetk", alt: "Kohtumine stuudios" },
      { label: "ORO atmosfäär", alt: "Stuudio külaline" },
      { label: "Loominguline protsess", alt: "Töötuba" },
    ],
  },

  pricing: {
    eyebrow: "Stuudio rent",
    title: "Selge hind – ilma üllatusteta",
    tiers: [
      { title: "Individuaalne töö", sub: "1–2 inimest", note: "Konsultatsioonid ja kohtumised" },
      { title: "Grupiüritused", sub: "3–10 inimest" },
      { title: "Grupiüritused", sub: "11–15 inimest" },
    ],
    cleaning: "✦ Koristusteenus (vajadusel) – €20, tasutakse eraldi",
    regularA: "✦ Plaanid regulaarseid üritusi? ",
    regularLink: "Kirjuta meile",
    regularB: " – leiame sobiva lahenduse",
    includedTitle: "Mida stuudios saad",
    included: [
      "Hubane valmis ruum ja mugav mööbel",
      "Ilusad fotonurgad",
      "Kohv, tee, piim ja kerged suupisted",
      "Üritused kuni 15 inimesele",
      "Mugav asukoht linna südames",
    ],
    includedQuote: "Sa ei pea alustama tühjast toast – lihtsalt tule ja loo oma üritus.",
    equipmentTitle: "Lähemalt varustusest",
    equipment: [
      "Hea Wi-Fi",
      "Teler, millega saab ühendada sülearvuti",
      "JBL Bluetooth-kõlar",
      "Kohvimasin ja piimavahustaja",
      "Minikülmik, kuuma ja külma veega veeautomaat",
      "Söögilaud ja toolid, nõud 15 inimesele",
      "Veini- ja šampanjaklaasid, kirjatarbed",
    ],
    floorNote: "Korrusel, kokkuleppel broneerimisel:",
    floor: ["Ahi", "Nõudepesumasin", "Mikrolaineahi"],
  },

  booking: {
    months: MONTHS.map((m) => m[0].toUpperCase() + m.slice(1)),
    weekdays: ["E", "T", "K", "N", "R", "L", "P"],
    dateLabel: (d, m, y) => `${d}. ${MONTHS[m]} ${y}`,
    hours: (n) => `${n} ${n === 1 ? "tund" : "tundi"}`,
    guests: (n) => `${n} ${n === 1 ? "külaline" : "külalist"}`,
    eventTypes: {
      individual: "Individuaalne töö",
      group: "Grupiüritus",
      workshop: "Töötuba",
      birthday: "Sünnipäev",
      bachelorette: "Polterõhtu",
      game: "Transformatsioonimäng",
      other: "Muu",
    },
    eyebrow: "Kalender",
    title: "Vali kuupäev",
    lead: "Vaata vabu kuupäevi, vali kellaaeg ja räägi veidi oma kohtumisest.",
    prevMonth: "Eelmine kuu",
    nextMonth: "Järgmine kuu",
    freeTime: (date) => `Vabad ajad: ${date}`,
    duration: "Kestus tundides",
    formTitle: "Räägi veidi oma kohtumisest",
    typeLabel: "Mida soovid korraldada?",
    guestsLabel: "Külaliste arv (kuni 15)",
    name: "Sinu nimi",
    contact: "Telefon / sobiv kontaktviis",
    contactAria: "Telefon või sobiv kontaktviis",
    comment: "Kommentaar",
    desired: "Soovitud aeg:",
    rent: "Rent:",
    perHourShort: "/tund",
    turnkeyNote: "Võtmed-kätte programmi hind arvutatakse eraldi.",
    chooseHint: "Vali kalendrist kuupäev ja kellaaeg",
    submit: "Broneeri WhatsAppi kaudu",
    submitNote: "Avaneb WhatsApp valmis sõnumiga – jääb vaid vajutada „Saada“.",
    doneTitle: (name) => `Aitäh, ${name}! Peaaegu valmis`,
    doneText:
      "Avasime WhatsAppi valmis sõnumiga. Saada see ära ja me võtame sinuga ühendust, et broneering kinnitada ja arve saata.",
    submitCal: "Broneeri",
    submitNoteCal: "Aeg broneeritakse kohe meie kalendris. Võtame sinuga ühendust, et broneering kinnitada.",
    sending: "Saadame…",
    loadingSlots: "Kontrollime vabu aegu…",
    slotsError: "Vabade aegade laadimine ebaõnnestus. Päringu saad saata WhatsAppi kaudu, kinnitame aja käsitsi.",
    slotBusy: "See aeg on juba broneeritud",
    dayFull: "See päev on täielikult broneeritud",
    taken: "Keegi broneeris selle aja just praegu. Palun vali mõni teine aeg.",
    sendError: "Päringu saatmine ebaõnnestus. Saada see WhatsAppi kaudu, see võtab vaid minuti.",
    sendErrorCta: "Saada WhatsAppi kaudu",
    doneTitleCal: (name) => `Aitäh, ${name}! Päring on vastu võetud`,
    doneTextCal:
      "Broneerisime selle aja sinu jaoks esialgselt ja võtame peagi ühendust, et broneering kinnitada ja arve saata.",
    reopen: "Ava WhatsApp uuesti",
    again: "Saada uus päring",
  },

  faq: {
    eyebrow: "Kasulik teada",
    title: "Korduma kippuvad küsimused",
    items: [
      { q: "Kus stuudio asub?", a: "Tallinna kesklinnas, aadressil Narva mnt 4." },
      { q: "Mitu inimest stuudiosse mahub?", a: "Stuudio on mõeldud hubastele üritustele: mugavalt kuni 15 inimest." },
      {
        q: "Kui palju rent maksab?",
        a: "Rent on tunnipõhine: €20 tunnis individuaalseks tööks (1–2 inimest), €30 tunnis 3–10-liikmelisele grupile ja €40 tunnis 11–15-liikmelisele grupile. Võtmed-kätte üritused arvutatakse eraldi.",
      },
      {
        q: "Mis on rendi hinna sees?",
        a: "Valmis hubane ruum koos mööbliga, fotonurgad, Wi-Fi, teler sülearvuti ühendamiseks, Bluetooth-kõlar, kohvimasin, kohv, tee ja kerged suupisted ning nõud 15 inimesele.",
      },
      {
        q: "Kuidas stuudiot broneerida?",
        a: "Vali kodulehe kalendrist vaba kuupäev ja kellaaeg ning saada päring või kirjuta meile otse WhatsAppis: +372 5336 3795.",
      },
      {
        q: "Mis on võtmed-kätte üritus?",
        a: "Võtame korraldamise enda peale: stuudio 4 tunniks, millest 2 tundi on programm koos eksperdiga ja 2 tundi ainult teie seltskonnale. Alates 5 inimesest, pudel proseccot kingituseks.",
      },
      {
        q: "Kuidas broneeringut kinnitada?",
        a: "Kinnitad broneeringu 3 päeva enne üritust, misjärel saadame sulle arve.",
      },
      {
        q: "Kas võib tulla varem või kauemaks jääda?",
        a: "Jah, lisatasuta: individuaalse töö puhul kuni 15 minutit ja ürituste puhul kuni 30 minutit. Kui jääd kauemaks, tuleb tasuda järgmise tunni eest.",
      },
      {
        q: "Kes pärast üritust koristab?",
        a: "Stuudio peab jääma samasse seisukorda, nagu see oli enne broneeringut – selle eest vastutab korraldaja. Kui ise koristada ei taha, telli koristusteenus hinnaga €20.",
      },
      {
        q: "Kas alkohol on lubatud?",
        a: "Alkoholiga üritused tuleb broneerimisel kokku leppida. Suitsetamine, sealhulgas e-sigaretid, ja narkootilised ained on stuudios keelatud.",
      },
      {
        q: "Kas saab üritusi korraldada regulaarselt?",
        a: "Jah. Kui soovid saada stuudio püsikliendiks, kirjuta meile – leiame sobiva koostöövormi.",
      },
    ],
    helpTitle: "Ei tea, millist formaati valida?",
    helpText:
      "Räägi, mida soovid tähistada või korraldada, kui palju tuleb külalisi ja millist meeleolu soovid luua – aitame sobiva formaadi leida.",
    helpCta: "Leia sobiv formaat",
  },

  final: {
    eyebrow: "Siin toimub alati midagi",
    text: "Täna konsultatsioon, homme naisteringi kohtumine, nädalavahetusel sünnipäev või polterõhtu. ORO Studio muutub iga kord eriliseks tänu inimestele, kes siia tulevad.",
    titleA: "Sinu järgmine ilus õhtu ",
    titleB: "võib alata siit",
    sub: "Vali kuupäev, räägi oma ideest – ja me aitame sellest päris sündmuse teha.",
  },

  footer: {
    tagline: "Ruum kohtumisteks, üritusteks ja ilusateks sündmusteks.",
    contacts: "KONTAKT",
    address: "Narva mnt 4, Tallinn – linna süda",
    hours: "Iga päev, broneerimise alusel",
    social: "SOTSIAALMEEDIA",
    rights: "Kõik õigused kaitstud.",
  },
};

export default et;
