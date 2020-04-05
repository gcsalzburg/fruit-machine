# Fruit Machine Selector!

Random selection of a friend, colleague or classmate!

> Demo here: https://www.designedbycave.co.uk/fruit-machine/

<img src="https://www.designedbycave.co.uk/fruit-machine/demo_gif.gif" alt="Demo gif">

## How to use

1. Replace the images in the `slot_images/` folder with your own, ensuring that each image is named in sequence `0.jpg`, `1.jpg` etc...

2. Update any of the settings in `index.html` if you wish

   ```javascript
   const title = "FruitMachine!"; // Title on front of machine
   const slot_img_folder = "slot_images/"; // Folder of faces
   const roll_speed = 1.6; // Max speed of scrolling (0.5 is slow, 2 is very fast)
   const roll_duration = 3000; // Time until rolling stops in ms
   ```

Dependencies = **NONE**