<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class EnvioController extends My_Controller 
{
	
	public function contatosDuplicadosAction()
	{
		
		$get = $this->_request->getParams();
		
		$sql = new Zend_Db_Select($this->db);
		$sql->from(array('CONTATOS'=>$this->config->tb->contatos),array('celular','count(*) AS total'));
		
			$sql->joinLeft(array('LISTA'=>$this->config->tb->lista_contatos),
				'"LISTA".id_lista = "CONTATOS".id_lista',array('lista'));
		
			$sql->where('"CONTATOS".id_lista IN ('.$get['id'].')');
			$sql->group(array('CONTATOS.celular','LISTA.lista'));
			$sql->having('COUNT(*) > 1');
		
		$sql = $sql->query(Zend_Db::FETCH_OBJ);
		$fetch = $sql->fetchAll();
		
		echo json_encode($fetch); exit;

		exit;
		
	}
	
	public function enviarAction()
	{
	
		if ($_GET['p']){
			$pagina = $_GET['p'];
		} else {
			$pagina = 1;
		}
		
		$post = $this->_request->getPost();
		$params = $this->_request->getParams();
		
		$listas = explode(',', $post['id_lista']);
		
		$contatos = new Zend_Db_Select($this->db);
		$contatos->from(array('CONTATOS'=>$this->config->tb->contatos),array('count(celular) AS repetidos','celular','SUM(id_contato) AS id_contato','SUM(id_lista) AS id_lista','nome','sobrenome','data_nascimento','email','campo1','campo2','campo3','campo4','campo5','campo6','campo7','campo8','campo9','campo10','campo11','editavel_1','editavel_2','editavel_3','editavel_4','editavel_5','editavel_6','editavel_7','editavel_8','editavel_9'));
		
			$contatos->where('"CONTATOS".id_lista IN ('.$post['id_lista'].')');
			$contatos->group(array('celular','nome','sobrenome','data_nascimento','email','campo1','campo2','campo3','campo4','campo5','campo6','campo7','campo8','campo9','campo10','campo11','editavel_1','editavel_2','editavel_3','editavel_4','editavel_5','editavel_6','editavel_7','editavel_8','editavel_9'));
			
		$contatos = $contatos->query(Zend_Db::FETCH_OBJ);
		$this->view->result = $contatos->fetchAll();
		
		if ($post['total']){
			echo count($this->view->result); exit;
		}
		
		// PAGINACAO
		$paginator = Zend_Paginator::factory ($this->view->result);
		// Seta a quantidade de registros por página
		$paginator->setItemCountPerPage ( 10 );
		// numero de paginas que serão exibidas
		$paginator->setPageRange ( 5 );
		// Seta a página atual
		$paginator->setCurrentPageNumber ( $pagina );
		// Passa o paginator para a view
		$this->view->result = $paginator;
		
		$result = array();
		
		foreach($this->view->result as $row){
			array_push($result, $row);
		}
		
		echo json_encode($result); exit;
		
	}
	
	public function newEnviadoAction()
	{
		
		$post = $this->_request->getPost();
		$params = $this->_request->getParams();
		
		$this->data = new Model_Data(new sms_enviados());
		$this->data->_required(array('id_sms_enviado','id_contato','id_landing_page','id_campanha','shorturl','celular','message_id','id_usuario','campanha','mensagem','criado','data_lote'));
		$this->data->_notNull(array());
		
		$enviado = $this->data->edit(NULL,$post,NULL,Model_Data::NOVO);
		echo $enviado; exit;
		
	}
	
	public function editEnviadoAction()
	{
	
		$get = $this->_request->getParams();
	
		$this->data = new Model_Data(new sms_enviados());
		$this->data->_required(array('id_sms_enviado','message_id'));
		$this->data->_notNull(array());
	
		$enviado = $this->data->edit($get['id'],$get,NULL,Model_Data::ATUALIZA);
		echo $enviado; exit;
	
	}
	
	public function newErroAction()
	{
		
		$post = $this->_request->getPost();
		$params = $this->_request->getParams();
		
		$this->data = new Model_Data(new sms_erros());
		$this->data->_required(array('id_erro', 'id_contato', 'id_landing_page', 'id_campanha', 'celular', 'shorturl', 'erro', 'id_usuario', 'campanha', 'mensagem', 'criado'));
		$this->data->_notNull(array());
		
		$erros = $this->data->edit(NULL,$post,NULL,Model_Data::NOVO);
		echo json_encode($erros); exit;
		
	}
	    
}