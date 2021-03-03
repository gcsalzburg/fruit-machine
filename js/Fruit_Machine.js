class Fruit_Machine{


   constructor(container, img_folder, duration = 3000) {
      this._fm         = container;
      this._duration   = duration;
		this._img_folder = img_folder;
		
		this._reels = [];
		this._last_frame_timestamp = 0; // The last time the loop was run
	
		this._is_rolling = false;
		
		this._audio_electric = new Audio('audio/electric.mp3');
		this._audio_finish   = new Audio('audio/finish.mp3');

      // Set title
      document.getElementById("fm_title").innerHTML = title;

      // Create reels
      this._reels = [
         new Reel(document.getElementById("reel_0"), 'images/arrow.png', this._duration),
         new Reel(document.getElementById("reel_1"), 'images/arrow.png', this._duration),
         new Reel(document.getElementById("reel_2"), 'images/arrow.png', this._duration)
      ];
      
      // Load and build slot images
      this._load_images();

      // Bind this for calls
      // https://cmsdk.com/javascript/39this39-is-undefined-in-class-method-with-requestanimationframe.html
      this.draw = this.draw.bind(this);
      
      // Start game loop
      requestAnimationFrame(this.draw);
   }
   
   // Call a new roll
   roll(speed = 1){

      // Select a target
      let target = this._get_random_int(0,this._reels[0].container.children.length-4);
      console.log(target);

      // Start rolling!
      let i=0;
      this._is_rolling = true;
      for(let reel of this._reels){
         reel.set_target_velocity(speed + Math.random(speed/10) - (speed/5) ); // vary by +/- 5%

         // Stagger start times
         setTimeout(function(){
            reel.start(target);
         },i*200);
         i++;
      }
      this._audio_electric.loop = true;
      this._audio_electric.play();
   }

   // Endless game loop
   draw(timestamp){

      // Update reels
      for (let reel of this._reels) {
         reel.update(timestamp-this._last_frame_timestamp);
      }    

      // Check if finished
      this._check_if_finished();
      
      // Call again
      this._last_frame_timestamp = timestamp;
      requestAnimationFrame(this.draw);
   }

   _check_if_finished(){
      if(this._is_rolling){
         let all_finished = true;
         for (let reel of this._reels) {
            all_finished &= reel.is_ended();
         }
         if(all_finished){
            this._fm.classList.remove("is_running");
            this._audio_electric.pause();
            this._audio_finish.play();
            this._is_rolling = false;
         }
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

   // Gets a random integer,inclusive of min and max
   _get_random_int(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
   }

}