//CUSTOM MADE JQUERY CAROUSEL PLUGIN
$(document).ready(function()
{
	$.fn.carousel = function()
	{
		$(this).each(function()
		{
			//get images array for each carousel
			var images = $(this).data('images');
 
			//set the initial image for each container
			var initialImage = $(this).find('.first_image').attr('src', images[0]);
 
			//get each carousel's 'direction controllers' (arrows, buttons, etc)
			var directions = $(this).find('.direction');
			
			//carousel index
			var index = 0;
 
			//loop through 'direction controllers' in each div (arrows)
			directions.each(function()
			{
				//on click event that triggers the carousel for $(this) div
				$(this).on('click',function()
				{
	    				//get the arrow that was clicked
	    				var direction = $(this).data('direction');
	    			
	    				//test if user clicked next or previous
	    				if( direction === "next" )
	    				{
	    					index++;
	    				
	    					//reset the index to send carousel back to the first picture
	    					if( index >=  images.length )
	    				{
	    					index = 0;
	    				}
 
	    				//change the image on click -->(next)
	    				var img = $(this).closest('.slider').find('.first_image').attr('src', images[index]);
	    				}
	    				else if ( direction === "previous" )
	    				{
	    					index--;
 
	    					//reset the index to send carousel to the last picture
	    					if( index < 0 )
	    					{
	    						index = images.length-1;
	    					}
 
	    					//change the image on click <--(previous)
	    					var img = $(this).closest('.slider').find('.first_image').attr('src', images[index]);
	    				}
				});
			});
		});	
	}
});