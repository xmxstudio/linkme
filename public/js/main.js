var tagarray = [];
$(document).ready(function(){


try{if($('.e1').html().length){$('.e1').delay(3000).animate({opacity: 0},1000);}}catch(e){}
try{if($('.e2').html().length){$('.e2').delay(3100).animate({opacity: 0},1000);}}catch(e){}
try{if($('.e3').html().length){$('.e3').delay(3200).animate({opacity: 0},1000);}}catch(e){}
try{if($('.e4').html().length){$('.e4').delay(3300).animate({opacity: 0},1000);}}catch(e){}
try{if($('.e5').html().length){$('.e5').delay(3400).animate({opacity: 0},1000);}}catch(e){}
try{if($('.e6').html().length){$('.e6').delay(3500).animate({opacity: 0},1000);}}catch(e){}
try{if($('.e7').html().length){$('.e7').delay(3600).animate({opacity: 0},1000);}}catch(e){}
//got refactor error system

$('#togglethumbs').on('click',function(){
	$('.top').toggleClass('hidden');
});
$('#togglestats').on('click',function(){
	$('.meta').toggleClass('hidden');
});


$('#newUrl').on('focus',function(){
	$(this).css('background','');

});
$('#imageurl').on('focusout',function(){
	var url =$(this).val();
	console.log(url + ' img');
	$('#previewimage').attr('src',url).show();		
});

$('#newUrl').on('focusout',function(){
	var url ='';
	if($(this).val().indexOf('http://') == -1 && $(this).val().indexOf('https://') == -1){
		console.log('prepending');
		url = 'http://' + $(this).val().replace(/^(.*\/\/[^\/?#]*).*$/, '$1') + '/favicon.ico';
	}else{
		console.log('as-is');
		url = $(this).val().replace(/^(.*\/\/[^\/?#]*).*$/, '$1') + '/favicon.ico';
	}
	// $(this).css({
	// 	background: url(url),
	// 	background-position =  test +'px 0px';
	// });
	$('#newUrl').css('background','url(' + url + ')');
	$('#newUrl').css('background-size','14px 14px');
	$('#newUrl').css('background-repeat','no-repeat');
	$('#newUrl').css('background-position', ($(this).width() - 14 )+ 'px 3px');

	
});







////////////////////////////////// ADD NEW LINK FORM PRE-POST
$('#newlinkform').submit(function(e){
	if(!$('#title').val()){
		$('#title').focus();
		e.preventDefault();
	}
	if (!$('#hashtags').val() ){
		//make sure the hidden textfield for hashtags is an empty array [] instead of null
		$('#hashtags').val('[]');		 
	}
});


///TEMP
	$('#chatmsg').keypress(function(e){
		if(e.which == 13){
			if($(this).val().length <=1) return false
			var chatline = sanitize($('#chatmsg').val());
			alert(chatline);

			var fs1 = $('<div/>').html('<p>xmetrix</p>').addClass('fs1 mw150');
			var fg1 = $('<div/>').html(chatline).addClass('fg1 ml5');
			var cl = $('<div/>').addClass('chatline flexbox-row fs10 jcfs');
			$(fs1).appendTo(cl);
			$(fg1).appendTo(cl);
			$(cl).appendTo( $('.chatlog'));
console.log($(cl));

		}
	});
////////////////// TEMP DELETE ME ^^^^^^^^///////////////////


/* HASHTAGS CODE  START */
	$('#tags').keypress(function(e){
		if(e.which == 13){
			if($(this).val().length <=1) return false
			var tag = camelCase($(this).val()) ; //$(this).val().replace(' ','');
			tag = sanitize(tag);
			if (tag.indexOf('#') !== 0){
				tag = '#' + tag;
			}

			if(tagarray.length == 0){
				 var $dismiss = $('<div>',{class:'dismiss'});
				 $dismiss.click(clearalltags);
				 $dismiss.html('✖');
				//var $div = $('<div>', {id: 'clearall',class:'hashtag clearall ghost', 'data-tag': tag});
				var $div = $('<div>', {id: 'clearall',class:'hashtag ghost', 'data-tag': tag});
				$div.html("clear all");
				$div.append($dismiss);
				$('#optionaltags').append($div);
			}


			if(tagarray.indexOf(tag) == -1){
				tagarray.push( tag );
				var $dismiss = $('<div>',{class:'dismiss'});
				$dismiss.click(dismiss);
				$dismiss.html('✖');
				var $div = $('<div>', {class:'hashtag ghost', 'data-tag': tag});
				$div.html(tag);
				$div.append($dismiss);
				$('.hashtags').append($div);
				$(this).val('');
				$(this).attr('placeholder','');
				$('#hashtags').val( JSON.stringify(tagarray));
				return false;
			}else{
				$tmptag = $(this).val();
				$(this).val('');
				$(this).attr('placeholder',$tmptag + ' already exists, please enter a different tag');
				return false
			}

		}
	})

/* HASHTAG CODE END */ 













});//document.ready


/* MISC UTILS */
String.prototype.width = function(font) {var f = font || '12px arial',
      o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();

  o.remove();

  return w;}
function camelCase(str){
	return str.replace( /(?:^\w|[A-Z]|\b\w)/g , function(l,i){
		return i === 0 ? l.toLowerCase() : l.toUpperCase();
	}).replace(/\s+/g,'');}
function dismiss(){	tagarray.splice(tagarray.indexOf($(this).parent().attr('data-tag')),1);
	$(this).parent().fadeOut(555,function(){$(this).remove();
		if(tagarray.length ==0 ){
			$('#clearall').fadeOut(555,function(){$(this).remove();});
		}
	});
	$('#hashtags').val( JSON.stringify(tagarray));}
function sanitize(str){
	return str.replace("<","&lt;");}
function clearalltags(){
	tagarray = [];
	$('.hashtags').empty();
	$('#hashtags').val( JSON.stringify(tagarray));
	$('#clearall').remove();}














				// .css({
				// 'background-image': e.target.result,
				// 'background-size' : cover
				// })

function showpic(input){
	if(input.files && input.files[0]){  
		var freader = new FileReader();
		freader.onload=function(e){
			$('#cropimage').attr('src',e.target.result);

			$('#cropper > img').cropper({
			//$('#cropimage').cropper({
				aspectRatio: 16 / 9,
				background: true,
				crop: function(e) {
					// Output the result data for cropping image.
					console.log(e.x);
					console.log(e.y);
					console.log(e.width);
					console.log(e.height);
					}
			});
		};
		freader.readAsDataURL(input.files[0]);
		$('#modal').css('display','flex');
	}//if
}//showpic


$('#cropOK').on('click',function(){
	var x = $('#cropper > img').cropper('getCroppedCanvas',{width: 120});
	$('#datablob').val(x.toDataURL());
	$('#previewimage').attr('src',x.toDataURL()).show();
	$('.previewbox').show();
	$('#cropper > img').cropper('destroy');
	$('#cropimage').attr('src','');
	$('#modal').css('display','none');
});

$('#cropCancel').on('click',function(){
	$('#cropper > img').cropper('destroy');
	$('#cropimage').attr('src','');
	$('#modal').css('display','none');


});

$('#showFileChooser').on('click',function(){
	$('#filebrowser').trigger('click');
});









$(window).scroll(function(){
	var ws = $(this).scrollTop();
	console.log(ws  + ' px');
	// if(ws >  20){
	// 	$('.flexbox').css({'transform': 'translate( 0px, ' + ws/ 2 + '%)'});
	// }
	if(ws >=50){
		$('#headerbox').css({'padding': '5px 0','position': 'fixed','top': '0','left': '0', 'right': '0'}).addClass('realdarkghost');
	}else{
		$('#headerbox').css({'padding': '0 0', 'position': 'static'}).removeClass('realdarkghost');
	}
});







