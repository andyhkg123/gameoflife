let image = document.querySelector("#image_switch");
let images = [
  "/pic/album/image1.jpg",
  "/pic/album/image2.jpg",
  "/pic/album/image3.jpg",
  "/pic/album/image4.jpg",
  "/pic/album/image5.jpg",
  "/pic/album/image6.jpg",
  "/pic/album/image7.jpg",
  "/pic/album/image8.jpg",
];
setInterval(function () {
  let random = Math.floor(Math.random() * images.length);
  image.src = images[random];
}, 800);
