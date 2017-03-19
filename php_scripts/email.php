<?php 
	//check if user clicked button submit;
	//then create variables
	if(isset($_POST['submit'])){
		//create safe variables to use in the email
		$name = htmlspecialchars($_POST['name']);
		$email = htmlspecialchars($_POST['email']);
		$subject = htmlspecialchars($_POST['subject']);
		$phone_number = htmlspecialchars($_POST['phone']);
		$message = htmlspecialchars($_POST['message']);

		//check if all required fields were submitted
		//if they were not, send user back to contact form and re-populate the fields
		if(!empty($_POST['name']) && !empty($_POST['email']) && !empty($_POST['subject']) && !empty($_POST['message']))
		{
			$_SESSION['submitted'] = true;
			$data['submitted'] = $_SESSION['submitted']; 
		}
		else
		{
			$_SESSION['submitted'] = false;
			//create session variables to re-populate the form if using php without ajax
			$_SESSION['name'] = $name;
			$_SESSION['email'] = $email;
			$_SESSION['subject'] = $subject;
			$_SESSION['phone'] = $phone_number;
			$_SESSION['message'] = $message;
			
			//variables to be passed back to ajax
			$data['success'] = $_SESSION['submitted']; 
			$data['name'] = $name;
			echo json_encode($data);
			exit;
		}
	}

	//function that checks script injections
	function IsInjected($str)
	{
	    $injections = array('(\n+)',
	           '(\r+)',
	           '(\t+)',
	           '(%0A+)',
	           '(%0D+)',
	           '(%08+)',
	           '(%09+)'
	           );
	                
	    $inject = join('|', $injections);
	    $inject = "/$inject/i";
	     
	    //perform regular expression match
	    if(preg_match($inject,$str))
	    {
	      return true;
	    }
	    else
	    {
	      return false;
	    }
	}

	//call function
	if(IsInjected($email))
	{
	    echo "Bad email value!";
	    exit;
	}

	//customize message
	$email_body = "

	New message sent on www.gabrielferraz.com. 

	From $name, e-mail: $email, and phone number: $phone_number 
	                        
	Message: $message.

	";

	//send message
	$to = 'gabrielferraz27@gmail.com';
	$headers = 'From:  gabrielferraz.com' . "\r\n" .
	'Reply-To:  gabrielferraz27@gmail.com' . "\r\n" .
	'X-Mailer: PHP/' . phpversion();

	//send email
	mail($to, $subject, $email_body, $headers);

	//Test if email was sent
	if( @mail($to, $subject, $email_body, $headers) )
	{
		//variables to be passed back to ajax
		$data['name'] = $name;
		$data['success'] = true;
	 	echo json_encode($data);
		exit;
	}
	else
	{
		$data['name'] = $name;
	 	echo json_encode($data);
		exit;
	}
	
 ?>
