// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms
     
//cnn
//publishedAfter: iso
var player;
// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
     gapi.client.load('youtube', 'v3',onYouTubeApiLoad);
}     
// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad(){
     // This API key is intended for use only in this lesson.
     // See http://goo.gl/PdPA1 to get a key for your own applications.
     gapi.client.setApiKey('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

     var tag = document.createElement('script');
     tag.src = "https://www.youtube.com/iframe_api";
     var firstScriptTag = document.getElementsByTagName('script')[0];
     firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
     
     //start from here
     window.app = new youtubeApp();
     window.app.start();
}

function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
          height: '400px',
          width: '600px',
          events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
          }
        });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {

}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
     if (event.data == YT.PlayerState.ENDED) {
          $(".next").trigger('click');
     }
}
      
function stopVideo() {
     player.stopVideo();
}
     
     
function youtubeApp(){
     var sliders = [];
     var currentIndex =0;
// add new channel
     var channels = {
          CNN: "UCupvZG-5ko_eiXAupbDfxWw",
          ABC: "UCBi2mrWuNuyYy4gbM6fU18Q",
          BBC: "",
          CBS: "",
          CNNMONEY: "UCe-4xQosMQGkIA8mT4sR98Q",
          ECONOMIST: "",
          
          
     };

// this is used when you want to find channel Id
     function findId(){
		 var request = gapi.client.youtube.search.list({
			 part:'snippet',
			 q: 'CNN money',
			 maxResults: 10
		 });
           request.execute(function(response){
               var responseString = JSON.stringify(response, '', 2);
               console.log("finding ID");
               console.log(response);
          });
	}
     
     function search($button){
          $button.siblings().removeClass("active");
          $button.addClass("active");
          var date = new Date();
          var news = $button.parent().data("news");
          var when = parseInt($button.data("when"));
          //YYYY-MM-DDThh:mm:ss.sZ ISO
          var iso = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + (date.getDate()-when);
          iso += 'T00:00:00.000Z';
          //debugging
          console.log("dubuggin");
          console.log("Date:"+ iso);
          // Use the JavaScript client library to create a search.list() API call.
          
          var request = gapi.client.youtube.search.list({
               part: 'snippet',
               channelId: channels[news],
               publishedAfter: iso,
               maxResults: 20
          });
		  
          // Send the request to the API server,
          // and invoke onSearchRepsonse() with the response.
          request.execute(function(response){
               showResponse(response,news);
		  });
   }
// shows thumbnail lists.
     function showResponse(response,news){
          var responseString = JSON.stringify(response, '', 2);
           $('#'+news+' .bxslider').empty();
          for(var i=0; i < response.items.length; i++){
			  var $thumbnail = $("#thumbnail-template li.thumbnail").clone();
			  var url = response.items[i].snippet.thumbnails.high.url;
			  var title = response.items[i].snippet.title;
			  $('<p><img src='+url+'><br>'+title+'<br></p>').appendTo($thumbnail);
			  $thumbnail.data("video-id",response.items[i].id.videoId);
                 $thumbnail.data("small",response.items[i].snippet.thumbnails.default.url);
              $('#'+news+' .bxslider').append($thumbnail);   
		  }
		  
          if(!sliders[news]){
           var slider = $('#'+news+' .bxslider').bxSlider({
               minSlides: 1,
               maxSlides: 5,
               slideWidth: 250,
               slideMargin: 5,
               captions: true
           });
           sliders[news]=slider;
		  }
		  else{
			sliders[news].reloadSlider();
               loadSelected();
		 }
     }
  
     function clickThumbnail($thumbnail){
     
          $thumbnail.toggleClass("on");
          if(!$thumbnail.hasClass("on"))
               removeVideo($thumbnail);
          else
               addVideo($thumbnail);
     }
     
     function clickRemove($thumbnail){
          
          var videoId = $thumbnail.data('video-id');
          $('#lists li').each(function(){
               if($(this).data('video-id') == videoId)
                    $(this).removeClass('on');
          });
          removeVideo($thumbnail);
     }
     
     function play(type,$thumbnail){
          
          if(type == "next"){
               currentIndex++;
               if(currentIndex > $('#playList li.thumbnail').length-1){
                    currentIndex = 0;
               }
               
          }
          
          if(type =="pre"){
               
               if(currentIndex >= 1)
                    currentIndex--;
               else
                    currentIndex = 0;
          }          
          
          if(type =="play"){
               currentIndex =  $('#playList li').index($thumbnail);
               console.log(currentIndex);   
          }
          
          var videoId = $('#playList li.thumbnail:eq('+currentIndex+')').data('video-id');
          $('#playList li.thumbnail').removeClass('playing');
          $('#playList li.thumbnail:eq('+currentIndex+')').addClass('playing');
          player.loadVideoById(videoId);
          
     }
     
     function addVideo($thumbnail){
          $li = $thumbnail.clone(true);
          $li.removeClass("on");
          $("p img", $li).attr("src", $li.data('small'));
          var $removeButton = $("#button-template .remove").clone(true);
          var $playButton = $("#button-template .play").clone(true);
          $li.append($removeButton);
          $li.append($playButton);
          $("#playList").append($li);
          
     }
     
     function removeVideo($thumbnail){
          var videoId = $thumbnail.data('video-id');
          for(var i = 0; i < $("#playList li").length ; i++){
               var videoId2 = $('#playList li:eq('+i+')').data('video-id');
               if(videoId == videoId2){
                    if(i <= currentIndex)
                         currentIndex--;      
                    $('#playList li:eq('+i+')').remove();
               }
          }
     }
     
     function loadSelected(){
          var selectedVideo = [];
          $('#playList li').each(function(){
               selectedVideo.push($(this).data('video-id'));
          });
          
          if(selectedVideo){
               for(var i=0; i < selectedVideo.length; i++){
                    
                    $('#lists li').each(function(){
                         if($(this).data('video-id') == selectedVideo[i])
                              $(this).addClass('on');
                    });
                    
               }
          }
          
     }
     
     function getTime(iso){
          console.log(new Date().toISOString());
     
     
     }
          
     this.start = function(){
		 
          getTime();
          $('#lists button.t').each(function(){search($(this))});
          findId();
          
          //click event
          $("#lists button").click(function(){search($(this))});
          $("button.clear").click(function(){$("#lists").empty();});
          
          $(document).on('click','#lists li.thumbnail',function(){
               clickThumbnail($(this));
          });
          
          $(document).on('click','#playList .remove',function(){
               clickRemove($(this).parent());
          });
          
          $(document).on('click','#playList .play', function(){
               play("play",$(this).parent());
          });
          $(".next").click(function(){play("next",0);});
          $(".pre").click(function(){play("pre",0);;});
     };
     
}



