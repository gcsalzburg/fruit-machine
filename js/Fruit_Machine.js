   

function game_loop(timestamp){
   fruit_machine.draw(timestamp);
}
function reel_finished(){
   fruit_machine.check_finished();
}

class Fruit_Machine{

   _reels = [];
   _last_frame_timestamp = 0; // The last time the loop was run

   constructor(container, img_folder, duration = 3000) {
      this._fm         = container;
      this._duration   = duration;
      this._img_folder = img_folder;

       // Set title
      document.getElementById("fm_title").innerHTML = title;

      // Create reels
      this._reels = [
         new Reel(document.getElementById("reel_0"), 'images/arrow.png', this._duration, reel_finished),
         new Reel(document.getElementById("reel_1"), 'images/arrow.png', this._duration, reel_finished),
         new Reel(document.getElementById("reel_2"), 'images/arrow.png', this._duration, reel_finished)
      ];
      
      // Load and build slot images
      this._load_images();
      
      // Start game loop
      requestAnimationFrame(game_loop);
   }
   
   // Call a new roll
   roll(speed = 1){

      // Select a target
      let target = this._get_random_int(0,this._reels[0].container.children.length-4);
      console.log(target);

      // Start rolling!
      let i=0;
      for(let reel of this._reels){
         reel.set_target_velocity(speed + Math.random(speed/10) - (speed/5) ); // vary by +/- 5%

         // Stagger start times
         setTimeout(function(){
            reel.start(target);
         },i*200);
         i++;
      }
   }

   // Endless game loop
   draw(timestamp){

      // Update reels
      for (let reel of this._reels) {
         reel.update(timestamp-this._last_frame_timestamp);
      }    
      
      // Call again
      this._last_frame_timestamp = timestamp;
      requestAnimationFrame(game_loop);
   }

   check_finished(){
      let all_finished = true;
      for (let reel of this._reels) {
         all_finished &= reel.is_rolling();
      }
      if(all_finished){
         document.getElementById("fruit_machine").classList.remove("is_running");
      }
   }

   
   // Preloads the slot images until it finds no more in folder
   _load_images(cnt = 0){
      let img_folder = this._img_folder;
      let fetch_img = new Promise(function(resolve, reject) {
         let img = new Image();
         img.onload = () => resolve(img);
         img.onerror = () => reject(cnt);
         img.src = img_folder + cnt + '.jpg';
      });
      fetch_img.then(
         img => this._load_images(++cnt),
         error => this._display_images(cnt)
      );
   }

   // Writes the slot images into the reels
   _display_images(num_slot_images){

      // Calculate reel sizes
      let img_height = 171;
      let num_images = num_slot_images;
      let total_height = (num_slot_images+2) * img_height;

      for (let reel of this._reels) {

         for(let i=0; i<num_slot_images; i++){
            // Add slot images
            let new_slot = `<span data-index="${i}" style="background-image:url('${this._img_folder}${i}.jpg"></span>`;
            reel.container.insertAdjacentHTML("beforeend",new_slot);
         }

         // Setup image data for this reel
         reel.setup_images(num_images);

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

   // Endless game loop
   _game_loop(timestamp) {

      // Update reels
      for (let reel of this._reels) {
         reel.update(timestamp-this._last_frame_timestamp);
      }    
      
      // Call again
      this._last_frame_timestamp = timestamp;
      requestAnimationFrame(game_loop);
   }

   // Gets a random integer,inclusive of min and max
   _get_random_int(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
   }

}