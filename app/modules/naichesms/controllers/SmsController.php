<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';
include_once 'app/models/tww/TWWLibrary.php';

class Naichesms_SmsController extends My_Controller 
{
	
	protected $tww;
	
	public function ini()
	{
		
		define("__TWW_NUMUSU__", 'naiche');
		define("__TWW_SENHA__",  'funk557733');
		define("__TWW_URL__",  'https://webservices2.twwwireless.com.br/reluzcap/');
		
		$this->tww = new TWWLibrary();
		
		$users = array(
			'deco'=>'123',
			'kaique'=>'123',
		    'sarah'=>'123'
		);
		
		if ( count ( $users[$_REQUEST['user']] ) == 0 || $users[$_REQUEST['user']] != $_REQUEST['pass']){
			
			$retorno = array(
				'retorno'=>'false',
				'msg'=>'User ou Pass incorretos.'
			);
			
			echo json_encode( $retorno ); exit;
			
		}
		
	}
	
	public function envioAction()
	{
		
		header('Content-type: application/json');
		
		$post = $_REQUEST;

		// CASO CEL ESTEJA VAZIO
		if ( empty( $post['cel'] ) ) {
			
			$retorno = array(
				'retorno'=>'false',
				'msg'=>'Campo cel vazio.'
			);
		
		// CASO MSG ESTEJA vazio
		} else if ( empty( $post['msg'] ) ) {
			
			$retorno = array(
				'retorno'=>'false',
				'msg'=>'Campo msg vazio.'
			);
		
		// CASO NÃO TENHA USER
		} else if ( empty( $post['user'] ) ) {
				
			$retorno = array(
				'retorno'=>'false',
				'msg'=>'Campo user vazio.'
			);
			
		// CASO NÃO TENHA PASS
		} else if ( empty( $post['pass'] ) ) {
		
			$retorno = array(
				'retorno'=>'false',
				'msg'=>'Campo pass vazio.'
			);
					
		// CASO ESTEJA TODOS CAMPOS PREENCHIDOS
		} else {
			
			$celular = $post['cel'];
			$msg = preg_replace(array("/(ç)/","/(á|à|ã|â|ä)/","/(Á|À|Ã|Â|Ä)/","/(é|è|ê|ë)/","/(É|È|Ê|Ë)/","/(í|ì|î|ï)/","/(Í|Ì|Î|Ï)/","/(ó|ò|õ|ô|ö)/","/(Ó|Ò|Õ|Ô|Ö)/","/(ú|ù|û|ü)/","/(Ú|Ù|Û|Ü)/","/(ñ)/","/(Ñ)/"),explode(" ","c a A e E i I o O u U n N"),$post['msg']);
			$referencia = $post['referencia'].'-'.$post['user'];
			
			$post['referencia'] = $referencia;
			
			// TENTA O ENVIO
			$envio = $this->tww->EnviaSMS( $celular, $msg, $referencia );
			
			// CASO NÃO RETORNE ERRO DA TWW
			if ( $envio != 'NOK' ){
					
				$retorno = array(
					'retorno'=>'true',
					'msg'=>'SMS enviado com sucesso',
					'request'=>$post,
					'tww'=>$envio
				);
					
			} else {
					
				$retorno = array(
					'retorno'=>'false',
					'msg'=>'Erro ao enviar SMS'
				);
					
			}
			
		}
			
		echo json_encode($retorno);	
		
	}
	
}