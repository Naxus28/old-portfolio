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
$(document).foundation();

$(function() {

    var image = $('.slider').data('images');

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
                if (obj['success'] == true) {

                    //animate alert div to display on HTML
                    $('div.success').css('display', 'block').animate({opacity: 1}, 500);
                    
                    //append visitor name to the alert
                    $('<span>'+obj['name']+'</span>').insertAfter('span.add_name_after');

                    //hide the fail alert--in case user missed a field in a previous form submission
                    $('div.fail').css('display', 'none');

                    //empty input fields, except the send button
                    $('form.ajax').find('[name]').each(function(){
                        if ($(this).val() != 'Enviar') {
                            $(this).val('');
                        }
                    });

                }

                //if form validation fails on email.php
                else if (obj['success'] == false){

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
        });

        return false;
    });

    //Alert closes on "X" click
    $('.close').on('click', function(e) {
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
        if (text=="show more") {
            $(this).text('show less');
            $('html,body').animate({scrollTop: $('.hide_works').offset().top - 85}, 1500, 'swing'); 
        } else {
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
    $(window).scroll(function() {
        if( $(this).scrollTop()  > header_height + 50 ) {
            nav.addClass('scroll');
        } else {
            nav.removeClass('scroll');
            portfolio.removeClass('scroll_nav');  
        }
    });

    //sticky nav functionality on resize (same as above but works on resize)
    $(window).on('resize', function() {
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
            if (window_width <= 1144 && window_width > 640 ) {
                $(this).find('span').css('padding', '0px');
                $(this).find('span a i').removeClass('fa-5x').addClass('fa-3x'); 
                
                if ( window_width < 772 ) {
                    $(this).find('span a i:first-child').css('marginBottom', '10px');   
                }   
            }
            else if( window_width > 1144 || window_width < 640 ){
                $(this).find('span').css('padding', '15px');
                $(this).find('span a i').removeClass('fa-3x').addClass('fa-5x'); 
            }
        });

        //sticky nav functionality on resize--makes functionality work when user resizes the window but doesn't refresh the page
       $(this).scroll(function() {
           if( $(this).scrollTop() > header_height + 30 ) {
               nav.addClass('scroll');
           } else {
               nav.removeClass('scroll');
               portfolio.removeClass('scroll_nav');  
           }
       });

    });

    //******************PAGE SCROLL ON MENU ITEM CLICK********************
    //nav scroll functionality
    $('.main_nav li').each(function(){
        $(this).click(function() {

            //get the data string(which matches the div ids to which we scroll)
            var id = $(this).data('id');

            //cache variable if contact nav li is clicked--will be used to not allow triggering skills animation when contact is clicked before user visits the skills section
            if (id=="#contact") {
                no_animate = true;
            }

            //scroll top using $(this).data('id').offset() -- $(this).data('id') matches the id of the div we want to scroll to
            if (window_width <= 640 ) {
                    // test if it is small tablet or mobile size--menu items are stacked and the scroll top has to be greater than desktop view
                $('html, body').animate({scrollTop: $( $(this).data('id') ).offset().top}, 1500, 'swing');

                $('header ul.row').slideUp('slow');
            }  else {
                //desktop and tablet view
                var offsetTop = id === '#portfolio' ? -50 : 56;  

                $('html, body').animate({scrollTop: $( $(this).data('id') ).offset().top - offsetTop}, 1500, 'swing'); 
            }
        });
    });
    
    //******************TAB********************
    //tab functionality
    $(".web_design li").on('click',function() {

        if (!$(this).hasClass('current')) {
    		
            if($(this).hasClass('web_dev')) {
    			$(this).css('padding-left','20px');
    			$(this).css('text-decoration', 'none');
    			
                if($('.web_works').hasClass('hide')) {
    				$('.design_works').addClass('hide').css('display','none');
    				$('.web_works').removeClass('hide').hide().fadeIn('fast');
    			}
    		} else {
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
        if (!$(this).hasClass('current')) {
			$(this).css('text-decoration', 'underline');
		}
	},
	function(){
        //clears the underline on mouseout
		if($(this).hasClass('current') || !$(this).hasClass('current') ) {
			$(this).css('text-decoration', 'none');
		}
	});

    //******************SKILLS ANIMATE********************
    //animate functionality
    $(window).scroll( function() {
        var skills_top = $('.skills_top').offset().top;
        var contact_top = $('#contact').offset().top;
        var window_top = $(window).scrollTop()+100;
    

        //IF ELSE WHEN CONTACT NAV LI IS CLICKED--BECAUSE THE CONTACT SECTION COMES AFTER THE SKILLS SECTION, WE DON'T WANT TO TRIGGER THE SKILLS ANIMATION IF USER OPTS TO CLICK THE CONTACT LI AND SCROLL TO THE CONTACT SECTION BEFORE SCROLLING TO THE SKILLS SECTION OR BEFORE CLICKING "SKILLS" ON THE MENU AND SCROLLING TO THE SKILLS SECTION
        //var no_animate is set to true when contact nav is clicked
        if (no_animate==true && (contact_top <= window_top )){
            trigger_animation = false;//sets trigger animation to false--doesn't allow animations
            no_animate = false;//sets no_animation to false--allows animation
            //RESULT: SETS VARIABLES TO NOT ALLOW ANIMATION
        }

        //this else will trigger only if:
        //1) no_animate = false, which is the default value or is set on the if above, when the contact nav li is clicked
        //2) screen top is within the top of the skills section and 100px below it
        else if (no_animate==false && (skills_top <= window_top && skills_top + 100 >= window_top)){
            trigger_animation = true;//sets animation to true
            no_animate = false;//sets no no_animation to false
            //RESULT: SETS VARIABLES TO ALLOW ANIMATION
        }

        //checks conditions to trigger skills animation  
        if ( skills_top <= window_top && scroll==true && no_animate==false && trigger_animation==true) {   
            $('.animate').each(function() {
                var percent = $(this).data('percent');
                $(this).find('span').animate({opacity: '1'}, 1800);
                $(this).animate({width: percent, opacity: '1'}, 1800);
            });  

            //when false, animation on scroll will stop triggering--this means it is triggered only once unless user refreshes page
            scroll = false;
        }
    });

    //******************CALL TO STELLAR PLUGIN(all options here for possible configuration)********************
     $.stellar({
          // Set scrolling to be in either one or both directions
          horizontalScrolling: true,
          verticalScrolling: true,

          // Set the global alignment offsets
          horizontalOffset: 0,
          verticalOffset: -100,

          // Refreshes parallax content on window load and resize
          responsive: false,

          // Select which property is used to calculate scroll.
          // Choose 'scroll', 'position', 'margin' or 'transform',
          // or write your own 'scrollProperty' plugin.
          scrollProperty: 'scroll',

          // Select which property is used to position elements.
          // Choose between 'position' or 'transform',
          // or write your own 'positionProperty' plugin.
          positionProperty: 'position',

          // Enable or disable the two types of parallax
          parallaxBackgrounds: true,
          parallaxElements: true,

          // Hide parallax elements that move outside the viewport
          hideDistantElements: true,

          // Customise how elements are shown and hidden
          hideElement: function($elem) { $elem.hide(); },
          showElement: function($elem) { $elem.show(); }
     });
    
});

/*! Stellar.js v0.6.2 | Copyright 2014, Mark Dalgleish | http://markdalgleish.com/projects/stellar.js | http://markdalgleish.mit-license.org */
!function(a,b,c,d){function e(b,c){this.element=b,this.options=a.extend({},g,c),this._defaults=g,this._name=f,this.init()}var f="stellar",g={scrollProperty:"scroll",positionProperty:"position",horizontalScrolling:!0,verticalScrolling:!0,horizontalOffset:0,verticalOffset:0,responsive:!1,parallaxBackgrounds:!0,parallaxElements:!0,hideDistantElements:!0,hideElement:function(a){a.hide()},showElement:function(a){a.show()}},h={scroll:{getLeft:function(a){return a.scrollLeft()},setLeft:function(a,b){a.scrollLeft(b)},getTop:function(a){return a.scrollTop()},setTop:function(a,b){a.scrollTop(b)}},position:{getLeft:function(a){return-1*parseInt(a.css("left"),10)},getTop:function(a){return-1*parseInt(a.css("top"),10)}},margin:{getLeft:function(a){return-1*parseInt(a.css("margin-left"),10)},getTop:function(a){return-1*parseInt(a.css("margin-top"),10)}},transform:{getLeft:function(a){var b=getComputedStyle(a[0])[k];return"none"!==b?-1*parseInt(b.match(/(-?[0-9]+)/g)[4],10):0},getTop:function(a){var b=getComputedStyle(a[0])[k];return"none"!==b?-1*parseInt(b.match(/(-?[0-9]+)/g)[5],10):0}}},i={position:{setLeft:function(a,b){a.css("left",b)},setTop:function(a,b){a.css("top",b)}},transform:{setPosition:function(a,b,c,d,e){a[0].style[k]="translate3d("+(b-c)+"px, "+(d-e)+"px, 0)"}}},j=function(){var b,c=/^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,d=a("script")[0].style,e="";for(b in d)if(c.test(b)){e=b.match(c)[0];break}return"WebkitOpacity"in d&&(e="Webkit"),"KhtmlOpacity"in d&&(e="Khtml"),function(a){return e+(e.length>0?a.charAt(0).toUpperCase()+a.slice(1):a)}}(),k=j("transform"),l=a("<div />",{style:"background:#fff"}).css("background-position-x")!==d,m=l?function(a,b,c){a.css({"background-position-x":b,"background-position-y":c})}:function(a,b,c){a.css("background-position",b+" "+c)},n=l?function(a){return[a.css("background-position-x"),a.css("background-position-y")]}:function(a){return a.css("background-position").split(" ")},o=b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame||b.oRequestAnimationFrame||b.msRequestAnimationFrame||function(a){setTimeout(a,1e3/60)};e.prototype={init:function(){this.options.name=f+"_"+Math.floor(1e9*Math.random()),this._defineElements(),this._defineGetters(),this._defineSetters(),this._handleWindowLoadAndResize(),this._detectViewport(),this.refresh({firstLoad:!0}),"scroll"===this.options.scrollProperty?this._handleScrollEvent():this._startAnimationLoop()},_defineElements:function(){this.element===c.body&&(this.element=b),this.$scrollElement=a(this.element),this.$element=this.element===b?a("body"):this.$scrollElement,this.$viewportElement=this.options.viewportElement!==d?a(this.options.viewportElement):this.$scrollElement[0]===b||"scroll"===this.options.scrollProperty?this.$scrollElement:this.$scrollElement.parent()},_defineGetters:function(){var a=this,b=h[a.options.scrollProperty];this._getScrollLeft=function(){return b.getLeft(a.$scrollElement)},this._getScrollTop=function(){return b.getTop(a.$scrollElement)}},_defineSetters:function(){var b=this,c=h[b.options.scrollProperty],d=i[b.options.positionProperty],e=c.setLeft,f=c.setTop;this._setScrollLeft="function"==typeof e?function(a){e(b.$scrollElement,a)}:a.noop,this._setScrollTop="function"==typeof f?function(a){f(b.$scrollElement,a)}:a.noop,this._setPosition=d.setPosition||function(a,c,e,f,g){b.options.horizontalScrolling&&d.setLeft(a,c,e),b.options.verticalScrolling&&d.setTop(a,f,g)}},_handleWindowLoadAndResize:function(){var c=this,d=a(b);c.options.responsive&&d.bind("load."+this.name,function(){c.refresh()}),d.bind("resize."+this.name,function(){c._detectViewport(),c.options.responsive&&c.refresh()})},refresh:function(c){var d=this,e=d._getScrollLeft(),f=d._getScrollTop();c&&c.firstLoad||this._reset(),this._setScrollLeft(0),this._setScrollTop(0),this._setOffsets(),this._findParticles(),this._findBackgrounds(),c&&c.firstLoad&&/WebKit/.test(navigator.userAgent)&&a(b).load(function(){var a=d._getScrollLeft(),b=d._getScrollTop();d._setScrollLeft(a+1),d._setScrollTop(b+1),d._setScrollLeft(a),d._setScrollTop(b)}),this._setScrollLeft(e),this._setScrollTop(f)},_detectViewport:function(){var a=this.$viewportElement.offset(),b=null!==a&&a!==d;this.viewportWidth=this.$viewportElement.width(),this.viewportHeight=this.$viewportElement.height(),this.viewportOffsetTop=b?a.top:0,this.viewportOffsetLeft=b?a.left:0},_findParticles:function(){{var b=this;this._getScrollLeft(),this._getScrollTop()}if(this.particles!==d)for(var c=this.particles.length-1;c>=0;c--)this.particles[c].$element.data("stellar-elementIsActive",d);this.particles=[],this.options.parallaxElements&&this.$element.find("[data-stellar-ratio]").each(function(){var c,e,f,g,h,i,j,k,l,m=a(this),n=0,o=0,p=0,q=0;if(m.data("stellar-elementIsActive")){if(m.data("stellar-elementIsActive")!==this)return}else m.data("stellar-elementIsActive",this);b.options.showElement(m),m.data("stellar-startingLeft")?(m.css("left",m.data("stellar-startingLeft")),m.css("top",m.data("stellar-startingTop"))):(m.data("stellar-startingLeft",m.css("left")),m.data("stellar-startingTop",m.css("top"))),f=m.position().left,g=m.position().top,h="auto"===m.css("margin-left")?0:parseInt(m.css("margin-left"),10),i="auto"===m.css("margin-top")?0:parseInt(m.css("margin-top"),10),k=m.offset().left-h,l=m.offset().top-i,m.parents().each(function(){var b=a(this);return b.data("stellar-offset-parent")===!0?(n=p,o=q,j=b,!1):(p+=b.position().left,void(q+=b.position().top))}),c=m.data("stellar-horizontal-offset")!==d?m.data("stellar-horizontal-offset"):j!==d&&j.data("stellar-horizontal-offset")!==d?j.data("stellar-horizontal-offset"):b.horizontalOffset,e=m.data("stellar-vertical-offset")!==d?m.data("stellar-vertical-offset"):j!==d&&j.data("stellar-vertical-offset")!==d?j.data("stellar-vertical-offset"):b.verticalOffset,b.particles.push({$element:m,$offsetParent:j,isFixed:"fixed"===m.css("position"),horizontalOffset:c,verticalOffset:e,startingPositionLeft:f,startingPositionTop:g,startingOffsetLeft:k,startingOffsetTop:l,parentOffsetLeft:n,parentOffsetTop:o,stellarRatio:m.data("stellar-ratio")!==d?m.data("stellar-ratio"):1,width:m.outerWidth(!0),height:m.outerHeight(!0),isHidden:!1})})},_findBackgrounds:function(){var b,c=this,e=this._getScrollLeft(),f=this._getScrollTop();this.backgrounds=[],this.options.parallaxBackgrounds&&(b=this.$element.find("[data-stellar-background-ratio]"),this.$element.data("stellar-background-ratio")&&(b=b.add(this.$element)),b.each(function(){var b,g,h,i,j,k,l,o=a(this),p=n(o),q=0,r=0,s=0,t=0;if(o.data("stellar-backgroundIsActive")){if(o.data("stellar-backgroundIsActive")!==this)return}else o.data("stellar-backgroundIsActive",this);o.data("stellar-backgroundStartingLeft")?m(o,o.data("stellar-backgroundStartingLeft"),o.data("stellar-backgroundStartingTop")):(o.data("stellar-backgroundStartingLeft",p[0]),o.data("stellar-backgroundStartingTop",p[1])),h="auto"===o.css("margin-left")?0:parseInt(o.css("margin-left"),10),i="auto"===o.css("margin-top")?0:parseInt(o.css("margin-top"),10),j=o.offset().left-h-e,k=o.offset().top-i-f,o.parents().each(function(){var b=a(this);return b.data("stellar-offset-parent")===!0?(q=s,r=t,l=b,!1):(s+=b.position().left,void(t+=b.position().top))}),b=o.data("stellar-horizontal-offset")!==d?o.data("stellar-horizontal-offset"):l!==d&&l.data("stellar-horizontal-offset")!==d?l.data("stellar-horizontal-offset"):c.horizontalOffset,g=o.data("stellar-vertical-offset")!==d?o.data("stellar-vertical-offset"):l!==d&&l.data("stellar-vertical-offset")!==d?l.data("stellar-vertical-offset"):c.verticalOffset,c.backgrounds.push({$element:o,$offsetParent:l,isFixed:"fixed"===o.css("background-attachment"),horizontalOffset:b,verticalOffset:g,startingValueLeft:p[0],startingValueTop:p[1],startingBackgroundPositionLeft:isNaN(parseInt(p[0],10))?0:parseInt(p[0],10),startingBackgroundPositionTop:isNaN(parseInt(p[1],10))?0:parseInt(p[1],10),startingPositionLeft:o.position().left,startingPositionTop:o.position().top,startingOffsetLeft:j,startingOffsetTop:k,parentOffsetLeft:q,parentOffsetTop:r,stellarRatio:o.data("stellar-background-ratio")===d?1:o.data("stellar-background-ratio")})}))},_reset:function(){var a,b,c,d,e;for(e=this.particles.length-1;e>=0;e--)a=this.particles[e],b=a.$element.data("stellar-startingLeft"),c=a.$element.data("stellar-startingTop"),this._setPosition(a.$element,b,b,c,c),this.options.showElement(a.$element),a.$element.data("stellar-startingLeft",null).data("stellar-elementIsActive",null).data("stellar-backgroundIsActive",null);for(e=this.backgrounds.length-1;e>=0;e--)d=this.backgrounds[e],d.$element.data("stellar-backgroundStartingLeft",null).data("stellar-backgroundStartingTop",null),m(d.$element,d.startingValueLeft,d.startingValueTop)},destroy:function(){this._reset(),this.$scrollElement.unbind("resize."+this.name).unbind("scroll."+this.name),this._animationLoop=a.noop,a(b).unbind("load."+this.name).unbind("resize."+this.name)},_setOffsets:function(){var c=this,d=a(b);d.unbind("resize.horizontal-"+this.name).unbind("resize.vertical-"+this.name),"function"==typeof this.options.horizontalOffset?(this.horizontalOffset=this.options.horizontalOffset(),d.bind("resize.horizontal-"+this.name,function(){c.horizontalOffset=c.options.horizontalOffset()})):this.horizontalOffset=this.options.horizontalOffset,"function"==typeof this.options.verticalOffset?(this.verticalOffset=this.options.verticalOffset(),d.bind("resize.vertical-"+this.name,function(){c.verticalOffset=c.options.verticalOffset()})):this.verticalOffset=this.options.verticalOffset},_repositionElements:function(){var a,b,c,d,e,f,g,h,i,j,k=this._getScrollLeft(),l=this._getScrollTop(),n=!0,o=!0;if(this.currentScrollLeft!==k||this.currentScrollTop!==l||this.currentWidth!==this.viewportWidth||this.currentHeight!==this.viewportHeight){for(this.currentScrollLeft=k,this.currentScrollTop=l,this.currentWidth=this.viewportWidth,this.currentHeight=this.viewportHeight,j=this.particles.length-1;j>=0;j--)a=this.particles[j],b=a.isFixed?1:0,this.options.horizontalScrolling?(f=(k+a.horizontalOffset+this.viewportOffsetLeft+a.startingPositionLeft-a.startingOffsetLeft+a.parentOffsetLeft)*-(a.stellarRatio+b-1)+a.startingPositionLeft,h=f-a.startingPositionLeft+a.startingOffsetLeft):(f=a.startingPositionLeft,h=a.startingOffsetLeft),this.options.verticalScrolling?(g=(l+a.verticalOffset+this.viewportOffsetTop+a.startingPositionTop-a.startingOffsetTop+a.parentOffsetTop)*-(a.stellarRatio+b-1)+a.startingPositionTop,i=g-a.startingPositionTop+a.startingOffsetTop):(g=a.startingPositionTop,i=a.startingOffsetTop),this.options.hideDistantElements&&(o=!this.options.horizontalScrolling||h+a.width>(a.isFixed?0:k)&&h<(a.isFixed?0:k)+this.viewportWidth+this.viewportOffsetLeft,n=!this.options.verticalScrolling||i+a.height>(a.isFixed?0:l)&&i<(a.isFixed?0:l)+this.viewportHeight+this.viewportOffsetTop),o&&n?(a.isHidden&&(this.options.showElement(a.$element),a.isHidden=!1),this._setPosition(a.$element,f,a.startingPositionLeft,g,a.startingPositionTop)):a.isHidden||(this.options.hideElement(a.$element),a.isHidden=!0);for(j=this.backgrounds.length-1;j>=0;j--)c=this.backgrounds[j],b=c.isFixed?0:1,d=this.options.horizontalScrolling?(k+c.horizontalOffset-this.viewportOffsetLeft-c.startingOffsetLeft+c.parentOffsetLeft-c.startingBackgroundPositionLeft)*(b-c.stellarRatio)+"px":c.startingValueLeft,e=this.options.verticalScrolling?(l+c.verticalOffset-this.viewportOffsetTop-c.startingOffsetTop+c.parentOffsetTop-c.startingBackgroundPositionTop)*(b-c.stellarRatio)+"px":c.startingValueTop,m(c.$element,d,e)}},_handleScrollEvent:function(){var a=this,b=!1,c=function(){a._repositionElements(),b=!1},d=function(){b||(o(c),b=!0)};this.$scrollElement.bind("scroll."+this.name,d),d()},_startAnimationLoop:function(){var a=this;this._animationLoop=function(){o(a._animationLoop),a._repositionElements()},this._animationLoop()}},a.fn[f]=function(b){var c=arguments;return b===d||"object"==typeof b?this.each(function(){a.data(this,"plugin_"+f)||a.data(this,"plugin_"+f,new e(this,b))}):"string"==typeof b&&"_"!==b[0]&&"init"!==b?this.each(function(){var d=a.data(this,"plugin_"+f);d instanceof e&&"function"==typeof d[b]&&d[b].apply(d,Array.prototype.slice.call(c,1)),"destroy"===b&&a.data(this,"plugin_"+f,null)}):void 0},a[f]=function(){var c=a(b);return c.stellar.apply(c,Array.prototype.slice.call(arguments,0))},a[f].scrollProperty=h,a[f].positionProperty=i,b.Stellar=e}(jQuery,this,document);