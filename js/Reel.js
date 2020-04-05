// Reel object
class Reel{

   _img_height        = 0;
   _total_height      = 0;
   _num_images        = 0;

   _velocity          = 0;
   _target_velocity   = 0;
   _acceleration      = 0.1;
   
   _is_rolling        = false;
   _is_ended          = false;
   _start_time        = 0;
   
   _slot_orders       = [];
   _current_slot      = 0;
   _target_slot       = 0;

   constructor(container, cover, duration) {
      this.container         = container;
      this.cover             = cover;
      this._max_rolling_time = duration;
   }

   setup_images(num_images = this._num_images){

      this._shuffle_slots();

      this._num_images   = num_images;
      this._img_height   = this.container.children[0].clientHeight;
      this._total_height = (this._num_images+2) * this._img_height;
      
      // Now save the ordering as it is
      for(let slot of this.container.children){
         this._slot_orders.push(slot.dataset.index);
      }
   }

   start(target){
      this._is_ended = false;
      this._is_rolling = true;
      this._target_slot = target;
      this._start_time = performance.now();
      this.container.classList.remove("shake");
   }

   stop(){
      this._is_rolling = false;
      this._is_ended = true;
      this._velocity = 0;
   }

   is_ended(){
      return this._is_ended;
   }

   set_target_velocity(v){
      this._target_velocity = v;
   }

   update(delta_t){
      if(this._is_rolling){
         this._update_velocity();
         this._update_position(delta_t);
         this._check_approach();
      }
   }

   _update_velocity(){
      if(this._target_velocity > this._velocity){
         this._velocity = Math.min(this._target_velocity, this._velocity+this._acceleration);
      }
   }

   _update_position(delta_t){
      // Calculate new position
      let new_top = (parseFloat(this.container.style.top) + (this._velocity*delta_t));

      // If we are too close to the top, jump down
      while(new_top > -this._img_height){
         new_top -= (this._total_height-this._img_height-this._img_height);
      }
      // Set new position
      this.container.style.top = new_top+'px';

      // Calculate which slot is in view
      this._current_slot = this._slot_orders[Math.floor(-new_top/this._img_height)%this._num_images];
   }

   _check_approach(){
      if( (performance.now() > this._start_time+this._max_rolling_time) && (this._current_slot == this._target_slot) ){
         this.stop();
         const curr_top = parseFloat(this.container.style.top);
         this.container.style.top = (curr_top - curr_top%this._img_height) + 'px';
         this.container.classList.add("shake");
      }
   }

   // Shuffle the order of the child nodes of a selector
   _shuffle_slots(){
      for (let i = this.container.children.length; i >= 0; i--) {
         this.container.appendChild(this.container.children[Math.random() * i | 0]);
      }
   }
}