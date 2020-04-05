// Reel object
class Reel{
   constructor(container, cover, num_images) {
      this.container         = container;
      this.cover             = cover;
      this.num_images        = num_images;
      
      this.img_height        = 0;
      this.total_height      = 0;

      this.velocity          = 0;
      this.target_velocity   = 0;

      this.is_approaching    = false;
      this.approach_velocity = 0.1; // slowly bring the final one into view
      this.approach_flag = false;

      this.acceleration      = 0.1;
      this.deceleration      = 0.5;

      this.is_rolling        = false;
      this.start_time        = 0;

      this.slot_orders       = [];
      this.current_slot      = 0;
      this.target_slot       = 0;

      this.max_rolling_time  = 3000;
   }

   save_ordering(){
      for(let slot of this.container.children){
         this.slot_orders.push(slot.dataset.index);
      }
      this.img_height = this.container.children[0].clientHeight;
      this.total_height = (this.num_images+2) * this.img_height;
   }

   start(target){
      this.is_rolling = true;
      this.target_slot = target;
      this.start_time = performance.now();
   }

   stop(){
      this.is_rolling = false;
      this.velocity = 0;
      this.container.classList.add("shake");
   }

   set_target_velocity(v){
      this.target_velocity = v;
   }

   update(delta_t){
      if(this.is_rolling){
         this.update_velocity();
         this.update_position(delta_t);
         this.check_approach();
      }
   }

   update_velocity(){
      if(this.target_velocity > this.velocity){
         this.velocity = Math.min(this.target_velocity, this.velocity+this.acceleration);
      }else if(this.target_velocity < this.velocity){
         this.velocity = Math.max(this.target_velocity, this.velocity-this.deceleration);
         if(this.velocity == 0){
            this.is_rolling = 0;
         }
      }
   }

   update_position(delta_t){
      // Calculate new position
      let new_top = (parseFloat(this.container.style.top) + (this.velocity*delta_t));

      // If we are too close to the top, jump down
      while(new_top > -this.img_height){
         new_top -= (this.total_height-this.img_height-this.img_height);
      }
      // Set new position
      this.container.style.top = new_top+'px';

      // Calculate which slot is in view
      this.current_slot = this.slot_orders[Math.floor(-new_top/this.img_height)%this.num_images];
   }

   check_approach(){
      if( (performance.now() > this.start_time+this.max_rolling_time) && (this.current_slot == this.target_slot) ){
         this.stop();
         const curr_top = parseFloat(this.container.style.top);
         this.container.style.top = (curr_top - curr_top%this.img_height) + 'px';
      }
   }
}