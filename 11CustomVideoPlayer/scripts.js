const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const previewImg = player.querySelector('.preview-img');

function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

function skip() {
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  console.log(this.name)
  video[this.name] = this.value;
  console.log(video)
}

function handleProgress() {
  const percent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  console.log(e.offsetX)
  previewImg.style.left = e.offsetX + 'px'
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  console.log(Math.floor(scrubTime))
  showImageAt(Math.floor(scrubTime))
}

function goTo(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

let debounce = function (fn, delay) {
  let timer
  return function () {
    let context = this
    let args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay)
  }
}
const debouncedScrub = debounce(scrub, 500);

video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));
ranges.forEach(range => {
  range.addEventListener('change', handleRangeUpdate)
});

let mousedown = false;

progress.addEventListener('click', goTo);
progress.addEventListener('mousemove', (e) => debouncedScrub(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

function getVideoImage(path, secs, callback) {
  var me = this, video = document.createElement('video');
  video.onloadedmetadata = function () {
    if ('function' === typeof secs) {
      secs = secs(this.duration)
    }
    this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
  }
  video.onseeked = function (e) {
    var canvas = document.createElement('canvas');
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    var img = new Image();
    img.src = canvas.toDataURL();
    callback.call(me, img);
  }
  video.onerror = function (e) {
    callback.call(me, undefined);
  }
  video.src = path;
}

function showImageAt(secs) {
  getVideoImage(
    '/11CustomVideoPlayer/652333414.mp4',
    secs,
    function (img) {
      previewImg.src = img.src
    }
  )
}
