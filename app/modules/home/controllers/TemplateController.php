<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class TemplateController extends My_Controller 
{
	
	public function ini()
	{
	
	}
	
	public function formularioAction()
	{
		
		$post = $this->_request->getPost();
		
		$this->data = new Model_Data(new contato_campanha());
		$this->data->_required(array('id_contato_campanha', 'celular', 'campos', 'id_campanha', 'id_form', 'id_usuario', 'criado'));
		$this->data->_notNull(array('celular', 'campos'));
		
		$edt = $this->data->edit(NULL,$post,NULL,Model_Data::NOVO);
		
		echo json_encode($post); exit;
		
	}
	
	public function visualizacaoAction()
	{
		
		$post = $this->_request->getPost();
		
		$this->data = new Model_Data(new campanhas_visu());
		$this->data->_required(array('contato', 'id_campanha', 'id_usuario', 'unique'));
		$this->data->_notNull(array('contato', 'id_campanha', 'id_usuario'));
		
		$post['contato'] = $post['celular'];
		
		$validate = new campanhas_visu();
		$validate = $validate->fetchAll("id_campanha = '".$post['id_campanha']."' AND contato = '".$post['contato']."' ");
		
		if ( count( $validate ) > 0 ) {
			$post['unique'] = 1;
		} else {
			$post['unique'] = 0;
		}
		
		$edt = $this->data->edit(NULL,$post,NULL,Model_Data::NOVO);
		
		echo json_encode($edt); exit;
		
	}
	
	public function shorturlAction()
	{
	
		$post = $this->_request->getPost();
		
		// SELECT DA LANDING PAGE
		$sms_enviados = new Zend_Db_Select($this->db);
		$sms_enviados->from(array('ENVIADOS'=>$this->config->tb->sms_enviados),array('*'))
		
			->where('"ENVIADOS".shorturl = \''.$post['shorturl'].'\'');
		
		$sms_enviados = $sms_enviados->query(Zend_Db::FETCH_OBJ);
		$this->view->sms_enviados = $sms_enviados->fetchAll();
		
		echo json_encode($this->view->sms_enviados[0]); exit;
	
	}
	
	public function clickAction()
	{
	
		$post = $this->_request->getPost();
	
		$this->data = new Model_Data(new templates_click());
		$this->data->_required(array('id_click', 'acao', 'tipo_acao', 'id_campanha', 'contato', 'criado', 'unique', 'id_usuario'));
		$this->data->_notNull(array('contato', 'id_campanha'));
		
		$sms_enviados = new Zend_Db_Select($this->db);
		$sms_enviados->from(array('ENVIADOS'=>$this->config->tb->sms_enviados),array('*'))
		
			->where('"ENVIADOS".shorturl = \''.$post['shortUrl'].'\'');
		
		$sms_enviados = $sms_enviados->query(Zend_Db::FETCH_OBJ);
		$this->view->sms_enviados = $sms_enviados->fetchAll();

		$post['id_campanha'] =  $this->view->sms_enviados[0]->id_campanha;
		$post['contato'] =  $this->view->sms_enviados[0]->celular;
		
		$validate = new templates_click();
		$validate = $validate->fetchAll("id_campanha = '".$post['id_campanha']."' AND acao = '".$post['acao']."' AND tipo_acao = '".$post['tipo_acao']."' AND contato = '".$post['contato']."' ");
		
		if ( count( $validate ) > 0 ) {
			$post['unique'] = 1;
		} else {
			$post['unique'] = 0;
		}
		
		$edt = $this->data->edit(NULL,$post,NULL,Model_Data::NOVO);
	
		print_r($post);
		echo json_encode( $edt ); exit;
	
	}
	
	public function contatoAction()
	{
		
		$post = $this->_request->getPost();
		
		$contatos = new Zend_Db_Select($this->db);
		$contatos->from(array('CONTATO'=>$this->config->tb->contatos),array('*'))

			->joinLeft(array('LISTA'=>$this->config->tb->lista_contatos),
				'"LISTA".id_lista = "CONTATO".id_lista',array('id_usuario'))
		
			->where('"CONTATO".id_contato = \''.$post['id_contato'].'\'')
			->limit('1');
		
		$contatos = $contatos->query(Zend_Db::FETCH_OBJ);
		$this->view->contato = $contatos->fetchAll();
		
		echo json_encode($this->view->contato); exit;
		
	}
    
}