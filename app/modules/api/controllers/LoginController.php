<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class Api_LoginController extends My_Controller 
{
	
	public function ini()
	{
		
	}
	
	public function loginAction()
	{
	
	    $login = $_GET['login'];
	    $senha = $_GET['senha'];
	    
	    if ( $login == 'root' && $senha == 'root' ) {
	        
	        $data = [];
	        $data['user'] = $login;
	        $data['senha'] = $senha;
	        $data['token'] = base64_encode( uniqid().time() );
	        
	        $_SESSION[$data['token']] = $data;
	        
	        echo json_encode($data); exit;
	        
	    }
		
	}
	
	public function getAction()
	{
	    
	    echo json_encode($_SESSION[$_GET['token']]); exit;
	    
	}
	
}