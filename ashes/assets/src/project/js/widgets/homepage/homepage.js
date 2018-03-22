window.onload= function(){

  setTimeout( () =>{
    $('.image, .btn, h1, .banner').toggleClass('active');
    $(window).click(function(){
      $('.image, .btn, h1, .banner').toggleClass('active')
    })
  }, 500)

  /*Make the left and right sides follow your mouse. This would look better if it can work with a fixed background image. */
  $('.hero').mousemove((e)=>{
     var mx = e.pageX,
         w = $(window).width();
     if(mx > (w/2)){
        let offset = mx - (w/2);
       $('.image-2').css({
         'margin-left': 0,
         'z-index': 2
        })
        $('.image-1').css({
          'margin-right': `-${offset}px`,
          'z-index': 3
        });
     }
     if(mx < (w/2)){
        let offset = (w/2) - mx;
       $('.image-1').css({
         'margin-right': 0,
         'z-index': 2
        })
        $('.image-2').css({
          'margin-left': `-${offset}px`,
          'z-index': 3
        });
     }
  })
  $('.hero').mouseleave((e)=>{

        $('.image-1').css({
         'margin-right': 0,
         'z-index': 2
        })
        $('.image-2').css({
          'margin-left': 0,
          'z-index': 3
        });
  })
}
