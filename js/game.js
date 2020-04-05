 // Creates the initial fruit machine setup
 function create_fruit_machine(){

   // Set title
   document.getElementById("fm_title").innerHTML = title;
   
   // Preload gifs that are not yet shown
   // TODO

   // Load and display slot images
   load_images();
}


// Preloads the slot images until it finds no more in folder
function load_images(cnt = 0){
   let fetch_img = new Promise(function(resolve, reject) {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(cnt);
      img.src = slot_img_folder + cnt + '.jpg';
   });
   fetch_img.then(
      img => load_images(++cnt),
      error => display_images(cnt)
   );
}

// Writes the slot images into the reels
function display_images(num_slot_images){

   // Save top level variable
   num_images = num_slot_images;
   total_height = (num_slot_images+2) * img_height;

   for (let reel of reels) {
      for(let i=0; i<num_slot_images; i++){
         // Add slot images
         let new_slot = `<span data-index="${i}" style="background-image:url('${slot_img_folder}${i}.jpg"></span>`;
         reel.container.insertAdjacentHTML("beforeend",new_slot);
      }

      // Shuffle reels
      shuffle_nodes(reel.container);
      reel.save_ordering();

      // Append copy of first two node to end of list (for smooth scrolling)
      reel.container.append(reel.container.childNodes[0].cloneNode(true)); 
      reel.container.append(reel.container.childNodes[1].cloneNode(true)); 

      // Add cover letter for start
      reel.container.insertAdjacentHTML("beforeend",`<span class="letter" style="background-image:url('${reel.cover}"></span>`);
      
      // Set starting point for rolling
      reel.roll_pos = -total_height;
      reel.container.style.top = reel.roll_pos+'px';
   }
}

// Shuffle the order of the child nodes of a selector
function shuffle_nodes(parent_selector){
   for (let i = parent_selector.children.length; i >= 0; i--) {
      parent_selector.appendChild(parent_selector.children[Math.random() * i | 0]);
   }
}

// Rolls
function roll(speed = 0.8){

   // Select a target
   let target = get_random_int(0,num_images);
   console.log(target);

   // Start rolling!
   let i=0;
   for(let reel of reels){
      reel.set_target_velocity(speed + Math.random(speed/10) - (speed/5) ); // vary by +/- 5%

      // Stagger start times
      setTimeout(function(){
         reel.start();
      },i*200);
      i++;
   }
}

// Endless game loop
function game_loop(timestamp) {

   // Update reels
   for (let reel of reels) {
      reel.update(timestamp-last_frame_timestamp);
   }    
   
   // Call again
   last_frame_timestamp = timestamp;
   requestAnimationFrame(game_loop);
}

// Gets a random integer
function get_random_int(min, max) {
   return Math.floor(Math.random() * (max - min + 1)) + min;
}