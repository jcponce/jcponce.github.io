let firstClick = true;

document.addEventListener('DOMContentLoaded', () => {
    
    const audioPlayer = document.getElementById('audioPlayer');
    const overlay = document.getElementById('overlay');
    const startButton = document.getElementById('startButton');
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    //const stopButton = document.getElementById('stopButton');

    startButton.addEventListener('click', () => {
        audioPlayer.play().then(() => {
            overlay.style.display = 'none';
            pauseButton.style.display = 'inline';
        }).catch(error => {
            console.error('Error playing the audio:', error);
        });
        firstClick = false;
    });

    playButton.addEventListener('click', () => {
        audioPlayer.play();
    });

    pauseButton.addEventListener('click', () => {
        audioPlayer.pause();
    });

    stopButton.addEventListener('click', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    });

});