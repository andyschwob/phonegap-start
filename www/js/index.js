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
      document.addEventListener('resume', this.onResume, false);
      document.addEventListener('pause', this.onPause, false);

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
         var yyyy = this.getFullYear().toString().replace('2014','14').replace('2015','15').replace('2016','16');
         var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
         var dd  = this.getDate().toString();
         var min = ('0' + this.getMinutes()).slice(-2).toString();
         console.log(min)
         var hr = this.getHours().toString();
         console.log(hr);
         var hour = parseInt(hr,10);
         var ampm = hour < 12 ? 'AM' : 'PM';
         hr = hour < 12 ? hour : hour - 12;
         return (mm[1]?mm:mm[0]) + '/' + (dd[1]?dd:dd[0]) + '/' + yyyy + ' ' + hr + ':' + min + ' ' + ampm;
        };

        function makeid() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        
            for( var i=0; i < 10; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));
        
            return text;
        }

        
        function initApp() {
          if (anxietyApp.id) {
            $('.pin-set').show(); 
            $('.pin-not-set').hide();         
          }
          else {
            $('.pin-set').hide();
            $('.pin-not-set').show();
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
          $('#my-slider2').html('<div class="red-bar handle"><span>3</span></div>');
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
        
        $('#history').on('click', '.cancel', function(e) {
           e.preventDefault();
           console.log('cancel');
           var self = $(this);
           $('.admin-pw, .confirm-upload').hide();
           $('.history-content, .nav-bar .upload').show();
           
           $('.admin-pw input').val('');
        });
                
        $('#history').on('click', '.upload-done-btn', function(e) {
           e.preventDefault();
           var self = $(this);
           $('.admin-pw, .confirm-upload, .upload-done').hide();
           $('.history-content, .nav-bar .upload').show();
           
           $('.admin-pw input').val('');
        });

        $(document).on('click', '.enter-password', function(e) {
          e.preventDefault();
          var self = $(this);
          var adminPW = '3095';
          var form = self.closest('.anx-form');
          var pw = form.find('input').val();
          form.find('.error').hide();

          if (!pw) {
            form.find('.error').html('You must enter your password').show();
            return false;
          }
          
          if (pw != adminPW) {
            form.find('.error').html('Your password is incorrect').show();
            return false;            
          }
          
          try {
             var data = JSON.parse(localStorage.anxiety);
             var falseCount = 0;
             for (var i in data.sessions) {
               if (data.sessions[i].uploaded == false) {
                 falseCount++;
               }
             }                  
          } catch(e) { var data = {}; }  
          
          var confirmTxt = '';
          if (falseCount > 1) {
            confirmTxt = "There are <b>" + falseCount + "</b> sessions to upload, are you sure?";
            $('.confirm-upload-btn').show();
            $('.cancel-upload').html('Cancel'); 
          } else if (falseCount == 1) {
            confirmTxt = "There is <b>" + falseCount + "</b> session to upload, are you sure?";
            $('.confirm-upload-btn').show();
            $('.cancel-upload').html('Cancel');
          } else {
            confirmTxt = "There are currently no sessions to upload";
            $('.confirm-upload-btn').hide();
            $('.cancel-upload').html('Go Back');
          }
          $('.confirm-sessions').html(confirmTxt);          
          $('.admin-pw').hide();
          $('.confirm-upload').show();

          $('html, body').animate({	scrollTop: 0 }, 400);   
        });
        
        $(document).on('click', '.confirm-upload-btn', function(e) {  
          e.preventDefault();
           try {
             var data = JSON.parse(localStorage.anxiety);
             var sendData = $.extend(true, {}, data);
             var newSessions = [];

             for (var i in sendData.sessions) {
               if (sendData.sessions[i].uploaded == false) {
                 delete sendData.sessions[i].feel;
                 delete sendData.sessions[i].what_thoughts;
                 newSessions.push(sendData.sessions[i]);
               }
             }
             sendData.sessions = newSessions;           
             
           } catch(e) { var data = {}; }                      

           $.ajax({
             url: 'http://anxietyapp.comuv.com/submit.php',
             type: 'GET',
             data: sendData
           }).done(function(response) {
             console.log(response);
             if (response === 'error') {
                // show error   
                console.log('error');                
             } else {
               console.log('success');
                for (var i in data.sessions) {
                  data.sessions[i].uploaded = true;
                }
                anxietyApp = data;  
                localStorage.anxiety = JSON.stringify(data);  
                $('.confirm-upload').hide();     
                $('.upload-done').show();    
             }                            
           });
        });
        $(document).on('submit', '.anx-form', function(e) {
          e.preventDefault();
          console.log('23423432343234234243');
          $(this).find('.sbmt').click();
        });

        $(document).on('click', 'button.upload', function(e) {  
           e.preventDefault();
           $('.history-content, .confirm-upload, .nav-bar .upload').hide();
           $('.admin-pw').show();
        });

        $(document).on('click', '.dismiss', function(e) {
           $container.attr('data-slide',3);
        });

        $(document).on('click', '.back', function(e) {
          if ($(this).hasClass('how-well')) {
             $('.app[data-num="5"]').find('.last-slide').show(); 
               $('.app[data-num="5"]').find('.final-slider').removeClass('show');
             $('#my-slider2').html('<div class="red-bar handle"><span>3</span></div>');
          } else if ($(this).hasClass('next-time-btn')) {
             $('.app[data-num="5"]').find('.final-slider').addClass('show'); 
             $('.app[data-num="5"]').find('.next-time').hide();
           //  $('#my-slider2').html('<div class="red-bar handle"><span>3</span></div>');
          } else {
             var currentSlide = parseInt($(this).closest('.app').attr('data-num'),10)
               , prevSlide    = currentSlide - 1;   
             $container.attr('data-slide',prevSlide);
          }
        });

        $(document).on('click', '.check-no', function(e) {
             $('.app[data-num="5"]').find('.last-slide').show(); 
             $('.app[data-num="5"]').removeClass('final-slide').find('.final-check').hide();
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
               var lvlafter = parseInt(this.howWellWork,10);
               var perc = Math.round((lvl / 7)*100);
               var date = this.formatted_date;
               var typeClass = this.type;
               var things = '';
               $.each(this.things_to_do, function() {
                 things += '<li>- '+this+'</li>';
               });
               var anxTxt = (lvl <= 1) ? 'good' : 'anxious';
               var next_time = '';
               var next_time_list = '';
               if (this.next_time) {
                 $.each(this.next_time, function() {
                   next_time += '<li>- '+this+'</li>';
                 });                 
                 var next_time_list = '<div><b>To do next time:</b> <ul class="things">'+next_time+'</ul></div>';
               }
               
               var historyItem = $('<li class="level"><span>'+date+'</span><div><div data-time="'+this.timestamp+'" class="color-bar ' + typeClass + '" style="width:'+perc+'%;">'+this.anxietyLevel+'</div></div></li>');             
               var historyDetail = $('<li class="detail" data-time="'+this.timestamp+'"><div><b>Date:</b> '+this.formatted_date+'</div><div><b>My anxiety level:</b> '+this.anxietyLevel+'</div><div><b>Why I was feeling '+anxTxt+':</b> '+this.feel+'</div><div><b>Thoughts I was having:</b> '+this.what_thoughts+'</div><div><b>Feelings I was having:</b> '+this.what_feelings+'</div><div><b>Things I did:</b> <ul class="things">'+things+'</ul></div><div><b>My anxiety level afterwards:</b> '+lvlafter+'</div>' + next_time_list + '</li>'); 
               $('#history').find('.history-list').append(historyItem,historyDetail);               
             });
          }
          
        });


        $(document).on('click', '.set-pin1', function(e) {
          e.preventDefault();
          var self = $(this);
          var form = self.closest('.anx-form');
          var obj = JSON.parse(localStorage.anxiety);
          var pin = form.find('input').val();
          var savedPin = obj.id;
          form.find('.error').hide();

          if (!pin) {
            form.find('.error').html('You must enter a PIN #').show();
            return false;
          }
          
          obj.id = pin;               
          localStorage.anxiety = JSON.stringify(obj);         
  
          $container.attr('data-slide','0');
          $('html, body').animate({	scrollTop: 0 }, 400); 
        });

        $(document).on('click', '.enter-pin', function(e) {
          e.preventDefault();
          var self = $(this);
          var form = self.closest('.anx-form');
          var obj = JSON.parse(localStorage.anxiety);
          var pin = form.find('input').val();
          var savedPin = obj.id;
          form.find('.error').hide();

          if (!pin) {
            form.find('.error').html('You must enter your PIN #').show();
            return false;
          }
          
          if (pin != savedPin) {
            form.find('.error').html('Your PIN # is incorrect').show();
            return false;            
          }

          $container.attr('data-slide','0');
          $('html, body').animate({	scrollTop: 0 }, 400); 
        });

        $(document).on('click', '.enter-pin1', function(e) {
          var obj = JSON.parse(localStorage.anxiety);
          var pin = $('input[name="setpin"]').val();
          console.log(pin);
/*
          var idnumber = obj.idnumber;
          var id = obj.id;
          
          if (!idnumber) {
            idnumber = $('input[name="name"]').val();
          }
          if (!id) {
            id = makeid();
          }
*/
          if (!pin) {
            $('.app[data-num="pin"] .pin-not-set').find('.error').show();
            return false;
          }
          // save name
//          obj.idnumber = idnumber; 
          obj.id = pin;               
          localStorage.anxiety = JSON.stringify(obj);         
  
          $container.attr('data-slide','0');
          $('html, body').animate({	scrollTop: 0 }, 400); 
        });
        

        $(document).on('click', '.continue', function(e) {
           var self = $(this);
           var currentSlide = parseInt(self.closest('.app').attr('data-num'),10);
           var nextSlide    = currentSlide + 1;   
             
           $('.error').hide();
           
           // SESSION SUBMIT
           if ($(this).closest('.final-check').length) {
             var d = new Date();             
             var type = $container.attr('data-type');
             setLocalStorageValue('timestamp',new Date().getTime());
             console.log(d.yyyymmdd())
             setLocalStorageValue('formatted_date',d.yyyymmdd());
             
             var obj = JSON.parse(localStorage.anxiety);
             var tempObj = obj.tempSession;
             tempObj.uploaded = false;
             tempObj.type = type;
             
             $('textarea').each(function() {
               $(this).val('');
             });
             $('input[type="checkbox"]').prop('checked', false);
             $('.final-check').hide();
             $('.last-slide').show();
             
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
               $('.app[data-num="5"]').addClass('final-slide').find('.final-check').show(); 
             } else {    
              $('.app[data-num="5"]').find('.last-slide').hide();           
                
               $('.app[data-num="5"]').find('.final-slider').addClass('show');
               initDragdealer2(); 
               
             }             
            
           } else if ($(this).hasClass('how-well')) {

              if (howWellWork <= 2) {
                $('.app[data-num="5"]').find('.final-slider').removeClass('show');
                $('.app[data-num="5"]').addClass('final-slide').find('.final-check').show(); 
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
              $('.app[data-num="5"]').addClass('final-slide').find('.final-check').show(); 

           } else {            
              if (currentSlide == 1) {
                var obj = JSON.parse(localStorage.anxiety);
                var idnumber = obj.idnumber;
                var id = obj.id;
                
                if (self.hasClass('daily')) {
                  $container.attr('data-type','daily');
                } else {
                  $container.attr('data-type','free');
                }
                
              } 
               if(nextSlide == 3) {
                   if(anxiety >= 6) {
                     $container.attr('data-slide',6);
                     return false;
                   }
                 if ($container.attr('data-type') === 'daily') {
                   var text = anxiety <= 1 ? 'Describe what kept your anxiety low.' : 'Describe what made you feel anxious.'; 
                 } else {
                   var text = anxiety <= 1 ? 'Describe what is keeping your anxiety low.' : 'Describe what is making you feel anxious.';   
                 }   

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

                 if ($container.attr('data-type') === 'daily') {
                   var text = anxiety <= 1 ? 'What did you do to keep your anxiety low?' : 'What did you try to do to reduce your anxiety:';
                 } else {
                   var text = anxiety <= 1 ? 'What are some things you have done?' : 'Here are some things you can do:';
                 }   
                 
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
        app.receivedEvent('deviceready');
    },
    onResume: function() {
      var obj = JSON.parse(localStorage.anxiety);
      var timePaused = obj.timePaused;
      var now = new Date().getTime();
      var secondsBetween = Math.round((now - timePaused)/1000);
      if (secondsBetween > 30) {
        // restart app here
         $('#container').attr('data-num','pin');
         $('textarea').each(function() {
           $(this).val('');
         });
         $('input[type="checkbox"]').prop('checked', false);
         $('.last-slide').show();
         $('.final-slider, .next-time, .final-check').hide();
      }        
    },
    onPause: function() {
        var obj = JSON.parse(localStorage.anxiety);
        obj.timePaused = new Date().getTime();               
        localStorage.anxiety = JSON.stringify(obj); 
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
