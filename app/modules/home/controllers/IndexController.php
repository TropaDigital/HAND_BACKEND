<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class IndexController extends My_Controller 
{
	
	public function ini()
	{
	}
	
	public function testeAction()
	{
	
		if ( $_GET['p'] ){
			$pagina = $_GET['p'];
		} else {
			$pagina = 0;
		}
		
		$relatorio = new Zend_Db_Select($this->db);
		$relatorio->from(array('ENVIADOS'=>$this->config->tb->sms_enviados),array('*'));
		
		$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
		$this->view->result = $relatorio->fetchAll();
		
		//PAGINACAO
		$paginator = Zend_Paginator::factory ( $this->view->result );
		// Seta a quantidade de registros por página
		$paginator->setItemCountPerPage ( 50 );
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
		
		echo json_encode($result);
		
		exit;
	}
	
	public function caixaEntradaAction()
	{
		
		$params = $this->_request->getParams();
	
		if ( $_GET['p'] ){
			$pagina = $_GET['p'];
		} else {
			$pagina = 0;
		}
		
		if (!$params['data_inicio']){
			$params['data_inicio'] = date('Y-m-01');
		}
		
		if (!$params['data_final']){
			$params['data_final'] = date("Y-m-t");
		}
		
		$relatorio = new Zend_Db_Select($this->db);
		$relatorio->from(array('ENVIADOS'=>$this->config->tb->sms_enviados),array('message_id', 'id_campanha'))
		
			->joinLeft(array('CALLBACK'=>$this->config->tb->callback_sms),
				'"CALLBACK".mt_message_id = "ENVIADOS".message_id',array('*'))
		
			->where('"ENVIADOS".id_usuario = \''.$params['id_usuario'].'\' ')
			->group($this->groupBy('callback_sms,sms_enviados', 'CALLBACK,ENVIADOS', 'id_callback,id_sms_enviado'));
		
			$relatorio->where('"CALLBACK".criado >= \''.$params['data_i_c'].'\' ');
			
			if ($params['data_f_c']):
				$relatorio->where('"CALLBACK".criado <= \''.$params['data_f_c'].'\' ');
			endif;
			
			if ($params['celular']){
				$relatorio->where('"ENVIADOS".celular LIKE \'%'.$params['celular'].'%\' ');
			}
			
			if ($params['campanha']){
				$relatorio->where('"ENVIADOS".campanha LIKE \'%'.$params['campanha'].'%\' ');
			}
			
		$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
		$this->view->sms = $relatorio->fetchAll();
		
		echo json_encode($this->view->sms); exit;
		
	}
	
	public function newContatoAction()
	{
		
		$post = $this->_request->getPost();
		
		$this->contatos = new Model_Data(new contatos());
		$this->contatos->_required(array('id_contato', 'id_lista', 'nome', 'sobrenome', 'data_nascimento', 'email', 'celular', 'campo1', 'campo2', 'campo3', 'campo4', 'campo5', 'campo6', 'campo7', 'campo8', 'campo9', 'campo10', 'campo11', 'editavel_1', 'editavel_2', 'editavel_3', 'editavel_4', 'editavel_5', 'editavel_6', 'editavel_7', 'editavel_8', 'editavel_9', 'editavel_10', 'editavel_11', 'editavel_12', 'editavel_13', 'editavel_14', 'editavel_15', 'editavel_16', 'editavel_17', 'editavel_18', 'editavel_19', 'editavel_20', 'editavel_21', 'editavel_22', 'editavel_23', 'editavel_24', 'editavel_25', 'editavel_26', 'editavel_27', 'editavel_28', 'editavel_29', 'editavel_30', 'editavel_31', 'editavel_32', 'editavel_33', 'editavel_34', 'editavel_35', 'editavel_36', 'editavel_37', 'editavel_38', 'editavel_39', 'editavel_40', 'modificado', 'criado'));
		$this->contatos->_notNull(array('id_lista', 'celular'));
		
		$new = $this->contatos->edit(NULL,$post,NULL,Model_Data::NOVO);
		
		echo json_encode($new); exit;
		
	}
	
	public function listaAtualAction()
	{
	
		$post = $this->_request->getPost();
		$params = $this->_request->getParams();
	
		$lista_contatos = new Zend_Db_Select($this->db);
		$lista_contatos->from(array('LISTA'=>$this->config->tb->lista_contatos),array('*'));
		
		if ($post['id_usuario']){
			$lista_contatos->where('id_usuario = '.$post['id_usuario']);
		}
		
		if ($params['id_usuario']){
			$lista_contatos->where('id_usuario = '.$params['id_usuario']);
		}
		
		if ($post['id_lista']){
			$lista_contatos->where('id_lista = '.$post['id_lista']);
		}
		
		if ($params['id_lista']){
			$lista_contatos->where('id_lista = '.$params['id_lista']);
		}
		
		$lista_contatos = $lista_contatos->query(Zend_Db::FETCH_OBJ);
		$this->view->list = $lista_contatos->fetchAll();
	
		echo json_encode($this->view->list); exit;
	
	}
	
	public function contatosAction()
	{
	
		$post = $this->_request->getPost();
		$params = $this->_request->getParams();
		
		$contatos = new Zend_Db_Select($this->db);
		$contatos->from(array('lista_contatos'=>$this->config->tb->lista_contatos),array('*'))
		
			->joinLeft(array('contatos'=>$this->config->tb->contatos),
				'lista_contatos.id_lista = contatos.id_lista',array('*'));
				
			if ($post['id_usuario']){
				$contatos->where('"lista_contatos".id_usuario = '.$post['id_usuario']);
			}
			
			if ($params['id_usuario']){
				$contatos->where('"lista_contatos".id_usuario = '.$params['id_usuario']);
			}
			
			if ($params['id']){
				$contatos->where('"lista_contatos".id_lista = '.$params['id']);
			}
			
			if ($post['id_contato']){
				$contatos->where('"contatos".id_contato = '.$post['id_contato']);
			}
			
			if ($params['id_contato']){
				$contatos->where('"contatos".id_contato = '.$params['id_contato']);
			}
			
		$contatos = $contatos->query(Zend_Db::FETCH_OBJ);
		$this->view->list = $contatos->fetchAll();
		
		echo json_encode($this->view->list); exit;
	
	}
	
	public function pageContatosAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		if ($_GET['t'] == 'c'){
		
			$this->view->id_lista = $this->id_lista = $params['id_lista'];
		
			$contatos = new Zend_Db_Select($this->db);
			$contatos->from(array('contatos'=>$this->config->tb->contatos),array('count(id_contato) AS total'));
				
				$contatos->where('id_lista = '.$params['id_lista'].'');
				
				if ($params['celular']){
					$contatos->where("celular LIKE '%".$params['celular']."%'");
				}
				
			$contatos = $contatos->query(Zend_Db::FETCH_OBJ);
			$this->view->result = $contatos->fetchAll();
			
			//verifica a página atual caso seja informada na URL, senão atribui como 1ª página
			$pagina = (isset($_GET['p']))? $_GET['p'] : 1;
			//conta o total de itens
			$total = $this->view->result[0]->total;
			// quantos por página
			$registros = $post['total_pag'];
			//calcula o número de páginas arredondando o resultado para cima
			$numPaginas = ceil($total/$registros);
			//variavel para calcular o início da visualização com base na página atual
			$inicio = ($registros*$pagina)-$registros;
			
			$contatos = new Zend_Db_Select($this->db);
			$contatos->from(array('contatos'=>$this->config->tb->contatos),array('*'));
			
				$contatos->where('id_lista = '.$params[id_lista].' '.$wherelike.'');
				$contatos->limit($registros, $inicio);
				
				if ($params['celular']){
					$contatos->where("celular LIKE '%".$params['celular']."%'");
				}
				
			$contatos = $contatos->query(Zend_Db::FETCH_OBJ);
			$this->view->result = $contatos->fetchAll();
			
			if ($post['getpaginacao']):
			
				echo $numPaginas; exit;
			
			else:
			
				echo json_encode($this->view->result); exit;
			
			endif;
		
		} else {
			
			$lista_contatos = new Zend_Db_Select($this->db);
			$lista_contatos->from(array('lista_contatos'=>$this->config->tb->lista_contatos),array('*'))
				
				->joinLeft(array('contatos'=>$this->config->tb->contatos),
						'lista_contatos.id_lista = contatos.id_lista',array('count(id_contato) AS total'))
						
				->where('lista_contatos.id_usuario = '.$post['id_usuario'].'')
				->group($this->groupBy('lista_contatos', 'lista_contatos', 'id_lista'));
						
			$lista_contatos = $lista_contatos->query(Zend_Db::FETCH_OBJ);
			$this->view->lista_contatos = $lista_contatos->fetchAll();
			
			echo json_encode($this->view->lista_contatos); exit;
	
		}
		
	}
	
	public function updateContatoAction()
	{
		
		$this->edit= new Model_Data(new contatos());
		$this->contatos->_required(array('id_contato', 'id_lista', 'nome', 'sobrenome', 'data_nascimento', 'email', 'celular', 'campo1', 'campo2', 'campo3', 'campo4', 'campo5', 'campo6', 'campo7', 'campo8', 'campo9', 'campo10', 'campo11', 'editavel_1', 'editavel_2', 'editavel_3', 'editavel_4', 'editavel_5', 'editavel_6', 'editavel_7', 'editavel_8', 'editavel_9', 'editavel_10', 'editavel_11', 'editavel_12', 'editavel_13', 'editavel_14', 'editavel_15', 'editavel_16', 'editavel_17', 'editavel_18', 'editavel_19', 'editavel_20', 'editavel_21', 'editavel_22', 'editavel_23', 'editavel_24', 'editavel_25', 'editavel_26', 'editavel_27', 'editavel_28', 'editavel_29', 'editavel_30', 'editavel_31', 'editavel_32', 'editavel_33', 'editavel_34', 'editavel_35', 'editavel_36', 'editavel_37', 'editavel_38', 'editavel_39', 'editavel_40', 'modificado', 'criado'));
		$this->edit->_notNull(array());
		 
		$post = $this->_request->getPost();
		$params = $this->_request->getParams();
		 
		$edt = $this->edit->edit($params['id_contato'],$post,NULL,Model_Data::ATUALIZA);
		 
		echo json_encode($edt);exit;
		
	}
	
	public function updateListaAction()
	{
		
		$this->edit= new Model_Data(new lista_contatos());
		$this->edit->_required(array('id_lista','lista','modificado', 'criado'));
		$this->edit->_notNull(array());
		
		$post = $this->_request->getPost();
		$params = $this->_request->getParams();
		
		$edt = $this->edit->edit($params['id_lista'],$post,NULL,Model_Data::ATUALIZA);
		
		echo json_encode($edt);exit;
		
	}
	
	public function novaListaAction()
	{
		
		$this->listas = new Model_Data(new lista_contatos());
		$this->listas->_required(array("id_lista", "id_usuario", "lista", "modificado", "criado"));
		$this->listas->_notNull(array("lista"));
		
		$params = $this->_request->getParams();
    	$post = $this->_request->getPost();
		
		$edt = $this->listas->edit(NULL,$post,NULL,Model_Data::NOVO);
		 
		if ($edt){
			echo json_encode(array('error'=>'true','id'=>$edt));
		} else {
			echo json_encode(array('error'=>'false'));
		}
		exit;
		
	}
	
	public function deletaListaAction()
	{
		
		$this->listas = new Model_Data(new lista_contatos());
		$this->listas->_required(array("id_lista", "id_usuario", "lista", "modificado", "criado"));
		$this->listas->_notNull(array("lista"));
		
		$this->contatos = new Model_Data(new contatos());
		$this->contatos->_required(array("id_contato", "id_lista"));
		$this->contatos->_notNull(array());
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		$this->listas->_table()->getAdapter()->query('DELETE FROM zz_lista_contatos WHERE id_lista = '.$params[id].' AND id_usuario = '.$post[id_usuario].'');
		$this->contatos->_table()->getAdapter()->query('DELETE FROM zz_contatos WHERE id_lista = '.$params[id].' ');
		
		exit;
		
	}
	
	public function selectListaAction()
	{
		 
		 
		$post = $this->_request->getPost();
		$lista_contatos = new lista_contatos();
		$this->view->lista_contatos = $lista_contatos->fetchAll('id_usuario = '.$post['id_usuario'].'');
		 
		echo '<select onchange="ajax_lista_all'.$_GET["class"].'(\''.$_GET[id].'\');" class="lista lista_contato_modal lista_contato'.$_GET["class"].' select_lista" style="width:100%;">';
		echo '<option value="">Selecione uma lista</option>';
		foreach($this->view->lista_contatos as $row){
			echo '<option value="'.$row[id_lista].'">'.$row[lista].'</option>';
		}
		echo '</select>';
		 
		exit;
	}
	
	public function novoContatoAction()
	{
		 
		$this->contatos= new Model_Data(new contatos());
		$this->contatos->_required(array('id_contato', 'id_lista', 'nome', 'sobrenome', 'data_nascimento', 'email', 'celular', 'modificado', 'criado'));
		$this->contatos->_notNull(array('id_lista', 'celular'));
		
		$post = $this->_request->getPost();
		
		$celular = str_replace('(', '', $post['celular_contato']);
		$celular = str_replace(' ', '', $celular);
		$celular = str_replace(')', '', $celular);
		$celular = str_replace('-', '', $celular);
		$post['nome'] = $post['nome_contato'];
		$post['sobrenome'] = $post['sobrenome_contato'];
		$post['id_lista'] = $post['lista_contato'];
		$post['email'] = $post['email_contato'];
		$post['celular'] = $celular;
		$post['data_nascimento'] = $post['data_nascimento'];
		 
		$edt = $this->contatos->edit(NULL,$post,NULL,Model_Data::NOVO);
		
		if ($edt){
			echo 'true';
		} else {
			echo 'false';
		}
		
		exit;
		
	}
	
	public function delContatoAction()
	{
		
		$post = $this->_request->getPost();
		$params = $this->_request->getParams();
		
		$this->contatos= new Model_Data(new contatos());
		$this->contatos->_required(array('id_contato', 'id_lista', 'nome', 'sobrenome', 'data_nascimento', 'email', 'celular', 'modificado', 'criado'));
		$this->contatos->_notNull(array('id_lista', 'celular'));
		
		$this->contatos->_table()->getAdapter()->query('DELETE FROM zz_contatos WHERE id_contato = '.$post['id'].'');
		
	}
    
}