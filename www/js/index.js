/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var anxietyApp = {};
var howWellWork;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
      document.addEventListener('deviceready', this.onDeviceReady, false);

      var $body          = $("body")
        , $window        = $(window)
        , $container     = $('#container')
        , TRANSITION_END = "transitionend webkitTransitionEnd MSTransitionEnd oTransitionEnd";

    
        function setLocalStorageValue(property, value) {
          var obj = JSON.parse(localStorage.anxiety);
          obj['tempSession'][property] = value;
          localStorage.anxiety = JSON.stringify(obj);
        }   

       Date.prototype.yyyymmdd = function() {
         var yyyy = this.getFullYear().toString().replace('2014','14').replace('2015','15');
         var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
         var dd  = this.getDate().toString();
         var min = ('0' + this.getMinutes()).slice(-2).toString();
         console.log(min)
         var hr = this.getHours().toString();
         return (mm[1]?mm:mm[0]) + '-' + (dd[1]?dd:dd[0]) + '-' + yyyy + ' ' + hr + ':' + min; // padding
        };

        function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
            for( var i=0; i < 10; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
        
            return text;
        }

        
        function initApp() {
          console.log('initapp')
          if (anxietyApp.idnumber) {
            $('.name-saved').show().find('span').text(anxietyApp.idnumber);   
            $('.no-name').hide();         
          }
          else {
            $('.no-name').show();
          }
          if (anxietyApp.sessions && anxietyApp.sessions.length) {
            $('.anxiety-history').show();
          } else {
            $('.anxiety-history').hide();
          }
          var d = new Date();
          $('.date').find('span').text(d.yyyymmdd());
          
        }
                
        // --------------- ON APP LOAD ---------------
        try {
          if (typeof localStorage.anxiety === 'undefined') { 
            var anxiety = 
              {
                id: '',
                idnumber: '',
                sessions: [],
                tempSession: {},
                thingsToDo: []
              }
            localStorage.anxiety = JSON.stringify(anxiety);
          } else {
            // reset temp session
            try {
              var anxiety = JSON.parse(localStorage.anxiety);
              anxiety.tempSession = {};
              localStorage.anxiety = JSON.stringify(anxiety);
            } catch(e) {}
          }
          
          anxietyApp = anxiety;
          
          initApp();
                    
        } catch(e) {}
        
        $(document).on('click', '.add-item', function(e) {
           e.preventDefault();
           var val = $('[name="add-text"]').val();
           if (val) {             
             $('.add-idea').find('a').show();
             $('.add-idea').find('.add').hide();
             var count = $('.ideas-list > li').length;
             var title = '';
             if (!$('.ideas-list h1.other').length) {
               title = '<h1 class="other">Other</h1>';
             }
             var newCheckbox = $('<li>'+title+'<label><input name="check'+count+'" class="checkbox" type="checkbox"><span>'+val+'</span></label></li>');
             
             $('li.add-idea').before(newCheckbox);
           }
        });

        $(document).on('click', '.add-feeling-item', function(e) {
           e.preventDefault();
           var val = $('[name="add-feeling-text"]').val();
           if (val) {             
             $('.add-feeling').find('a').show();
             $('.add-feeling').find('.add').hide();
             var count = $('.feelings-list > li').length;
             
             var newCheckbox = $('<li><label><input name="feelings'+count+'" class="checkbox" type="checkbox"><span>'+val+'</span></label></li>');
             
             $('li.add-feeling').before(newCheckbox);
           }
        });
        
        $(document).on('click', '.nav-bar .home', function() {
          var self = $(this);
          $('.history-list').empty();
          $('#history').hide();
          $('#my-slider').html('<div class="red-bar handle"><span>3</span></div>');
          $container.show().attr('data-slide','1');
          initApp();
        });

        $(document).on('click', '.add-idea a', function(e) {
           e.preventDefault();
           $(this).hide();
           $('.add-idea').find('.add').show();
           //var newCheckbox = $('<li><label><input name="check8" class="checkbox" type="checkbox"><span>focus on breathing</span></label></li>');
        });
        $(document).on('click', '.add-feeling a', function(e) {
           e.preventDefault();
           $(this).hide();
           $('.add-feeling').find('.add').show();
           //var newCheckbox = $('<li><label><input name="check8" class="checkbox" type="checkbox"><span>focus on breathing</span></label></li>');
        });
        
        $(document).on('keyup change', 'textarea', function(e) {
           $('.error').hide();
        });
        $(document).on('keyup change', 'input[type="text"]', function(e) {
           $('.error').hide();
        });
        
        
        $(document).on('click', 'button.upload', function(e) {           
           try {
             var data = JSON.parse(localStorage.anxiety);
             var sendData = $.extend(true, {}, data);
             var newSessions = [];
             console.log(sendData)

             for (var i in sendData.sessions) {
               if (sendData.sessions[i].uploaded == false) {
                 newSessions.push(sendData.sessions[i]);
               }
             }
             sendData.sessions = newSessions;
             console.log(sendData)
             
             
           } catch(e) { var data = {}; }
           
           
           console.log(data)
           $.ajax({
             url: 'http://anxietyapp.comuv.com/submit.php',
             type: 'GET',
             data: sendData
           }).done(function() {
             console.log('success');
                                        
              for (var i in data.sessions) {
                data.sessions[i].uploaded = true;
              }
              anxietyApp = data;

              localStorage.anxiety = JSON.stringify(data);

           }).fail(function() {
           console.log('fail')
           });
        });


        $(document).on('click', '.dismiss', function(e) {
           $container.attr('data-slide',3);
        });

        $(document).on('click', '.back', function(e) {
          if ($(this).hasClass('how-well')) {
             $('.app[data-num="5"]').find('.last-slide').show(); 
             $('.app[data-num="5"]').find('.final-slider').removeClass('show');
             $('#my-slider2').html('<div class="red-bar handle"><span>3</span></div>');
          } else if ($(this).hasClass('next-time')) {
             $('.app[data-num="5"]').find('.last-slide').show(); 
             $('.app[data-num="5"]').find('.next-time').hide();
             $('#my-slider2').html('<div class="red-bar handle"><span>3</span></div>');
          } else {
             var currentSlide = parseInt($(this).closest('.app').attr('data-num'),10)
               , prevSlide    = currentSlide - 1;   
             $container.attr('data-slide',prevSlide);
          }
        });

        $(document).on('click', '.check-no', function(e) {
             $('.app[data-num="5"]').find('.last-slide').show(); 
             $('.app[data-num="5"]').find('.final-check').hide();
             $('#my-slider2').html('<div class="red-bar handle"><span>3</span></div>');
        });

        $(document).on('change', '.last-slide .checkbox', function(e) {
          $('.app[data-num="5"]').find('.error').hide();
        });
        
        $(document).on('click', '.color-bar', function(e) {
          var self = $(this);
          
          var time = self.attr('data-time');
          $('.history-list').find('.detail').hide();
          if (!self.hasClass('active')) {
            $('.color-bar').removeClass('active');
            self.addClass('active');
            $('.history-list').find('.detail[data-time="'+time+'"]').show();
          } else {
            self.removeClass('active');
            $('.history-list').find('.detail[data-time="'+time+'"]').hide();
          }
          
        });      

        $(document).on('click', 'button.view', function(e) {
          $('#history').show();
          $('#container').hide();
          
          if (anxietyApp && anxietyApp.sessions && anxietyApp.sessions.length) {

             $.each(anxietyApp.sessions, function() {
               var lvl = parseInt(this.anxietyLevel,10);
               var perc = Math.round((lvl / 7)*100);
               var date = this.formatted_date;
               var things = '';
               $.each(this.things_to_do, function() {
                 things += '<li>- '+this+'</li>';
               });
               var anxTxt = (lvl <= 1) ? 'good' : 'anxious';
               var historyItem = $('<li class="level"><span>'+date+'</span><div><div data-time="'+this.timestamp+'" class="color-bar" style="width:'+perc+'%;">'+this.anxietyLevel+'</div></div></li>');             
               var historyDetail = $('<li class="detail" data-time="'+this.timestamp+'"><div><b>Date:</b> '+this.formatted_date+'</div><div><b>My anxiety level:</b> '+this.anxietyLevel+'</div><div><b>Why I was feeling '+anxTxt+':</b> '+this.feel+'</div><div><b>Thoughts I was having:</b> '+this.what_thoughts+'</div><div><b>Feelings I was having:</b> '+this.what_feelings+'</div><div><b>Things I did:</b> <ul class="things">'+things+'</ul></div></li>'); 
               $('#history').find('.history-list').append(historyItem,historyDetail);               
             });
          }
          
        });


        $(document).on('click', '.continue', function(e) {
           var currentSlide = parseInt($(this).closest('.app').attr('data-num'),10)
             , nextSlide    = currentSlide + 1;   
             
           $('.error').hide();
           
           // SESSION SUBMIT
           if ($(this).closest('.final-check').length) {
             var d = new Date();             
             setLocalStorageValue('timestamp',new Date().getTime());
             console.log(d.yyyymmdd())
             setLocalStorageValue('formatted_date',d.yyyymmdd());
             
             var obj = JSON.parse(localStorage.anxiety);
             var tempObj = obj.tempSession;
             tempObj.uploaded = false;
             
             $('textarea').each(function() {
               $(this).val('');
             });
             
             obj.sessions.push(tempObj);
             obj.tempSession = {};
             localStorage.anxiety = JSON.stringify(obj); 
             
             $container.attr('data-slide',7);
             anxietyApp = obj;
             return false;
           }
           
           if($(this).hasClass('check')) {
             var checkCount = 0;
             var thingsToDo = [];
             $('.last-slide').find('.checkbox').each(function(e) {
               var self = $(this);
               var todoVal = self.find('+ span').text();
               if (self.is(':checked')) {
                 thingsToDo.push(todoVal);
                 checkCount++;
               }               
             });
             if (checkCount === 0) {
               $('.app[data-num="5"]').find('.error').show();
               return false;               
             }
             setLocalStorageValue('things_to_do',thingsToDo);
             if (anxiety <= 1) {
               $('.app[data-num="5"]').find('.last-slide').hide(); 
               $('.app[data-num="5"]').find('.final-check').show(); 
             } else {    
              $('.app[data-num="5"]').find('.last-slide').hide();           
                
               $('.app[data-num="5"]').find('.final-slider').addClass('show');
               initDragdealer2(); 
               
        //       $('.app[data-num="5"]').find('.final-check').show(); 
             }             
            
           } else if ($(this).hasClass('how-well')) {
            console.log('how well: ' + howWellWork)
              if (howWellWork <= 2) {
                $('.app[data-num="5"]').find('.final-slider').removeClass('show');
                $('.app[data-num="5"]').find('.final-check').show(); 
              } else {
                $('.app[data-num="5"]').find('.final-slider').removeClass('show');
                $('.app[data-num="5"]').find('.next-time').show(); 
              }
           } else if ($(this).hasClass('submit-next')) {
  
               var checkCount = 0;
               var nextTime = [];
               $('.next-time').find('.checkbox').each(function(e) {
                 var self = $(this);
                 var todoVal = self.find('+ span').text();
                 if (self.is(':checked')) {
                   nextTime.push(todoVal);
                   checkCount++;
                 }               
               });
               if (checkCount === 0) {
                 $('.next-time').find('.error').show();
                 return false;               
               }
               setLocalStorageValue('next_time',nextTime);


              $('.app[data-num="5"]').find('.next-time').hide();
              $('.app[data-num="5"]').find('.final-check').show(); 

           } else {            
              if (currentSlide == 1) {
                var obj = JSON.parse(localStorage.anxiety);
                var idnumber = obj.idnumber;
                var id = obj.id;
                
                if (!idnumber) {
                  idnumber = $('input[name="name"]').val();
                }
                if (!id) {
                  id = makeid();
                }
                if (!idnumber) {
                  $('.app[data-num="1"]').find('.error').show();
                  return false;
                }
                // save name
                obj.idnumber = idnumber; 
                obj.id = id;               
                localStorage.anxiety = JSON.stringify(obj);
              } 
               if(nextSlide == 3) {
                   if(anxiety >= 6) {
                     $container.attr('data-slide',6);
                     return false;
                   }
/*                  var text = anxiety <= 1 ? 'Describe what kept your anxiety low.' : 'Describe what made you feel anxious.'; */
                 var text = anxiety <= 1 ? 'Describe what is keeping your anxiety low.' : 'Describe what is making you feel anxious.';

                 $('.app[data-num="3"]').find('.changer').text(text);
               }

               if(currentSlide == 3) {
                 var q2 = $('[name="q2"]').val();
                 if(!q2) {
                   $('.app[data-num="3"]').find('.error').show();
                   return false;
                 }
                 setLocalStorageValue('feel',q2);
               }
               
               if (currentSlide == 4) {
                 var q3 = $('[name="q3"]').val();

                 if(!q3) {
                   $('.app[data-num="4"]').find('.error.q3').show();
                   return false;
                 }

                 var checkCount = 0;
                 var feelings = [];
                 $('.feelings-list').find('.checkbox').each(function(e) {
                   var self = $(this);
                   var todoVal = self.find('+ span').text();
                   if (self.is(':checked')) {
                     feelings.push(todoVal);
                     checkCount++;
                   }               
                 });
                 if (checkCount === 0) {
                   $('.app[data-num="4"]').find('.error.q4').show();
                   return false;               
                 }
                 
                 setLocalStorageValue('what_thoughts',q3);
                 setLocalStorageValue('what_feelings',feelings);

/*                   var text = anxiety <= 1 ? 'What did you do to keep your anxiety low?' : 'What did you try to do to reduce your anxiety:'; */
                 var text = anxiety <= 1 ? 'What are some things you have done?' : 'Here are some things you can do:';
                 $('.app[data-num="5"]').find('.changer').text(text);
               }
               
               $container.attr('data-slide',nextSlide);
               $('html, body').animate({	scrollTop: 0 }, 400); 
               
               if(nextSlide == 2) initDragdealer();
           }
          
           
        });

        
        function initDragdealer() {
          console.log('initDragdealer')
        	new Dragdealer('my-slider',
        	{
        		steps: 8,
        		snap: true,
        		loose: true,
        		animationCallback: function(x, y)
        		{
        		  var num = Math.round(x*7);
        		  anxiety = num;
        		  $('.red-bar.handle').find('> span ').text(num);
        		  setLocalStorageValue('anxietyLevel',num);
        		  $container.attr('data-anxiety',num);
        		}
        	});          
        }
        function initDragdealer2() {
          console.log('initDragdealer2')
        	new Dragdealer('my-slider2',
        	{
        		steps: 8,
        		snap: true,
        		loose: true,
        		animationCallback: function(x, y)
        		{
        		  var num = Math.round(x*7);
        		  howWellWork = num;
        		  $('.red-bar.handle').find('> span ').text(num);
        		  setLocalStorageValue('howWellWork',num);
        		//  $container.attr('data-anxiety',num);
        		}
        	});          
        }
    },
    
    
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
      console.log('ready')
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
/*
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
*/

        console.log('Received Event: ' + id);
    }
};
