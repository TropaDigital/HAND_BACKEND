<?php

/**
 * SendMail
 * 
 * @author Leandro Rizzo leandro.php@terra.com.br (Heavy Metal Is The Law!!!)
 * @category SendMail
 * @version 1.0
 */

function ConfigMail( $cfgUsername='noreply@leadsmanager.com.br',$cfgPassword='naiche1217')
{
    $config = array('auth' 		=> 'login',
    				'username' 	=> $cfgUsername,
                    'password' 	=> $cfgPassword,
    		  		'port'		=> 465,
			  		//'ssl' 		=> 'tls'
    				'ssl' 		=> 'ssl'
    				);
	return $config;
}

function SendMail( $msg 			= NULL,
				   $emailPara 		= 'noreply@leadsmanager.com.br',
				   $emailAssunto 	= 'ZIGZAG',
				   $emailresposta 	= NULL,
				   $emailBcc 		= NULL,
				   $emailFrom 		= 'noreply@leadsmanager.com.br',
				   $nomeFrom 		= 'ZIGZAG',
				   $cfgSmtp 		= 'naiche.virtuaserver.com.br',
				   $config 			= NULL
				 )
{
	Zend_Loader::loadClass('Zend_Mail');
	Zend_Loader::loadClass('Zend_Mail_Transport_Smtp');
	
	if ( $config == NULL )
		$config = ConfigMail();
	
	$tr = new Zend_Mail_Transport_Smtp($cfgSmtp,$config);
    
    $mail = new Zend_Mail();
    
    /*
     * Reply-To
     */
    if  ( $emailresposta )
    {
    	$mail->setFrom($emailresposta, utf8_decode($nomeFrom));
    	$mail->setDefaultReplyTo($emailresposta, $nomeFrom);
    } else
    	$mail->setFrom($emailFrom, utf8_decode($nomeFrom));

    /*
     * COPIA OCULTA
     */
    if ( $emailBcc )
		$mail->addBcc($emailBcc);

	$mail->addTo($emailPara);
	$mail->setSubject( (utf8_decode($emailAssunto)) );
	$mail->setBodyHtml($msg);
	$mail->setBodyText($msg);

	try
	{
		$mail->send($tr);
		//$mail->send();

		return true;
		
	} catch (Exception $e)
	{
		$e = $e;
		
		return false;
	}
	
}

function MsgMail( $opc_sendmail, $form = "custom" )
{	
	
	switch ($form) 
	{
		case "recuperar" :
			$msg = "<b>Sua nova senha:</b>
					<br><br><b>Senha:</b> <br>".$opc_sendmail['senha']."
					";
		break;
		
		case "contato" :
			$msg = "<b>Nome:</b> ".$opc_sendmail['nome']."
					<br><br>
					<b>Email:</b> ".$opc_sendmail['email']."
					<br><br>
					<b>Telefone:</b> ".$opc_sendmail['telefone']."
					<br><br>
					
					<b>Interesse:</b> ".$opc_sendmail['interesse']."
					<br><br>
					<b>Empresa:</b> ".$opc_sendmail['empresa']."
					<br><br>
					<b>Tipo:</b> ".$opc_sendmail['tipo']."
					<br><br>
					<b>Cidade/Estado:</b> ".$opc_sendmail['cidade_estado']."
					<br><br>
							
					<b>Mensagem:</b> ".$opc_sendmail['mensagem']."
					<br><br>
					";
			break;
			
		case "newsletter" :
				$msg = "<b>Nome:</b> ".$opc_sendmail['nome']."
					<br><br>
					<b>Email:</b> ".$opc_sendmail['email']."
					<br><br>
					";
			break;
		
		case "custom" :
			$msg = $opc_sendmail['mensagem'];
		break;
		
		default:
			$msg = ' - EMAIL - ';
		break;
		
	}
	
	return utf8_decode($msg);
}

