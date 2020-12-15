<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class Api_CallbackController extends My_Controller 
{
	
	public function ini ()
	{
		
		
	}
	
	public function twwAction()
	{
		
		$explode = explode('-', $_REQUEST['Seunum']);
		
		$post = array();
		$post['referencia'] = $explode[0];
		$post['celular'] = $_REQUEST['Celular'];
		$post['status'] = $_REQUEST['Status'];
		$post['data'] = $_REQUEST['Data'];
		
		if ( $post['data'] == NULL ){
			$post['data'] = $_REQUEST['Data do status'];
		}
		
		$post['textostatus'] = $_REQUEST['TextoStatus'];
		$post['operadora'] = $_REQUEST['Operadora'];
		
		$callback = new callback_tww();
		$total = $callback->fetchAll("referencia = '".$post['referencia']."' ");
		$total = count( $total );
		
		$this->data = new Model_Data(new callback_tww());
		$this->data->_required(array('id_callback','referencia','celular','status','data','textostatus','operadora'));
		$this->data->_notNull(array(''));
		
		if ( $total == 0 ){
			$enviado = $this->data->edit(NULL,$post,NULL,Model_Data::NOVO);
		}
		
		$db = new contatos();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->sms_enviados),array('*'));
		
			$sql->joinLeft(array('CALLBACK'=>$this->config->tb->callback_tww),
				'"SQL".id_sms_enviado = "CALLBACK".referencia',array('*'));
		
		$sql->setIntegrityCheck(false);
		
		$adapter = new Zend_Paginator_Adapter_DbSelect($sql);
		$paginator = new Zend_Paginator($adapter);
		$paginator->setItemCountPerPage ( $limit );
		$paginator->setPageRange ( 10 );
		$paginator->setCurrentPageNumber ( $pagina );
		$registros = $paginator->getCurrentItems();
		
		if ($enviado):
		
			echo 'true';
		
		else:
		
			echo 'false';
		
		endif;
		
		exit;
		
	}
	
	private function sanitizeString($string) {

	    $string = utf8_encode($string);
	    
	    return preg_replace(array("/(á|à|ã|â|ä)/","/(Á|À|Ã|Â|Ä)/","/(é|è|ê|ë)/","/(É|È|Ê|Ë)/","/(í|ì|î|ï)/","/(Í|Ì|Î|Ï)/","/(ó|ò|õ|ô|ö)/","/(Ó|Ò|Õ|Ô|Ö)/","/(ú|ù|û|ü)/","/(Ú|Ù|Û|Ü)/","/(ñ)/","/(Ñ)/"),explode(" ","a A e E i I o O u U n N"),$string);
	    
	}
	
	public function moAction()
	{
	
		$post = array();
		$post['operadora'] = $this->sanitizeString( $_REQUEST['Operadora'] );
		$post['mensagem'] = $this->sanitizeString( $_REQUEST['Mensagem'] );
		$post['celular'] = $_REQUEST['Celular'];
		$post['shnum'] = $_REQUEST['Shnum'];
		$post['seunum'] = $_REQUEST['SeuNum'];
		$post['data'] = $_REQUEST['Data'];
	
		$this->data = new Model_Data(new callback_tww_mo());
		$this->data->_required(array('id_mo','operadora','mensagem','celular','shnum','seunum','data','criado'));
		$this->data->_notNull(array(''));
	
		$enviado = $this->data->edit(NULL,$post,NULL,Model_Data::NOVO);
	
		if ($enviado):
			echo 'true';
		else:
			echo 'false';
		endif;
	
		exit;
	
	}
	
	public function insereCallbackAction()
	{
		
		$caminho = $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_callback/';
		
		$openScan = scandir($caminho);
		$primeiro = $openScan[2];
		
		$arquivoEscreve = $caminho.$primeiro;
		
		$arquivo = file($arquivoEscreve);
		
		// CRIA UM POST PARA SER REUTILIZADO CASO PRECISE E DEIXA O ARRAY COMPLETO, BUNITINHU
		$post = array();
		
		for($i = 0; $i < 100; $i++) {
			
			if ( $arquivo[$i] ){
				
				$row = json_decode( $arquivo[$i] );
				
				$explode = explode('-', $row->Seunum);
				
				$post[$i]['referencia'] = $explode[0];
				$post[$i]['celular'] = $row->Celular;
				$post[$i]['status'] = $row->Status;
				$post[$i]['data'] = $row->Data;
				$post[$i]['textostatus'] = $row->TextoStatus;
				$post[$i]['operadora'] = $row->Operadora;
				
				unset($arquivo[$i]);
				
			}
			
		}
		
// 		echo '<pre>';
// 		print_r($post);
// 		exit;
		
		// RESCREVE O ARQUIVO SEM ESSAS LINHAS
		file_put_contents( $arquivoEscreve, $arquivo );
		
		// MONTA QUERY DO INSERT SÓ COM OS CAMPOS
		$query = 'INSERT INTO zz_callback_tww ( referencia, celular, status, data, textostatus, criado, operadora ) VALUES ';
		
		if ( count ( $post ) > 0 ){
		
			// MONTA OS CAMPOS
			$i=1;
			foreach($post as $key => $row){
			
				$row = (object)$row;
					
				if ( count($post) == $i ){
					$query .= "( '".$row->referencia."', '".$row->celular."', '".$row->status."', '".$row->data."', '".$row->textostatus."', '".date('Y-m-d H:i:s')."', '".$row->operadora."' );";
				} else {
					$query .= "( '".$row->referencia."', '".$row->celular."', '".$row->status."', '".$row->data."', '".$row->textostatus."', '".date('Y-m-d H:i:s')."', '".$row->operadora."' ),";
				}
					
				$i++;
			
			}
			
			// INSERE NO BANCO
			$db = new Zend_Db_Select($this->db);
			$sql = $db->getAdapter()->quoteInto($query, "");
			
			$result = $db->getAdapter()->fetchAll($sql);
			
			$sqlDel = $db->getAdapter()->quoteInto('
				DELETE FROM zz_callback_tww
					WHERE id_callback IN (
						SELECT id_callback FROM (SELECT id_callback, ROW_NUMBER() OVER ( partition BY referencia ) AS rnum
						FROM zz_callback_tww ) t
				WHERE t.rnum > 1);', "");
			$resultDel = $db->getAdapter()->fetchAll($sqlDel);
			
			if ( count( $result ) == 0 ) {
				
				if ( ! file_exists( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_callback/error_log/' ) ) {
					
					mkdir( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_callback/error_log/', 0777, true );
					
				}
				
				$fp = fopen($_SERVER['DOCUMENT_ROOT'].'/lotes/txt_callback/error_log/'.time().'.txt', 'w');
				fwrite( $fp, $query );
				fclose( $fp );
				
			}
		
		}

	}
	
}