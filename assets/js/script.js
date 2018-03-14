$(function(){

	var body = $('body'),
		stage = $('#stage'),
		back = $('a.back');

	$('#step1 .encrypt').click(function(){
		body.attr('class', 'encrypt');

		step(2);
	});

	$('#step1 .decrypt').click(function(){
		body.attr('class', 'decrypt');
		step(2);
	});

	$('#step2 .button').click(function(){
		$(this).parent().find('input').click();
	});

	var file = null;
	$('#step2').on('change', '#encrypt-input', function(e){
		if(e.target.files.length!=1){
			alert('Selecione o ficheiro que deseja encriptar!');
			return false;
		}

		file = e.target.files[0];

		if(file.size > 1024*1024) {
			alert('Selecione um ficheiro menor que 1mb');
			return;
		}

		step(3);
	});

	$('#step2').on('change', '#decrypt-input', function(e){

		if(e.target.files.length!=1){
			alert('Selecione o ficheiro que deseja decriptar!');
			return false;
		}

		file = e.target.files[0];
		step(3);
	});


	/* Step 3 */


	$('a.button.process').click(function(){

		var input = $(this).parent().find('input[type=password]'),
			a = $('#step4 a.download'),
			password = input.val();

		input.val('');

		if(password.length == ''){
			alert('Password invalido!');
			return;
		} else if(password.length < 5) {
            alert('Escolha um password mais seguro');
            return;
        }

		// The HTML5 FileReader object will allow us to read the 
		// contents of the	selected file.

		var reader = new FileReader();

		if(body.hasClass('encrypt')){

			// Encrypt the file!

			reader.onload = function(e){
				var encrypted = CryptoJS.AES.encrypt(e.target.result, password);
				a.attr('href', 'data:application/octet-stream,' + encrypted);
				a.attr('download', file.name + '.encrypted');

				step(4);
			};
			reader.readAsDataURL(file);
		} else {
			reader.onload = function(e){

				var decrypted = CryptoJS.AES.decrypt(e.target.result, password)
										.toString(CryptoJS.enc.Latin1);

				if(!/^data:/.test(decrypted)){
					alert("Password ou ficheiro invalido! Tente de novo.");
					return false;
				}

				a.attr('href', decrypted);
				a.attr('download', file.name.replace('.encrypted',''));

				step(4);
			};

			reader.readAsText(file);
		}
	});

	back.click(function(){
		$('#step2 input[type=file]').replaceWith(function(){
			return $(this).clone();
		});

		step(1);
	});

	function step(i){

		if(i == 1){
			back.fadeOut();
		}
		else{
			back.fadeIn();
		}
		stage.css('top',(-(i-1)*100)+'%');
	}

});
