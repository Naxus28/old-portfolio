$(document).foundation();

$(function() {

    var image = $('.slider').data('images');
    console.log(image);

    //cache dom elements and properties to be used in functions below
    var nav = $('.main_nav');
    var header_height = $('.main_header').height();
    var portfolio = $('#portfolio');
    var window_width = $(window).width();
    var no_animate = false;
    var scroll = true;
    var contact_click = false;
    var trigger_animation = true;
    var scroll_up_from_contact = true;


    $('.slider').carousel();


    /******************AJAX CALL TO EMAIL.PHP********************/
    $('form.ajax').on('submit', function(){
        var that = $(this),
            url = that.attr('action'), //get url for ajax call
            type = that.attr('method'), //get method for ajax call
            data = {} //initialize data object to store ajax response


        //find all input fields that have the name attribute
        that.find('[name]').each(function(){ 
            var that = $(this),
                name = that.attr('name'), //get the name attribute value
                value = that.val(); //get the input value
                data[name] = value; //build the data obj i.e. {'name' : 'Gabriel', 'email' : 'gabriel@gabriel.com', 'subject' : 'hello'};
        });

        //make the ajax call
        $.ajax({
            url: url, //call url
            type: type, //send form method
            data: data, //send data object
            success: function(response){
                var obj = $.parseJSON(response); //parse JSON sent by PHP script -- using json_encode on the PHP script

                //check if e-mail was sent and show success alert
                if(obj['success'] == true){

                    //animate alert div to display on HTML
                    $('div.success').css('display', 'block').animate({opacity: 1}, 500);
                    
                    //append visitor name to the alert
                    $('<span>'+obj['name']+'</span>').insertAfter('span.add_name_after');

                    //hide the fail alert--in case user missed a field in a previous form submission
                    $('div.fail').css('display', 'none');

                    //empty input fields, except the send button
                    $('form.ajax').find('[name]').each(function(){
                        if($(this).val() != 'Enviar'){
                            $(this).val('');
                        }
                    });

                }

                //if form validation fails on email.php
                else if(obj['success'] == false){

                    //animate alert div to display on HTML
                    $('div.fail').css('display', 'block').animate({opacity: 1}, 500);

                    //append visitor name to the alert
                    $('<span>'+obj['name']+'</span>').insertAfter('span.fill_out_form');
                }

                //if e-mail is not sent for any other reason and obj['success'] is not set
                else {
                    $('<div data-alert class="failed_email alert-box alert radius">There was an error and your message could not be sent. Please try again later or use a different form of contact. Thank you for your patience.<a href="#" class="close">&times;</a></div>').insertBefore('form.ajax');
                    $('div.success').css('display', 'none');
                    $('div.fail').css('display', 'none');
                }
            }
        })
        return false;
    });

    //Alert closes on "X" click
    $('.close').on('click', function(e){
        e.preventDefault();
        $(this).parent('.alert').animate({opacity: 0}, 500);
    });


    //******************SLIDE TOGGLE NAV MENU ON SMALL DEVICES********************
    $('i.menu').on('click', function(){
        $('header ul.row').slideToggle();
    });

    //******************SLIDE TOGGLE "SHOW MORE--SHOW LESS" ON PORTFOLIO SECTION********************
    $('.load_more').on('click', function(){
        var text = $(this).text();
        // console.log(text);
        $('.hide_works').slideToggle();
        if(text=="show more"){
            $(this).text('show less');

            $('html,body').animate({scrollTop: $('.hide_works').offset().top - 85}, 1500, 'swing'); 
        }
        else{
            $(this).text('show more');
            $('html,body').animate({scrollTop: $('#portfolio').offset().top - 100}, 1500, 'swing'); 
        }
    })

    //******************OVERLAY ICONS********************
    //resize document icon and link icon on smaller screens
    //necessary because these are icon fonts, not images--could possibly use css pseudo selectors to set new font as well
    $('.icons').each(function(){   
        if( window_width <= 1144 && window_width > 640 ){
            $(this).find('span').css('padding', '0px');
            $(this).find('span a i').removeClass('fa-5x').addClass('fa-3x'); 
                if( window_width < 772 ){
                    $(this).find('span a i:first-child').css('marginTop', '10px');   
                }   
        }
        else if( window_width > 1144 || window_width < 640){
            $(this).find('span').css('padding', '15px');
            $(this).find('span a i').removeClass('fa-3x').addClass('fa-5x');    
        } 
    });

    //******************STICKY NAV********************
    //sticky nav functionality
    $(window).scroll(function()
    {
        if( $(this).scrollTop()  > header_height + 30 )
        {
            nav.addClass('scroll');
        }
        else
        {
            nav.removeClass('scroll');
            portfolio.removeClass('scroll_nav');  
        }
    });

    //sticky nav functionality on resize (same as above but works on resize)
    $(window).on('resize', function(){
        header_height = $('.main_header').height();
        window_width = $(window).width();

        if( window_width > 641 ){
            $('header ul.row').css('display','block');
        }
        else{
            $('header ul.row').css('display','none');
        }

        //on window resize, resize document icon and link icon on smaller screens
        //same functionality as above (overlay icons); this code makes it work if user resizes the browser and hovers over the image without refreshing screen
        $('.icons').each(function(){
            if( window_width <= 1144 && window_width > 640 ){
                $(this).find('span').css('padding', '0px');
                $(this).find('span a i').removeClass('fa-5x').addClass('fa-3x'); 
                if( window_width < 772 ){
                    $(this).find('span a i:first-child').css('marginBottom', '10px');   
                }   
            }
            else if( window_width > 1144 || window_width < 640 ){
                $(this).find('span').css('padding', '15px');
                $(this).find('span a i').removeClass('fa-3x').addClass('fa-5x'); 
            }
        });

        //sticky nav functionality on resize--makes functionality work when user resizes the window but doesn't refresh the page
       $(this).scroll(function()
       {
           if( $(this).scrollTop() > header_height + 30 )
           {
               nav.addClass('scroll');
           }
           else
           {
               nav.removeClass('scroll');
               portfolio.removeClass('scroll_nav');  
           }
       });

    });

    //******************PAGE SCROLL ON MENU ITEM CLICK********************
    //nav scroll functionality
    $('.main_nav li').each(function(){
        $(this).click(function(){

            //get the data string(which matches the div ids to which we scroll)
            var id = $(this).data('id');

            //cache variable if contact nav li is clicked--will be used to not allow triggering skills animation when contact is clicked before user visits the skills section
            if(id=="#contact")
            {
                no_animate = true;
            }
            // if(no_animate == true && (id=="#portfolio" || id=="#about")){
            //     scroll_up_from_contact = false;
            // }
            // if(id=="#skills"){
            //     scroll_up_from_contact = true;
            // }

            //scroll top using $(this).data('id').offset() -- $(this).data('id') matches the id of the div we want to scroll to
            if( window_width <= 640 ){
                    // test if it is small tablet or mobile size--menu items are stacked and the scroll top has to be greater than desktop view
                $('html,body').animate({scrollTop: $( $(this).data('id') ).offset().top}, 1500, 'swing');

                $('header ul.row').slideUp('slow');
            }  
            else{
                //desktop and tablet view
                $('html,body').animate({scrollTop: $( $(this).data('id') ).offset().top - 96}, 1500, 'swing'); 
            }
        });
    });
    
    //******************TAB********************
    //tab functionality
    $(".web_design li").on('click',function() {

        if(!$(this).hasClass('current'))
    	{
    		if($(this).hasClass('web_dev'))
    		{
    			$(this).css('padding-left','20px');
    			$(this).css('text-decoration', 'none');
    			if($('.web_works').hasClass('hide'))
    			{
    				$('.design_works').addClass('hide').css('display','none');
    				$('.web_works').removeClass('hide').hide().fadeIn('fast');
    			}
    		}//closes if hasClass('web_dev')
    		else
    		{
    			$(this).siblings('li').css('padding-left','0px');
    			$(this).css('text-decoration', 'none');
    			$('.web_works').addClass('hide').css('display','none');
    			$('.design_works').removeClass('hide').hide().fadeIn('fast');
    		}
    		$(this).addClass('current');
    		$(this).siblings('li').removeClass('current');
    	}//closes first if statement -- hasClass('current')
    });//closes on click function

	//hover functionality for underline when li is not selected
	$(".web_design li").hover(function(){
		//if li is not selected, underline on hover to show it is clickable
        if(!$(this).hasClass('current'))
		{
			$(this).css('text-decoration', 'underline');
		}
	},
	function(){
        //clears the underline on mouseout
		if($(this).hasClass('current') || !$(this).hasClass('current') )
		{
			$(this).css('text-decoration', 'none');
		}
	});

    //******************SKILLS ANIMATE********************
    //animate functionality
    $(window).scroll(function(){
        var skills_top = $('.skills_top').offset().top;
        var contact_top = $('#contact').offset().top;
        var window_top = $(window).scrollTop()+100;
    

        //IF ELSE WHEN CONTACT NAV LI IS CLICKED--BECAUSE THE CONTACT SECTION COMES AFTER THE SKILLS SECTION, WE DON'T WANT TO TRIGGER THE SKILLS ANIMATION IF USER OPTS TO CLICK THE CONTACT LI AND SCROLL TO THE CONTACT SECTION BEFORE SCROLLING TO THE SKILLS SECTION OR BEFORE CLICKING "SKILLS" ON THE MENU AND SCROLLING TO THE SKILLS SECTION
        //var no_animate is set to true when contact nav is clicked
        if(no_animate==true && (contact_top <= window_top )){
            trigger_animation = false;//sets trigger animation to false--doesn't allow animations
            no_animate = false;//sets no_animation to false--allows animation
            //RESULT: SETS VARIABLES TO NOT ALLOW ANIMATION
        }

        //this else will trigger only if:
        //1) no_animate = false, which is the default value or is set on the if above, when the contact nav li is clicked
        //2) screen top is within the top of the skills section and 100px below it
        else if(no_animate==false && (skills_top <= window_top && skills_top + 100 >= window_top)){
            trigger_animation = true;//sets animation to true
            no_animate = false;//sets no no_animation to false
            //RESULT: SETS VARIABLES TO ALLOW ANIMATION
        }

        //checks conditions to trigger skills animation  
        if( skills_top <= window_top && scroll==true && no_animate==false && trigger_animation==true)
         // && scroll_up_from_contact==true
        {   
            // if(window_width<480){
            //     $('html,body').animate({scrollTop: $('.javascript').offset().top}, 2500, 'swing'); 
            // }
            // else if(window_width==480){
            //     $('html,body').animate({scrollTop: $('.javascript').offset().top+140}, 2500, 'swing');
            // }
            // else if(window_width==600){
            //     $('html,body').animate({scrollTop: $('.skills').offset().top}, 2500, 'swing');
            // }
            // else if( window_width>=760 && window_width<=780){
            //     $('html,body').animate({scrollTop: $('.skills').offset().top-175}, 2500, 'swing');
            // }
            // else if(window_width==800){
            //     $('html,body').animate({scrollTop: $('.skills').offset().top+190}, 2500, 'swing');
            // }
            // else if(window_width==1024){
            //     $('html,body').animate({scrollTop: $('.skills').offset().top+50}, 2500, 'swing');
            // }
            // else{
            //     $('html,body').animate({scrollTop: $('.javascript').offset().top-120}, 2500, 'swing');
            // }

            $('.animate').each(function(){
                var percent = $(this).data('percent');
                $(this).find('span').animate({opacity: '1'}, 1800);
                $(this).animate({width: percent, opacity: '1'}, 1800);
            });  

            //when false, animation on scroll will stop triggering--this means it is triggered only once unless user refreshes page
            scroll = false;
        }
    });
    
});
