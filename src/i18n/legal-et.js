// Õigusteabe leht (/tingimused/): broneerimistingimused, privaatsuspoliitika, küpsised.
// Ühendatud et.js-is võtmena `legal`. Venekeelne versioon on legal-ru.js, muuda mõlemat korraga.
// Lingid tekstis: [tekst](aadress). Punktis: h pealkiri, intro lõigud enne loendit, list loend, p lõigud pärast. NB: enne avaldamist lasta juristil ja emakeelsel lugejal üle vaadata.
const legal = {
  meta: {
    title: "Tingimused ja privaatsus | ORO Studio",
    description:
      "ORO Studio broneerimistingimused (tasumine, tühistamine, stuudio reeglid), privaatsuspoliitika ja teave küpsiste kohta. Flor Da Vida OÜ, Narva mnt 4, Tallinn.",
  },
  footer: {
    terms: "Broneerimistingimused",
    privacy: "Privaatsus",
    cookies: "Küpsised",
  },
  // Rida päringu saatmise nupu all.
  bookingNote: {
    a: "Päringu saatmisega nõustud ",
    terms: "broneerimistingimustega",
    b: ". Andmeid töötleme ",
    privacy: "privaatsuspoliitika",
    c: " järgi.",
  },
  back: "Avalehele",
  eyebrow: "Õigusteave",
  title: "Tingimused ja privaatsus",
  updated: "Uuendatud 18. novembril 2026",
  intro:
    "Siit leiad ORO Studio rentimise tingimused, info selle kohta, kuidas me sinu andmeid töötleme, ja teabe küpsiste kohta. Kui midagi jääb segaseks, kirjuta meile: [events@orostudiotallinn.com](mailto:events@orostudiotallinn.com) või WhatsApp [+372 5336 3795](https://wa.me/37253363795).",
  tocTitle: "Sisukord",
  sections: [
    {
      id: "terms",
      title: "Broneerimistingimused",
      items: [
        {
          h: "1. Teenuse osutaja",
          p: [
            "ORO Studiot aadressil Narva mnt 4, Tallinn, annab rendile Flor Da Vida OÜ (registrikood 17254532, Narva mnt 4, 10117 Tallinn). Kontakt: [events@orostudiotallinn.com](mailto:events@orostudiotallinn.com), +372 5336 3795. Edaspidi „meie“ või „stuudio“.",
            "Need tingimused kehtivad stuudio tunnipõhise rendi ja võtmed-kätte ürituste kohta. Päringu saatmisega nõustud nende tingimustega.",
          ],
        },
        {
          h: "2. Päring ja broneeringu kinnitamine",
          p: [
            "Aja saad valida kodulehe kalendrist, WhatsAppis või e-posti teel. Kalendri kaudu saadetud päringu korral broneeritakse valitud aeg kohe esialgselt ja sinu e-postile tuleb kiri üksikasjadega.",
            "Valitud tundide rendi eest esitame ühe arve. Maksetähtaeg on 3 päeva, kuid mitte hiljem kui ürituse algus. Broneering on kinnitatud, kui makse on meie kontole laekunud.",
            "Kui arve ei ole tähtajaks tasutud, võime esialgse broneeringu tühistada ja aja vabastada. Enne seda püüame sinuga ühendust võtta.",
          ],
        },
        {
          h: "3. Hinnad",
          p: [
            "Rent on tunnipõhine: €20 tunnis 1–2 inimesele, €30 tunnis 3–10 inimesele, €40 tunnis 11–15 inimesele. Kodulehe kalkulaator arvutab hinna nende määrade järgi ja see on sama summa, mis tuleb arvele.",
            "Võtmed-kätte üritused (sünnipäev, polterõhtu ja muud programmid koos eksperdiga) arvutatakse eraldi: sisu, hinna ja tasumise korra lepime sinuga kokku isiklikult.",
            "Soovi korral lisaks: koristusteenus €20.",
          ],
        },
        {
          h: "4. Tühistamine ja muutmine",
          p: [
            "Broneeringu saad tühistada igal ajal: kirjuta meile e-postile või WhatsAppi. Kui rent on juba tasutud, tagastame kogu summa, välja arvatud €20. Neid €20 ei tagastata: see katab aja, mida stuudio sinu jaoks hoidis.",
            "Raha tagastame kontole, millelt makse tehti, 14 päeva jooksul pärast tühistamist.",
            "Ürituse saab kokkuleppel teisele kuupäevale tõsta, kui uus aeg on vaba.",
            "Kui üritus ei saa toimuda meie süül või meist ja sinust sõltumatutel põhjustel (avarii, elektrikatkestus vms), pakume uue aja või tagastame kogu makse koos €20-ga.",
          ],
        },
        {
          h: "5. Taganemisõigus (14 päeva)",
          p: [
            "Stuudio rent kindlaks kuupäevaks on vaba aja veetmisega seotud teenus, millel on kindel täitmise kuupäev, seega 14-päevane taganemisõigus internetis sõlmitud lepingust selle kohta ei kehti (võlaõigusseaduse § 53 lg 4 p 13). Broneeringu saad alati tühistada punkti 4 tingimustel.",
          ],
        },
        {
          h: "6. Rendiaeg",
          p: [
            "Tasutud aja sisse kuuluvad ettevalmistus, üritus ise ja pärast seda asjade kokku panemine.",
            "Varem tulla või kauemaks jääda võib lisatasuta: individuaalse töö puhul kuni 15 minutit ja ürituste puhul kuni 30 minutit. Kui jääd kauemaks, tuleb tasuda järgmise tunni eest.",
          ],
        },
        {
          h: "7. Stuudio reeglid",
          list: [
            "Stuudios võib korraga olla kuni 15 inimest.",
            "Korraldaja ehk broneeringu teinud inimene vastutab oma külaliste eest ja selle eest, et stuudio jääks samasse seisukorda, nagu see oli enne üritust. Kui ise koristada ei taha, telli koristusteenus hinnaga €20.",
            "Alkoholiga üritused tuleb broneerimisel kokku leppida. Alaealistele alkoholi ei pakuta.",
            "Suitsetamine, sealhulgas e-sigaretid, ja igasugused narkootilised ained on stuudios keelatud.",
            "Palun kasuta mööblit, tehnikat ja nõusid hoolikalt. Korraldaja või külaliste tekitatud kahju hüvitab korraldaja vastavalt seadusele. Palun anna igast kahjustusest kohe teada.",
            "Lapsed viibivad stuudios täiskasvanute järelevalve all.",
            "Võime ürituse katkestada, kui reegleid jämedalt rikutakse või kui tekib oht inimestele või varale. Sellisel juhul makset ei tagastata.",
          ],
        },
        {
          h: "8. Isiklikud asjad",
          p: [
            "Palun hoia oma asjadel silm peal. Unustatud asju hoiame 30 päeva: kirjuta meile ja lepime kokku, kuidas need kätte saad.",
          ],
        },
        {
          h: "9. Pretensioonid ja vaidlused",
          p: [
            "Kui midagi läks valesti, kirjuta meile aadressil [events@orostudiotallinn.com](mailto:events@orostudiotallinn.com). Vastame 15 päeva jooksul.",
            "Kui kokkuleppele ei jõua, võib tarbija pöörduda tasuta Tarbijakaitse ja Tehnilise Järelevalve Ameti juures tegutseva tarbijavaidluste komisjoni poole ([ttja.ee](https://www.ttja.ee)) või kohtusse. Tingimustele kohaldatakse Eesti Vabariigi õigust.",
          ],
        },
      ],
    },
    {
      id: "privacy",
      title: "Privaatsuspoliitika",
      items: [
        {
          h: "1. Kes andmeid töötleb",
          p: [
            "Isikuandmete vastutav töötleja on Flor Da Vida OÜ (registrikood 17254532), Narva mnt 4, 10117 Tallinn. Andmetega seotud küsimustes kirjuta aadressil [events@orostudiotallinn.com](mailto:events@orostudiotallinn.com).",
          ],
        },
        {
          h: "2. Milliseid andmeid kogume",
          list: [
            "Broneerimisvormist: nimi, e-post, telefon (soovi korral), kommentaar ja ürituse andmed: kuupäev, kellaaeg, formaat, külaliste arv.",
            "Kirjavahetusest: see, mida meile kirjutad e-posti, WhatsAppi, Telegrami või sotsiaalmeedia kaudu.",
            "Arve jaoks: nimi, e-post, summa, arve number ja makse andmed (maksja nimi ja pangakonto pangaväljavõttelt).",
          ],
          p: [
            "Me ei kogu andmeid selle kohta, kuidas sa kodulehte kasutad: lehel ei ole analüütikat, reklaame ega külastuste loendureid. Ise me külastajate IP-aadresse ei näe ega säilita.",
          ],
        },
        {
          h: "3. Milleks ja mis alusel",
          list: [
            "Et päring vastu võtta, aeg broneerida, arve esitada, üritus läbi viia ja sinuga broneeringu asjus suhelda. Alus: lepingu sõlmimine ja täitmine (isikuandmete kaitse üldmääruse art 6 lg 1 p b).",
            "Et pidada raamatupidamist ja säilitada arveid. Alus: seadusest tulenev kohustus, raamatupidamise seadus (art 6 lg 1 p c).",
            "Et vastata sinu küsimustele, kaitsta kodulehte rämpspostituste eest ja vajadusel kaitsta oma õigusi vaidluses. Alus: meie õigustatud huvi (art 6 lg 1 p f).",
          ],
          p: [
            "Me ei saada reklaami, ei müü ega jaga sinu andmeid turunduseks ega tee sinu kohta automatiseeritud otsuseid. Päringu saatmiseks on vaja nime ja e-posti: ilma nendeta ei saa me saata kinnitust ega arvet.",
          ],
        },
        {
          h: "4. Kes veel andmetele ligi pääseb",
          intro: ["Andmeid näeme ainult meie ja teenused, mis meid aitavad. Nad töötlevad andmeid meie ülesandel:"],
          list: [
            "Google (Google Ireland Limited): konto events@orostudiotallinn.com kalender, e-post, Google Drive ja Sheets ning Google Apps Script, mille kaudu kodulehe kalender näitab vabu aegu ja võtab päringuid vastu. Seetõttu pöördub sinu brauser kalendri avamisel ja päringu saatmisel Google'i serveri poole ning Google näeb sinu IP-aadressi.",
            "GitHub (GitHub, Inc.): kodulehe majutus (GitHub Pages). Nagu iga majutusteenus, näeb see külastajate IP-aadressi ja brauseri andmeid ning säilitab neid turvalisuse huvides tehnilistes logides.",
            "Pank: arve tasumisel ja raha tagastamisel.",
            "Raamatupidaja: arved ja väljavõtted raamatupidamise jaoks.",
            "WhatsApp, Telegram, Instagram, Facebook: ainult siis, kui kirjutad meile ise seal. Neile kehtivad nende endi privaatsustingimused.",
          ],
        },
        {
          h: "5. Andmete edastamine väljapoole ELi",
          p: [
            "Google ja GitHub võivad andmeid töödelda ka USA-s. Edastamine toimub Euroopa Komisjoni kaitse piisavuse otsuse (EL–USA andmekaitse raamistik, millega mõlemad ettevõtted on liitunud) ja ELi tüüptingimuste alusel.",
          ],
        },
        {
          h: "6. Kui kaua andmeid säilitame",
          list: [
            "Päringud, kalendri broneeringud ja kirjavahetus: kuni 3 aastat pärast üritust (lepingunõuete üldine aegumistähtaeg). Päringud, millest broneeringut ei saanud, kustutame varem, 12 kuu jooksul.",
            "Arved ja maksedokumendid: 7 aastat, nagu nõuab raamatupidamise seadus.",
          ],
        },
        {
          h: "7. Sinu õigused",
          p: [
            "Võid küsida oma andmete koopiat, paluda neid parandada või kustutada, piirata nende töötlemist, esitada vastuväite õigustatud huvi alusel toimuvale töötlemisele ja saada oma andmed masinloetaval kujul. Selleks kirjuta aadressil [events@orostudiotallinn.com](mailto:events@orostudiotallinn.com), vastame kuu aja jooksul. Andmeid, mida seadus kohustab meid säilitama (näiteks arved), ei saa me enne säilitustähtaja lõppu kustutada.",
            "Kui leiad, et rikume sinu õigusi, võid pöörduda Andmekaitse Inspektsiooni poole (Tatari 39, Tallinn, [info@aki.ee](mailto:info@aki.ee), [www.aki.ee](https://www.aki.ee)).",
          ],
        },
        {
          h: "8. Muudatused",
          p: ["Kui seda poliitikat muudame, avaldame uue versiooni sellel lehel koos uue kuupäevaga."],
        },
      ],
    },
    {
      id: "cookies",
      title: "Küpsised",
      items: [
        {
          p: [
            "ORO Studio koduleht ei kasuta küpsiseid ega salvesta sinu seadmesse midagi (ei küpsiseid ega localStorage'i). Lehel ei ole analüütikat, reklaame, sotsiaalmeedia piksleid ega teiste teenuste sisseehitatud vidinaid. Fondid laaditakse meie enda lehelt. Seepärast ei näita me küpsiste nõusoleku riba: pole millega nõustuda.",
            "Broneerimiskalender laadib vabad ajad Google Apps Scripti teenusest. See päring ei edasta ega salvesta sinu brauserisse küpsiseid, kuid Google näeb sinu IP-aadressi (vt privaatsuspoliitika punkt 4).",
            "Lingid Instagrami, Facebooki, Telegrami, WhatsAppi ja Google Mapsi juurde viivad nende teenuste lehtedele. Seal kehtivad nende teenuste reeglid ja küpsised.",
            "Kui lisame kunagi analüütika või muud küpsised, uuendame enne seda lehte ja küsime vajadusel sinu nõusolekut.",
          ],
        },
      ],
    },
  ],
};

export default legal;
