	// Gets a random integer
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Sorts child elements from set
	(function($) {
		$.fn.randomize = function(childElem) {
		  return this.each(function() {
		      var $this = $(this);
		      var elems = $this.children(childElem);

		      elems.sort(function() { return (Math.round(Math.random())-0.5); });  

		      $this.detach(childElem);  

		      for(var i=0; i < elems.length; i++)
		        $this.append(elems[i]);      

		  });    
		}
	})(jQuery);

	// Preloads images
	$.fn.preload = function() {
	    this.each(function(){
	        $('<img/>')[0].src = this;
	    });
	}