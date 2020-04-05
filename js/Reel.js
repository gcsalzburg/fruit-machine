// Reel object
class Reel{
   constructor(container, cover) {
      this.container         = container;
      this.cover             = cover;

      this.velocity          = 0;
      this.target_velocity   = 0;
      this.approach_velocity = 0.1; // slowly bring the final one into view
      this.acceleration      = 0.02;
      this.deceleration      = 0.005;

      this.is_rolling        = false;
      this.start_time        = 0;

      this.slot_orders       = [];
      this.current_slot      = 0;

      this.max_rolling_time  = 5000;
   }

   save_ordering(){
      for(let slot of this.container.children){
         this.slot_orders.push(slot.dataset.index);
      }
   }

   start(){
      this.is_rolling = true;
      this.start_time = performance.now();
   }

   set_target_velocity(v){
      this.target_velocity = v;
   }

   update(delta_t){
      if(this.is_rolling){
         this.update_velocity();
         this.update_position(delta_t);
         this.check_for_end();
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
      while(new_top > -img_height){
         new_top -= (total_height-img_height-img_height);
      }
      // Set new position
      this.container.style.top = new_top+'px';

      // Calculate which slot is in view
      this.current_slot = this.slot_orders[Math.floor(-new_top/img_height)%num_images];
   }

   check_for_end(){
      if(performance.now() > this.start_time+this.max_rolling_time){
         this.set_target_velocity(this.approach_velocity);
      }
   }
}