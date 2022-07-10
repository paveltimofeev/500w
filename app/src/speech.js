async function play (text, lang = 'es', pitch = 1, rate = 0.8) {

    return new Promise((res) => {

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            res(false);
            return;
        }

        const speech = new SpeechSynthesisUtterance();

        speech.text = text;
        speech.lang = lang;
        speech.pitch = pitch;
        speech.rate = rate;
        // speech.voice = voice;

        speech.onend = () => {
            res(true);
        };

        window.speechSynthesis.speak(speech);
    });
}


export default play;
