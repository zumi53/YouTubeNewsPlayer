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
     gapi.client.setApiKey('AIzaSyCaPzvdiWXAdXnFhAWDE4imAqSEVAOa_-U');

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
          width: '800px',
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
     
     var currentIndex =0;
     
     function findId(){
		 var request = gapi.client.youtube.search.list({
			 part:'snippet',
			 q: 'ABC news',
			 maxResults: 10
		 });
		 request.execute(onSearchResponse);
	}
     
     function search($button) {
          
          var date = new Date();
          var when = $button.data("when");
          //YYYY-MM-DDThh:mm:ss.sZ ISO
          var iso = date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
          iso += 'T00:00:00.000Z';
          //debugging
          console.log("dubuggin");
          console.log("Date:"+ iso);
          // Use the JavaScript client library to create a search.list() API call.
          
          var request = gapi.client.youtube.search.list({
               part: 'snippet',
               channelId:"UCupvZG-5ko_eiXAupbDfxWw",
               publishedAfter: iso,
               maxResults: 20
          });
          
          
          var request2 = gapi.client.youtube.search.list({
			  part: 'snippet',
			  channelId: "UCBi2mrWuNuyYy4gbM6fU18Q",
			  publishedAfter: iso,
			  maxResults: 20
			  
		  });
		  
          // Send the request to the API server,
          // and invoke onSearchRepsonse() with the response.
           request.execute(onSearchResponse);
		   request2.execute(onSearchResponseABC);
     }
     
     // shows thumbnail lists.
     function showResponse(response,type) {
		 if(type == "CNN"){
          var responseString = JSON.stringify(response, '', 2);
          console.log(response);
           $('.bxslider').empty();
          for(var i=0; i < response.items.length; i++){
			  var $thumbnail = $("#thumbnail-template li.thumbnail").clone();
			  var url = response.items[i].snippet.thumbnails.high.url;
			  var title = response.items[i].snippet.title;
			  $('<p><img src='+url+'><br>'+title+'<br></p>').appendTo($thumbnail);
			  $thumbnail.data("video-id",response.items[i].id.videoId);
                 $thumbnail.data("small",response.items[i].snippet.thumbnails.default.url);
              $("#lists ul.bxslider").append($thumbnail);   
		  }
           $('.bxslider').bxSlider({
               minSlides: 5,
               maxSlides: 5,
               slideWidth: 250,
               slideMargin: 5,
               captions: true
           });
        }else{
			var responseString = JSON.stringify(response, '', 2);
          console.log(response);
           $('.ABC-bxslider').empty();
          for(var i=0; i < response.items.length; i++){
			  var $thumbnail = $("#thumbnail-template li.thumbnail").clone();
			  var url = response.items[i].snippet.thumbnails.high.url;
			  var title = response.items[i].snippet.title;
			  $('<p><img src='+url+'><br>'+title+'<br></p>').appendTo($thumbnail);
			  $thumbnail.data("video-id",response.items[i].id.videoId);
                 $thumbnail.data('small',response.items[i].snippet.thumbnails.default.url);
              $("#lists ul.ABC-bxslider").append($thumbnail);   
		  }
           $('.ABC-bxslider').bxSlider({
               minSlides: 5,
               maxSlides: 5,
               slideWidth: 250,
               slideMargin: 5,
               captions: true
           });
        }
     }
     
     function clickThumbnail(thumbnail){
     
          var $thumbnail = $(thumbnail);
          $thumbnail.toggleClass("on");
          if(!$thumbnail.hasClass("on"))
               removeVideo($thumbnail);
          else
               addVideo($thumbnail);
     }
     
     function play(button){
          
          if(button == "next"){
               currentIndex++;
               if(currentIndex > $('#playList li.thumbnail').length-1){
                    currentIndex = 0;
               }
               
          }
          
          if(button=="pre"){
               
               if(currentIndex >= 1)
                    currentIndex--;
               else
                    currentIndex = 0;
          }          
          
          console.log(currentIndex);
          var videoId = $('#playList li.thumbnail:eq('+currentIndex+')').data('video-id');
          $('#playList li.thumbnail').removeClass('playing');
          $('#playList li.thumbnail.on:eq('+currentIndex+')').addClass('playing');
          player.loadVideoById(videoId);
          
     }
     
     function addVideo($thumbnail){
          $li = $thumbnail.clone(true);
          $li.removeClass("on");
          $("p img", $li).attr("src", $li.data('small'));
          $("#playList").append($li);
          
     }
     
     function removeVideo($thumbnail){
          var videoId = $thumbnail.data('video-id');
          for(var i = 0; i < $("#playList li").length ; i++){
               var videoId2 = $('#playList li:eq('+i+')').data('video-id');
               if(videoId == videoId2){
                    if(currentIndex <= i)
                         currentIndex--;      
                    $('#playList li:eq('+i+')').remove();
               }
          }
     }
     
     // Called automatically with the response of the YouTube API request.
     function onSearchResponse(response) {
          showResponse(response,"CNN");  
     }
     
     function onSearchResponseABC(response) {
          showResponse(response,"");  
     }
     
     this.start = function(){
     
		  //findId();
		  //click event
          $("button.today, button.yestarday").click(function(){ search($(this)); });
          $("button.clear").click(function(){$("#lists").empty();});
          
          $(document).on('click','#lists li.thumbnail',function(){
               clickThumbnail(this);
          });
          
          $(document).on('click','#playList li.thumbnail',function(){
               
          });
          
          $(".play").click(function(){play();});
          $(".next").click(function(){play("next");});
          $(".pre").click(function(){play("pre");;});
     };
     
}



