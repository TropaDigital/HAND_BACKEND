<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class Naichesms_CallbackController extends My_Controller 
{
	
	public function ini ()
	{
		
		
	}
	
	public function twwAction()
	{
		
		
		$_REQUEST['Seunum'] = base64_decode( $_REQUEST['Seunum'] );
		$explode = explode('[-.-.-]', $_REQUEST['Seunum']);
		
		$post = array();
		$post['Seunum'] = $explode[1];
		$post['Celular'] = $_REQUEST['Celular'];
		$post['Status'] = $_REQUEST['Status'];
		$post['Data'] = $_REQUEST['Data'];
		$post['TextoStatus'] = $_REQUEST['TextoStatus'];
		
		$urlRetorno = $explode[0] . '?'.http_build_query( $post );
		
		//$envia = file_get_contents($urlRetorno);
		
		$open = fopen($_SERVER['DOCUMENT_ROOT'].'/assets/logs/naichesms/'.time().'-'.$envia.'.txt', 'w');
		fwrite($open, json_encode($post));
		fclose($open);
		
		echo $envia;
		
	}
	
	public function moAction()
	{
	
		$explode = explode('[-.-.-]', $_REQUEST['Seunum']);
		
		$post = array();
		$post['operadora'] = $_REQUEST['Operadora'];
		$post['mensagem'] = $_REQUEST['Mensagem'];
		$post['celular'] = $_REQUEST['Celular'];
		$post['shnum'] = $_REQUEST['Shnum'];
		$post['seunum'] = $_REQUEST['Seunum'];
		$post['data'] = $_REQUEST['Data'];
	
		$urlRetorno = $explode[0].'?'.http_build_query( $post );
		
		echo file_get_contents($urlRetorno);
	
	}
	
}