'use strict';

function flipBox(flipBox, authorizateBtn) {
    if (flipBox && authorizateBtn) {
        authorizateBtn.addEventListener('click', function () {
            flipBox.classList.toggle('hover');
        });
    }
}

module.exports = flipBox;