<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class Api_ContatosController extends My_Controller 
{
	
	public function getGeralAction()
	{
		
		// GET
		$get = $this->_request->getParams();
	
		// GET PAGINAÇÃO
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		$limit = $get['limit'] == NULL ? 1 : $get['limit'];
		$order = $get['order'] != NULL ? explode('_', $get['order']) : NULL;
	
		// WHERE
		$where = $get;
		unset($where['controller']);
		unset($where['module']);
		unset($where['action']);
		unset($where['p']);
		unset($where['limit']);
		unset($where['order']);
		unset($where['data_i']);
		unset($where['data_f']);
		unset($where['celular']);
		
		$db = new contatos();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->contatos),array('*'));
	
			$sql->joinLeft(array('LISTA'=>$this->config->tb->lista_contatos),
				'"SQL".id_lista = "LISTA".id_lista',array('*'));
		
			// WHERE INDIVIDUAL
			foreach($where as $key => $row):
				
				$is_array = explode(',', $row);
			
				if (count($is_array) > 0):
					$sql->where('"SQL".'.$key.' IN ('.$row.')');
				else:
					$sql->where($key.' = ?',$row);
				endif;
				
			endforeach;
		
			if ($get['celular']):
				$sql->where('"SQL".celular LIKE \'%'.$get['celular'].'%\' ');
			endif;
			
			// BUSCA POR PERIODO INICIAL
			if ($get['data_i']):
				$sql->where('"SQL".criado >= ?', $get['data_i']);
			endif;
		
			// BUSCA POR PERIODO FINAL
			if ($get['data_f']):
				$sql->where('"SQL".criado <= ?', $get['data_f']);
			endif;
		
			// ORDEM
			if (isset($order)):
				$sql->order('SQL.'.$order[0].' '.$order[1]);
			endif;
			
		$sql->setIntegrityCheck(false);
		
		$adapter = new Zend_Paginator_Adapter_DbSelect($sql);
		$paginator = new Zend_Paginator($adapter);
		$paginator->setItemCountPerPage ( $limit );
		$paginator->setPageRange ( 10 );
		$paginator->setCurrentPageNumber ( $pagina );
		$registros = $paginator->getCurrentItems();
		
		$result = array();
		$result['total_registros'] = $paginator->getTotalItemCount();
		$result['total_page'] = ceil($paginator->getTotalItemCount() / $limit);
		$result['paginacao'] = array();
		
		// PAGINAÇÃO
		$exibir = 5;
		
		for($i = $pagina-$exibir; $i <= $pagina-1; $i++){
			if($i > 0)
				$result['paginacao'][] = $i;
		}
		
		$result['paginacao'][] = floor($pagina);
		
		for($i = $pagina+1; $i < $pagina+$exibir; $i++){
			if($i <= $result['total_page'])
				$result['paginacao'][] = $i;
		}
		
		if ($result['total_page'] >= $pagina):
			$result['registros'] = $registros;
		endif;
	
		echo json_encode($result);
	
	}
	
	public function getDuplicadosAction()
	{
		
		// GET
		$get = $this->_request->getParams();
				
		$get['id_lista'] = base64_decode( $get['id_lista'] );
				
		$sql = new Zend_Db_Select($this->db);
		$sql->from(array('SQL'=>$this->config->tb->lista_contatos),array('*'));
			
		$sql->where(' "SQL".id_lista IN ( '.$get['id_lista'].' ) ');
		$sql->limit(1);
			
		$sql = $sql->query(Zend_Db::FETCH_OBJ);
		$total = count( $sql->fetchAll() );
		
		
		if ($total > 0){
		
			$query = '
				SELECT * FROM (
				SELECT id_contato, celular, ROW_NUMBER() OVER(PARTITION BY celular ) AS LINHA
				FROM zz_contatos
				WHERE id_lista IN ( '.$get['id_lista'].' )
				) CC
				WHERE CC.LINHA > 1';
			
			$db = new Zend_Db_Select($this->db);
			$sql = $db->getAdapter()->quoteInto($query, "");
			
			$registros = $db->getAdapter()->fetchAll($sql);
			
			$result = array();
			$result['total_registros'] = count ( $registros );
			$result['registros'] = $registros;
			
			echo json_encode($result);
		
		} else {
				
			echo 'Você não tem permissão para realizar essa ação.';
				
		}
		
	}
	
	public function statusDuplicadosAction()
	{
		
		$get = $this->_request->getParams();
		$id_lista = base64_decode($get['id_lista']);
		$id_usuario = base64_decode($get['token']);
		
		$this->edit = new Model_Data(new lista_contatos());
		$this->edit->_required(array('duplicados'));
		$this->edit->_notNull(array());
		
		$post['duplicados'] = $get['duplicados'];
		
		$lista = new lista_contatos();
		$valida = $lista->fetchAll('id_lista = '.$id_lista.' AND id_usuario = '.$id_usuario.' ');
		
		if ( count($valida) > 0 ){
			$this->edit->edit($id_lista,$post,NULL,Model_Data::ATUALIZA);
		}
		
	}
	
	public function delDuplicadosAction()
	{
		
		// GET
		$get = $this->_request->getParams();
		
		if ( empty( $get['token'] ) ){
			
			die('Credencial inválida.');
			
		} else {
			
			$get['token'] = base64_decode( $get['token'] );
			$get['id_lista'] = base64_decode( $get['id_lista'] );
			
		}
		
		$sql = new Zend_Db_Select($this->db);
		$sql->from(array('SQL'=>$this->config->tb->contatos),array('*'));
		
			$sql->joinLeft(array('LISTA'=>$this->config->tb->lista_contatos),
				'"SQL".id_lista = "LISTA".id_lista',array('*'));
			
			$sql->where(' "SQL".id_lista IN ( '.$get['id_lista'].' ) AND id_usuario = '.$get['token'].' ');
			$sql->limit(1);
			
		$sql = $sql->query(Zend_Db::FETCH_OBJ);
		$total = count( $sql->fetchAll() );
		
		
		if ($total > 0){
		
			$query = '
				DELETE FROM zz_contatos
				WHERE id_contato IN (SELECT id_contato FROM (SELECT id_contato,
                             ROW_NUMBER() OVER (partition BY celular) AS rnum
                     FROM zz_contatos WHERE id_lista IN ( '.$get['id_lista'].' ) ) t
             	 WHERE t.rnum > 1);';
			
			$db = new Zend_Db_Select($this->db);
			$sql = $db->getAdapter()->quoteInto($query, "");
			
			$result = $db->getAdapter()->fetchAll($sql);
			
			echo 'Contatos duplicados apagados com sucesso.';
		
		} else {
			
			echo 'Você não tem permissão para realizar essa ação.';
			
		}
		
	}
	
	public function getNaoDuplicadosAction()
	{
	
		// GET
		$get = $this->_request->getParams();
	
		$sql = new Zend_Db_Select($this->db);
		$sql->from(array('SQL'=>$this->config->tb->contatos),array("*"));
	
			$sql->where(' "SQL".id_lista IN ('.$get['id_lista'].') ');
			
			$sql->order('id_contato ASC');
			
			$sql->limit($get['limit'], $get['offset']);
			
		$sql = $sql->query(Zend_Db::FETCH_OBJ);
		$result['registros'] = $sql->fetchAll();
		
		echo json_encode($result); exit;
	
	}
	
	public function getListasAction()
	{
	
		// GET
		$get = $this->_request->getParams();
	
		// GET PAGINAÇÃO
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		$limit = $get['limit'] == NULL ? 1 : $get['limit'];
		$order = $get['order'] != NULL ? explode('-', $get['order']) : NULL;
	
		// WHERE
		$where = $get;
		unset($where['controller']);
		unset($where['module']);
		unset($where['action']);
		unset($where['p']);
		unset($where['limit']);
		unset($where['order']);
		unset($where['data_i']);
		unset($where['data_f']);
		unset($where['id_usuario']);
	
		$db = new lista_contatos();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->lista_contatos),array('*'));
	
		$sql->joinLeft(array('CONTATOS'=>$this->config->tb->contatos),
			'"SQL".id_lista = "CONTATOS".id_lista',array('count(id_contato) AS total_contatos'));
		
		// WHERE INDIVIDUAL
		foreach($where as $key => $row):
			
			$is_array = explode(',', $row);
			if (count($is_array) > 0):
				$sql->where('"SQL".'.$key.' IN ('.$row.')');
			else:
				$sql->where('"SQL".'.$key.' = ?',$row);
			endif;
				
		endforeach;
		
		// BUSCA POR USUARIO
		if ($get['id_usuario']):
			$sql->where('"SQL".id_usuario IN ('.$get['id_usuario'].')');
		endif;
	
		// BUSCA POR PERIODO INICIAL
		if ($get['data_i']):
			$sql->where('"SQL".criado >= ?', $get['data_i']);
		endif;
	
		// BUSCA POR PERIODO FINAL
		if ($get['data_f']):
			$sql->where('"SQL".criado <= ?', $get['data_f']);
		endif;
	
		// ORDEM
		if (isset($order)):
			$sql->order('SQL.'.$order[0].' '.$order[1]);
		endif;
		
		$sql->group('SQL.id_lista');
			
		$sql->setIntegrityCheck(false);
	
		$adapter = new Zend_Paginator_Adapter_DbSelect($sql);
		$paginator = new Zend_Paginator($adapter);
		$paginator->setItemCountPerPage ( $limit );
		$paginator->setPageRange ( 10 );
		$paginator->setCurrentPageNumber ( $pagina );
		$registros = $paginator->getCurrentItems();
	
		$result = array();
		$result['total_registros'] = $paginator->getTotalItemCount();
		$result['total_page'] = ceil($paginator->getTotalItemCount() / $limit);
		$result['paginacao'] = array();
	
		// PAGINAÇÃO
		$exibir = 5;
		
		for($i = $pagina-$exibir; $i <= $pagina-1; $i++){
			if($i > 0)
				$result['paginacao'][] = $i;
		}
		
		$result['paginacao'][] = floor($pagina);
		
		for($i = $pagina+1; $i < $pagina+$exibir; $i++){
			if($i <= $result['total_page'])
				$result['paginacao'][] = $i;
		}
	
		if ($result['total_page'] >= $pagina):
			$result['registros'] = $registros;
		endif;
	
		echo json_encode($result);
	
	}
	
	public function delContatoAction()
	{
		
		$post = $this->_request->getPost();
		
		$this->data = new Model_Data(new contatos());
		$this->data->_required(array('id_contato'));
		$this->data->_notNull(array());

		$lista_contatos = new lista_contatos();
		
		foreach( $post['ids']['id'] as $row ){
			
			$fetch = $lista_contatos->fetchAll("id_lista = '".$post['id_lista']."' AND id_usuario = '".$post['id_usuario']."'  ");
			
			if ( count ( $fetch ) > 0 ) {
			
				$this->data->_table()->getAdapter()->query('DELETE FROM zz_contatos WHERE id_contato = '.$row.' ');
			
			}
			
		}
		
	}
	
	
	public function delContatoUniqueAction()
	{
	    
	    $post = $this->_request->getParams();
	    
	    $this->data = new Model_Data(new contatos());
	    $this->data->_required(array('id_contato'));
	    $this->data->_notNull(array());
	    
	    $lista_contatos = new lista_contatos();
	    
        $fetch = $lista_contatos->fetchAll("id_lista = '".$post['id_lista']."' AND id_usuario IN ('".$post['id_usuario']."')  ");
        
        if ( count ( $fetch ) > 0 ) {
            
            $this->data->_table()->getAdapter()->query('DELETE FROM zz_contatos WHERE id_contato = '.$post['id_contato'].' ');
            
        }
	        
	    
	}
	
	public function editContatoAction()
	{
		
		$post = $this->_request->getPost();
		$get = $this->_request->getParams();
		$upt = $this->upt($post, $get['id_contato']);
		echo $upt; exit;
		
	}
	
	public function newContatoAction()
	{
		
		$post = $this->_request->getPost();
		$upt = $this->upt($post);
		echo $upt; exit;
		
	}
	
	public function newListaAction()
	{
	    
	    $post = $_REQUEST;
	    
	    $this->data = new Model_Data(new lista_contatos());
	    $this->data->_required(array('lista','id_usuario', 'oculto'));
	    $this->data->_notNull(array());
	    
        $new = $this->data->edit(NULL, $post, NULL, Model_Data::NOVO);
	    
        echo $new; exit;
        
	}
	
	public function newContatoMultiplosAction()
	{

		$camposBanco = array(
			'id_contato', 
			'id_lista', 
			'nome', 
			'sobrenome', 
			'data_nascimento', 
			'email', 
			'celular', 
			'campo1', 
			'campo2', 
			'campo3', 
			'campo4', 
			'campo5', 
			'campo6', 
			'campo7', 
			'campo8', 
			'campo9', 
			'campo10', 
			'campo11', 
			'editavel_1', 
			'editavel_2', 
			'editavel_3', 
			'editavel_4', 
			'editavel_5', 
			'editavel_6', 
			'editavel_7', 
			'editavel_8', 
			'editavel_9', 
			'editavel_10', 
			'editavel_11', 
			'editavel_12', 
			'editavel_13', 
			'editavel_14', 
			'editavel_15', 
			'editavel_16', 
			'editavel_17', 
			'editavel_18', 
			'editavel_19', 
			'editavel_20', 
			'editavel_21', 
			'editavel_22', 
			'editavel_23', 
			'editavel_24', 
			'editavel_25', 
			'editavel_26', 
			'editavel_27', 
			'editavel_28', 
			'editavel_29',
			'editavel_30', 
			'editavel_31', 
			'editavel_32', 
			'editavel_33', 
			'editavel_34', 
			'editavel_35', 
			'editavel_36', 
			'editavel_37', 
			'editavel_38', 
			'editavel_39', 
			'editavel_40', 
			'modificado', 
			'criado',
			'linha_arquivo',
			'nome_arquivo',
		    'referencia'
		);
		
		$post = $this->_request->getPost();
		$cabecalho = $post['cabecalho'];
		unset( $post['cabecalho'] );
		
		// MONTANDO OS CAMPOS QUE ESTÁ RECEBENDO.
		$i=0;
		$campos = NULL;
		$camposArray = array();
		
		if ( $cabecalho == 'nao' ) {
			$first = $post[0];
		} else {
			$first = $post[1];
		}
		
		
		foreach($first as $key => $row){
			
			if (in_array($key, $camposBanco, true)){
				
				$camposArray[$i][$key] = $row;
				$campos .= $key.',';
				
			}
			
			$i++;
			
		}
		
		// MONTA QUERY DO INSERT SÓ COM OS CAMPOS
		$query = 'INSERT INTO zz_contatos ('.$campos.' criado) VALUES ';
		
		$total = count($post);
		$i=1;
		
		foreach($post as $key => $row){
				
			// LIMPA DOS CAMPOS INDIVIDUALMENTE
			foreach($row as $keyCampo => $camposLimpos){
				
				if (in_array($keyCampo, $camposBanco, true)){
					$row[$keyCampo] = $this->antiInjection($camposLimpos);
				} else {
					unset($row[$keyCampo]);
				}
				
			}
			
			if ( count ( $camposArray ) == count( $row ) ) {
				
				$myResult = implode("','", $row);
			
			}
			
			
			if ($i != $total){
				$query .= "('".$myResult."', '".date('Y-m-d H:i:s')."'),";
			} else {
				$query .= "('".$myResult."', '".date('Y-m-d H:i:s')."');";
			}
		
			$i++;
			
			
		}
		
		
		$query = substr($query, 0, -1).';';
		
		$db = new Zend_Db_Select($this->db);
		$sql = $db->getAdapter()->quoteInto($query, "");
		
		$result = $db->getAdapter()->fetchAll($sql);
		
		// DELETA CONTATOS IGUAIS
		$sql = $db->getAdapter()->quoteInto('
			DELETE FROM zz_contatos
				WHERE id_contato IN (
					SELECT id_contato FROM (SELECT id_contato,
                	ROW_NUMBER() OVER (partition BY id_lista, nome, sobrenome, data_nascimento, email, celular, campo1, campo2, campo3, campo4, campo5, campo6, campo7, campo8, campo9, campo10, campo11, editavel_1, editavel_2, editavel_3, editavel_4, editavel_5, editavel_6, editavel_7, editavel_8, editavel_9, editavel_10, editavel_11, editavel_12, editavel_13, editavel_14, editavel_15, editavel_16, editavel_17, editavel_18, editavel_19, editavel_20, editavel_21, editavel_22, editavel_23, editavel_24, editavel_25, editavel_26, editavel_27, editavel_28, editavel_29, editavel_30, editavel_31, editavel_32, editavel_33, editavel_34, editavel_35, editavel_36, editavel_37, editavel_38, editavel_39, editavel_40, linha_arquivo, nome_arquivo ) AS rnum
					FROM zz_contatos WHERE id_lista IN ( '.$first['id_lista'].' ) ) t
			WHERE t.rnum > 1);', "");
		$result = $db->getAdapter()->fetchAll($sql);
		
		// DELETA CONTATOS COM NUMERO VAZIO
		$sql = $db->getAdapter()->quoteInto('DELETE FROM zz_contatos WHERE id_lista IN ( '.$first['id_lista'].' ) AND celular = \'\';', "");
		$result = $db->getAdapter()->fetchAll($sql);
		
		echo json_encode(['retorno'=>'true', 'query'=>$query]); exit;
		
	}
	
	private function antiInjection($sql){
		
		$sql = str_replace("'", "`", $sql);
		$sql = addslashes($sql);
		$sql = trim($sql);
		$sql = strip_tags($sql);
		$sql = (get_magic_quotes_gpc()) ? $sql : addslashes($sql);
		return $sql;
		
	}
	
	protected function upt($post, $id = NULL)
	{
		
		$this->edit = new Model_Data(new contatos());
		$this->edit->_required(
			array(
			    'referencia',
				'id_contato', 
				'id_lista', 
				'nome', 
				'sobrenome', 
				'data_nascimento', 
				'email', 
				'celular', 
				'campo1', 
				'campo2', 
				'campo3', 
				'campo4', 
				'campo5', 
				'campo6', 
				'campo7', 
				'campo8', 
				'campo9', 
				'campo10', 
				'campo11', 
				'editavel_1', 
				'editavel_2', 
				'editavel_3', 
				'editavel_4', 
				'editavel_5', 
				'editavel_6', 
				'editavel_7', 
				'editavel_8', 
				'editavel_9', 
				'editavel_10', 
				'editavel_11', 
				'editavel_12', 
				'editavel_13', 
				'editavel_14', 
				'editavel_15', 
				'editavel_16', 
				'editavel_17', 
				'editavel_18', 
				'editavel_19', 
				'editavel_20', 
				'editavel_21', 
				'editavel_22', 
				'editavel_23', 
				'editavel_24', 
				'editavel_25', 
				'editavel_26', 
				'editavel_27', 
				'editavel_28', 
				'editavel_29',
				'editavel_30', 
				'editavel_31', 
				'editavel_32', 
				'editavel_33', 
				'editavel_34', 
				'editavel_35', 
				'editavel_36', 
				'editavel_37', 
				'editavel_38', 
				'editavel_39', 
				'editavel_40', 
				'modificado', 
				'criado'
			)
		);
		
		$this->edit->_notNull(array());
		 
		if ($id){
			$sql = $this->edit->edit($id,$post,NULL,Model_Data::ATUALIZA);
		} else {
			$sql = $this->edit->edit(NULL,$post,NULL,Model_Data::NOVO);
		}
		
		return $sql;
		
	}
		
}