/**
 * Created by freeelk on 05.03.17.
 */


var aviatitle = {
    generate: function (string, blockId) {
        var wordsArray = string.split(' '),
            stringArray = string.split(''),
            sentence = [],
            word = '';

        var block = $('#'+ blockId);

        block.text('');

        wordsArray.forEach(function (currentWord) {
            var wordsArray = currentWord.split('');

            wordsArray.forEach(function (letter) {
                var letterHtml = '<span class="letter-span">' + letter + '</span>';

                word += letterHtml;
            });

            var wordHTML = '<span class="letter-word">' + word + '</span>'

            sentence.push(wordHTML);
            word = '';
        });

        block.append(sentence.join(' '));

        // анимация появления
        var letters = block.find('.letter-span'),
            counter = 0,
            timer,
            duration = 500 / stringArray.length;

        function showLetters() {
            var currentLetter = letters.eq(counter);

            currentLetter.addClass('active');
            counter++;

            if (typeof timer !== 'undefined') {
                clearTimeout(timer);
            }

            timer = setTimeout(showLetters, duration);
        }

        showLetters();

    }
}

module.exports = aviatitle;