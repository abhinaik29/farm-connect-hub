import type { Animal } from "./types";

export const HERD: Animal[] = [
  { rfid: "POB-9283", nickname: "Gauri", breed: "F1 Hybrid", pedigree: { maternal: "Native Dharwadi", sire: "Elite Murrah" }, dob: "2021-03-14", gebv: 118, yieldLpd: 8.5, status: "Efficient" },
  { rfid: "POB-7192", nickname: "Ganga", breed: "F1 Hybrid", pedigree: { maternal: "Native Dharwadi", sire: "Nili-Ravi" }, dob: "2020-11-02", gebv: 122, yieldLpd: 9.1, status: "Efficient" },
  { rfid: "POB-0481", nickname: "Kali", breed: "Indigenous", pedigree: { maternal: "Native Dharwadi", sire: "Native Dharwadi" }, dob: "2019-08-21", gebv: 96, yieldLpd: 2.5, status: "Baseline" },
];

export const YIELD_30D = [
  6.2, 6.4, 6.8, 7.1, 7.0, 7.4, 7.8, 8.0, 7.6, 7.9, 8.2, 8.4, 8.1, 8.6, 8.9,
  9.1, 8.8, 9.0, 9.3, 9.0, 8.7, 9.1, 9.4, 9.2, 8.9, 9.1, 9.3, 9.0, 8.8, 9.1,
];

export const TRANSACTIONS = [
  { d: "16-Jul", label: "Daily milk payment", amt: 792 },
  { d: "16-Jul", label: "Carbon bonus", amt: 88 },
  { d: "15-Jul", label: "Daily milk payment", amt: 810 },
  { d: "15-Jul", label: "Carbon bonus", amt: 90 },
  { d: "14-Jul", label: "Daily milk payment", amt: 765 },
  { d: "10-Jul", label: "Bank withdrawal", amt: -2000 },
];

export const LANGS = {
  en: { header: "PROJECT ONE BUFFALO (KARWAR)", overview: "Overview", wallet: "My Climate Wallet", balance: "Total Balance accrued", withdraw: "Withdraw to Bank", history: "Transaction History", herd: "My Decentralized Herd", active: "Active Animals", perf: "Daily Performance", lastDrop: "Last Milk Drop", yield: "Yield", fat: "Avg Fat", snf: "Avg SNF", pay: "Daily Payment", carbon: "Carbon Bonus", alerts: "Vet & Breeding Alerts", alertMsg: "Ganga is entering her optimal artificial insemination window. Breed-code lock active.", climate: "Climate Performance", methane: "Methane avoided", offset: "Carbon offset", reqVet: "Request Vet Visit", close: "Close", scan: "Scan EID Tag", logMilk: "Log Milk Drop", yield30: "Yield · Last 30 days", details: "Cattle Detail", signOut: "Sign out" },
  hi: { header: "प्रोजेक्ट वन बफ़ेलो (कारवार)", overview: "मुख्य", wallet: "मेरा क्लाइमेट वॉलेट", balance: "कुल संचित शेष", withdraw: "बैंक में भेजें", history: "लेन-देन इतिहास", herd: "मेरा झुंड", active: "सक्रिय पशु", perf: "दैनिक प्रदर्शन", lastDrop: "अंतिम दूध", yield: "उपज", fat: "औसत वसा", snf: "औसत SNF", pay: "दैनिक भुगतान", carbon: "कार्बन बोनस", alerts: "पशु-चिकित्सक अलर्ट", alertMsg: "गंगा AI विंडो में प्रवेश कर रही है। ब्रीड-कोड लॉक सक्रिय।", climate: "क्लाइमेट प्रदर्शन", methane: "मीथेन बचाई", offset: "कार्बन ऑफ़सेट", reqVet: "पशु चिकित्सक बुलाएँ", close: "बंद", scan: "EID टैग स्कैन", logMilk: "दूध दर्ज करें", yield30: "उपज · 30 दिन", details: "पशु विवरण", signOut: "साइन आउट" },
  kn: { header: "ಪ್ರಾಜೆಕ್ಟ್ ಒನ್ ಬಫೆಲೊ (ಕಾರವಾರ)", overview: "ಮುಖ್ಯ", wallet: "ನನ್ನ ಕ್ಲೈಮೇಟ್ ವಾಲೆಟ್", balance: "ಒಟ್ಟು ಶಿಲ್ಕು", withdraw: "ಬ್ಯಾಂಕಿಗೆ ಕಳುಹಿಸಿ", history: "ವಹಿವಾಟು ಇತಿಹಾಸ", herd: "ನನ್ನ ಹಿಂಡು", active: "ಸಕ್ರಿಯ ಪ್ರಾಣಿಗಳು", perf: "ದೈನಂದಿನ ಪ್ರದರ್ಶನ", lastDrop: "ಕೊನೆಯ ಹಾಲು", yield: "ಇಳುವರಿ", fat: "ಸರಾಸರಿ ಕೊಬ್ಬು", snf: "ಸರಾಸರಿ SNF", pay: "ದೈನಂದಿನ ಪಾವತಿ", carbon: "ಕಾರ್ಬನ್ ಬೋನಸ್", alerts: "ಪಶುವೈದ್ಯ ಎಚ್ಚರಿಕೆಗಳು", alertMsg: "ಗಂಗಾ AI ವಿಂಡೋ ಪ್ರವೇಶಿಸುತ್ತಿದೆ. ಬ್ರೀಡ್-ಕೋಡ್ ಲಾಕ್ ಸಕ್ರಿಯ.", climate: "ಕ್ಲೈಮೇಟ್ ಪ್ರದರ್ಶನ", methane: "ಮೀಥೇನ್ ಉಳಿಸಲಾಗಿದೆ", offset: "ಕಾರ್ಬನ್ ಆಫ್‌ಸೆಟ್", reqVet: "ಪಶುವೈದ್ಯರನ್ನು ಕರೆಸಿ", close: "ಮುಚ್ಚಿ", scan: "EID ಸ್ಕ್ಯಾನ್", logMilk: "ಹಾಲು ದಾಖಲಿಸಿ", yield30: "ಇಳುವರಿ · 30 ದಿನ", details: "ಪ್ರಾಣಿ ವಿವರ", signOut: "ಸೈನ್ ಔಟ್" },
  kok: { header: "प्रोजेक्ट वन बफ़ेलो (कारवार)", overview: "मुखेल", wallet: "म्हजो क्लायमेट वॉलेट", balance: "एकूण शिल्लक", withdraw: "बँकेक धाड", history: "व्यवहार इतिहास", herd: "म्हजो कळप", active: "सक्रीय जनावरां", perf: "दिसाळें प्रदर्शन", lastDrop: "निमाणें दूद", yield: "उत्पादन", fat: "सरासरी फॅट", snf: "सरासरी SNF", pay: "दिसाळें पेमेंट", carbon: "कार्बन बोनस", alerts: "पशुवैद्य सूचना", alertMsg: "गंगा AI विंडोंत प्रवेश करता. ब्रीड-कोड लॉक सक्रीय.", climate: "क्लायमेट प्रदर्शन", methane: "मिथेन वाटायलें", offset: "कार्बन ऑफसेट", reqVet: "पशुवैद्य आपोव", close: "बंद", scan: "EID स्कॅन", logMilk: "दूद नोंद", yield30: "उत्पादन · 30 दीस", details: "जनावर तपशील", signOut: "साइन आवट" },
} as const;
