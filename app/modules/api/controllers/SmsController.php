<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class Api_SmsController extends My_Controller 
{
	
	public function ini()
	{
	}
	
	public function getCreditsAction()
	{
	    
	    
	    //         ESME_ROK -> Enviado (Enviado para operadora)
	    //         ACCEPTD -> Enviado (Enviado para operadora)
	    //         DELIVRD -> Entregue (Entrega confirmada no dispositivo)
	    //         UNDELIV -> Não Entregue (Mensagem não entregue a esse destinatário)
	    //         EXPIRED -> Expirada (Mensagem expirou o tempo de entrega)
	    //         REJECTED -> Rejeitada (Rejeitada pela operadora)
	    //         Quaisquer erro diferente dos acima -> Erro ao Enviar (Falha ao enviar a operadora)
	    
	    
	    $get = $this->_request->getParams();
	    
	    $id_usuario = $get['id_usuario'];
	    
	    $sql = new Zend_Db_Select($this->db);
	    $sql->from(array('SQL'=>$this->config->tb->sms_enviados),array('count(id_sms_enviado) AS total'));
	    
	    $sql->where('"SQL".status IN (\'ESME_ROK\',\'ACCEPTD\',\'DELIVRD\',\'UNDELIV\',\'EXPIRED\') ');
	    $sql->where('"SQL".id_usuario = '.$get['id_usuario'].' ');
	    
	    if ( $get['in_not_campanha'] ) {
	        $sql->where('"SQL".id_campanha NOT IN ('.$get['in_not_campanha'].')');
	    }
	    
	    if ( $get['d_i'] ){
	        $sql->where('"SQL".criado >= \''.$get['d_i'].' 00:00:00\' ');
	    }
	    
	    if ( $get['d_f'] ){
	        $sql->where('"SQL".criado <= \''.$get['d_f'].' 23:59:59\' ');
	    }
	    
	    $sql = $sql->query(Zend_Db::FETCH_OBJ);
	    $fetch = $sql->fetchAll();
	    
	    $response = array();
	    $response['total'] = $fetch['0']->total;
	    $response['id_usuario'] = $get['id_usuario'];
	    
	    echo json_encode($response); exit;
	    
	}
	
	public function downloadCampanhaAction()
	{
		
		$get = $this->_request->getParams();
		
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		$limit = $get['limit'] == NULL ? 1 : $get['limit'];
		
		$sql = new Zend_Db_Select($this->db);
		$sql->from(array('NEWSQL'=>$this->config->tb->sms_enviados),array('celular'));
		
			$sql->where("id_campanha = '176'");
			$sql->where("message_id = 'shorturl'");
			$sql->group('celular');
			$sql->limit(40000);
			// SO ALTERA O SEGUNDO
			
		$sql = $sql->query(Zend_Db::FETCH_OBJ);
		$registros = $sql->fetchAll();
		
		foreach($registros as $row){
			
			$row = (object)$row;
			
			$newsql = new Zend_Db_Select($this->db);
			$newsql->from(array('NEWSQL'=>$this->config->tb->sms_enviados),array('*'));
			
				$newsql->where("id_campanha = '176'");
				$newsql->where("message_id = 'shorturl'");
				$newsql->where("celular = '".$row->celular."'");
				$newsql->limit(1);
				
			$newsql = $newsql->query(Zend_Db::FETCH_OBJ);
			$shorturl = $newsql->fetchAll();
			
			echo $row->celular; echo ';'; echo $shorturl[0]->shorturl; echo '<br/>';
			
		}
		
		exit;
		
	}
	
	
	public function delEnviadosAction()
	{
		
		$this->data = new Model_Data(new sms_enviados());
		$this->data->_required(array('id_sms_enviado'));
		$this->data->_notNull(array(''));
		
		$del = $this->data->_table()->getAdapter()->query('DELETE FROM zz_sms_enviados WHERE id_sms_enviado = '.$_GET['id'].' ');
		echo $del; exit;
		
	}
	
	public function getEnviadosAction()
	{
	
		// GET
		$get = $this->_request->getParams();
		
	
		//if ( $get['teste'] == 'true' )
		//{
		//    die('teste mode on');
		//}
		
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
		
		/*
		 * PASSANDO VARIOS IDS POR CAUSA DA EMPRESA (não pegava os creditos gasto da empresa só do usuario) @capetão
		 */
		if ( $where['familia'] != '' && $where['familia'] != null )
		{
		    unset($where['id_usuario']);
		    unset($where['familia']);
		    
		    $where['id_usuario'] = $get['familia'];
		}

		/*
		 * 
		 */
		$db = new sms_enviados();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->sms_enviados),array('*'));

			// WHERE INDIVIDUAL
			foreach($where as $key => $row):
				
				$is_array = explode(',', $row);
					
				if (count($is_array) > 1):
					$sql->where('"SQL".'.$key.' IN ('.$row.')');
				else:
					$sql->where('"SQL".'.$key.' = ?',$row);
				endif;
			
			endforeach;
			
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
		$registros = $paginator;
		
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
			$result['registros'] = $registros->getCurrentItems();
		endif;
		
		echo json_encode($result);
		
	}
	
	public function getEnviarCampanhaAction()
	{
		
		// GET
		$get = $this->_request->getParams();
		
		$sql = new Zend_Db_Select($this->db);
		$sql->from(array('SQL'=>$this->config->tb->sms_enviados),array('*'));
		
			$sql->joinLeft(array('CONTATOS'=>$this->config->tb->contatos),
				'"SQL".id_contato = "CONTATOS".id_contato',array('*'));
		
			$sql->where(' "SQL".id_campanha = '.$get['id_campanha'].' ');
			$sql->where(' "SQL".status = \'criado\' ');
			
			
			$sql->order('id_sms_enviado ASC');
			
			$sql->limit($get['limit'], $get['offset']);
			
		$sql = $sql->query(Zend_Db::FETCH_OBJ);
		$result['registros'] = $sql->fetchAll();
		
		echo json_encode($result); exit;
		
	}
	
	public function getEnviadosRetornoAction()
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
		unset($where['download']);
		unset($where['arquivo']);
		unset($where['id_usuario_preview']);
	
		/*
		 * PASSANDO VARIOS IDS POR CAUSA DA EMPRESA (não pegava os creditos gasto da empresa só do usuario) @capetão
		 */
		if ( $where['familia'] != '' && $where['familia'] != null )
		{
		    //$arrFamilia = array();
		    //$arrFamilia = explode(',',$where['familia']);
		    
		    unset($where['id_usuario']);
		    unset($where['familia']);
		    
		    //$where['id_usuario'] = array_merge($arrFamilia,array('0'=>$get['id_usuario']));
		    //$where['id_usuario'] = $arrFamilia;
		    
		    $where['id_usuario'] = $get['familia'];
		}
		
		if ( $get['teste'] == 'true' )
		{
		    
		    //print_r($arrFamilia);
		    //echo "<br>";
		    
		    //print_r($get);
		    //echo "<br>";
		    
		    print_r($where);
		    echo "<br>";
		    
		    die('teste mode on');
		}
		
		/*
		 * 
		 */
		$db = new sms_enviados();
		$sql = $db->select()->from(array('ENVIADOS'=>$this->config->tb->sms_enviados),array('*'));
	
			if ($get['celular']):
			
				$sql->where("\"ENVIADOS\".celular LIKE '55".$get['celular']."'");
			
			endif;
			
			// WHERE INDIVIDUAL
			foreach($where as $key => $row):
				
				if (!empty($row)){
					$is_array = explode(',', $row);
				
					if (count($is_array) > 1):
						$sql->where('"SQL".'.$key.' IN ('.$row.')');
					else:
						$sql->where('"SQL".'.$key.' = ?',$row);
					endif;
				}
			
			endforeach;
				
			// BUSCA POR PERIODO INICIAL
			if ($get['data_i']):
				$sql->where('"SQL".data >= ?', $get['data_i']);
			endif;
				
			// BUSCA POR PERIODO FINAL
			if ($get['data_f']):
				$sql->where('"SQL".data <= ?', $get['data_f']);
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
		$registros = $paginator;
		
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
			$result['registros'] = $registros->getCurrentItems();
		endif;
	
		//if ( $get['teste'] == 'true' )
		//{
		//    die('teste mode on');
		//}
		
		echo json_encode($result);
	
	}
	
	public function insertSelectAction()
	{
		
		$post = $this->_request->getPost();
		
		$query = "
			INSERT INTO zz_sms_enviados 
			( id_contato, id_landing_page, id_campanha, celular, id_usuario, campanha, mensagem, criado, status )
			( SELECT 
			id_contato, '".$post['id_landing_page']."', '".$post['id_campanha']."', celular, '".$post['id_usuario']."', '".$post['campanha']."', '".$post['mensagem']."', '".date('Y-m-d H:i:s')."' , 'criado'
			FROM zz_contatos 
			WHERE id_lista IN (".$post['id_lista'].") 
			)";
		
		$db = new Zend_Db_Select($this->db);
		$sql = $db->getAdapter()->quoteInto($query, "");
		
		$result = $db->getAdapter()->fetchAll($sql);
		
		echo 'true'; exit;
		
	}
	
	public function updateMultiplosAction()
	{
		
		$post = $this->_request->getPost();
		
		$update = NULL;
		
		foreach($post as $row){
			
			$update .= "UPDATE zz_sms_enviados_control SET shorturl = '".$row['shorturl']."', celular = '".$row['celular']."', data_lote = '".$row['data_lote']."', status = '".$row['status']."', mensagem = '".$row['mensagem']."' WHERE id_sms_enviado = ".$row['id_sms_enviado']." LIMIT 1;<br/>";
			
		}
		
		print_r($update); exit;
		
	}
	
	public function insertMultiplosAction()
	{
		
		$post = $this->_request->getPost();
		$get = $this->_request->getParams();
	
		// MONTA QUERY DO INSERT SÓ COM OS CAMPOS
		$query = 'INSERT INTO zz_sms_enviados_control ( status, login_jasmin, smsc, id_contato, id_landing_page, id_campanha, shorturl, celular, id_usuario, campanha, mensagem, criado, data_lote, referencia) VALUES ';
	
		$total = count($post);
		
		if ( $total == 0 ) {
		    
		    die('true-insert');
		    
		}
	
		$postNew = array();
		foreach($post as $row){
		    if ( $row['celular'] ){
		        $postNew[] = (object)$row;
		    }
		}
		
		$i=1;
		foreach($postNew as $key => $row){

			$row->mensagem = ($row->mensagem);
			$row->mensagem = str_replace("?", "[zig=interrogazao]", $row->mensagem);
			$row->mensagem = str_replace("\n", "", $row->mensagem);
			
			if ( count($postNew) == $i ){
			    $query .= "( '".$row->status."','".$row->login_jasmin."','".$row->smsc."', '".$row->id_contato."', '".$row->id_landing_page."', '".$row->id_campanha."', '".$row->shorturl."', '".$row->celular."', '".$row->id_usuario."', '".$row->campanha."', '".$row->mensagem."', '".date('Y-m-d H:i:s')."', '".$row->data_lote."', '".$row->referencia."'  );";
		    } else {
		        $query .= "( '".$row->status."','".$row->login_jasmin."','".$row->smsc."', '".$row->id_contato."', '".$row->id_landing_page."', '".$row->id_campanha."', '".$row->shorturl."', '".$row->celular."', '".$row->id_usuario."', '".$row->campanha."', '".$row->mensagem."', '".date('Y-m-d H:i:s')."', '".$row->data_lote."', '".$row->referencia."'   ),";
		    }
			
			$i++;
				
		}
		
// 		echo $query; exit;
	
		$db = new Zend_Db_Select($this->db);
		$sql = $db->getAdapter()->quoteInto($query, NULL);
	
		$result = $db->getAdapter()->fetchAll($sql);
		
		if ($result){
			echo 'true-insert';
		}
		
		// REMOVE TODOS DUPLICADOS
// 		$query = '
// 				DELETE FROM zz_sms_enviados_control WHERE id_sms_enviado IN
// 				(
// 						SELECT id_sms_enviado FROM (SELECT id_sms_enviado, ROW_NUMBER() OVER(PARTITION BY id_contato ) AS rnum
// 					FROM zz_sms_enviados_control
// 					WHERE id_campanha = '.$get['id_campanha'].' ) t
		
// 				WHERE t.rnum > 1);
// 			';
			
// 		$db = new Zend_Db_Select($this->db);
// 		$sql = $db->getAdapter()->quoteInto($query, "");
			
// 		$result = $db->getAdapter()->fetchAll($sql);
	
// 		if ($result){
// 			//echo 'true-delete';
// 		}
		
	}
	
	public function downloadAction()
	{
	
		// GET
		$get = $this->_request->getPost();
	
		// GET PAGINAÇÃO
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		$limit = $get['limit'] == NULL ? 1 : $get['limit'];
		$order = $get['order'] != NULL ? explode('_', $get['order']) : NULL;
	
		// WHERE
		$where = $get['filter'];
		print_r($get); exit;
		
		unset($where['controller']);
		unset($where['module']);
		unset($where['action']);
		unset($where['p']);
		unset($where['limit']);
		unset($where['order']);
		unset($where['data_i']);
		unset($where['data_f']);
	
		$db = new sms_enviados();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->sms_enviados),array('*'));
		
			// WHERE INDIVIDUAL
			foreach($where as $key => $row):
			
				$is_array = explode(',', $row);
					
				if (count($is_array) > 1):
					$sql->where($key.' IN ('.$row.')');
				else:
					$sql->where($key.' = ?',$row);
				endif;
					
			endforeach;
				
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
		$registros = $paginator;
	
		$sql = array();
		$sql['registros'] = $registros->getCurrentItems();
		$sql['total_page'] = ceil($paginator->getTotalItemCount() / $limit);
		
		if ($pagina == 0):
		
			// CRIA ARQUIVO CSV
			$arquivo = 'relatorios/relatorio_'.time().'.csv';
			$fp = fopen($arquivo, 'w');
			
			$header = array(utf8_decode('DATA DE ENVIO'),utf8_decode('DATA DE RECIBO'),utf8_decode('CAMPANHA'),utf8_decode('DESTINO'),utf8_decode('CONTEÚDO DA MENSAGEM'),utf8_decode('STATUS'));
			fputcsv($fp, $header);
			
			fclose($fp);
			
			// retorno
			echo json_encode(array('erro'=>$post['erro'],'href'=>'http://'.$_SERVER['HTTP_HOST'].'/'.$post['arquivo'],'paginator'=>$paginator->getPages()->pageCount,'arquivo'=>$arquivo));
		
		elseif ($pagina <= $sql['total_page']):
		
			// ADICIONA RELATORIO AO CSV
			$conteudo;
			foreach($sql['registros'] as $row){
					
				$totalCelular = strlen($row['celular']);
				$number = $totalCelular - 2;
				$ddd = substr($row['celular'], 0, 2);
				$num = substr($row['celular'], 2, $number);
				$celular = $ddd.' '.$num;
					
				$row['data_recibo'] = date('d/m/Y H:i', strtotime($row['criado']));
				$row['data_enviado'] = date('d/m/Y H:i', strtotime($row['data']));
					
				// EDITA O ARQUIVO
				$fp = fopen($post['arquivo'], 'a');
				$cont = array(utf8_decode($row['data_enviado']),utf8_decode($row['data_recibo']),utf8_decode($row['campanha']),utf8_decode($celular),utf8_decode($row['mensagem']),utf8_decode($row['textostatus']));
				fputcsv($fp, $cont);
				fclose($fp);
					
			}
			
			echo json_encode(array('erro'=>$post['erro'],'href'=>'http://'.$_SERVER['HTTP_HOST'].'/'.$post['arquivo'],'paginator'=>$paginator->getPages()->pageCount,'page'=>$pagina, 'arquivo'=>$post['arquivo']));
		
		else:
		
			// LE O ARQUIVO
			$conteudo;
			$fp = fopen($post['arquivo'], 'r');
			
			while(!feof($fp)){
				$conteudo .= fgets($fp);
			}
			
			$cont = str_replace('"', '', $conteudo);
			$cont = str_replace(',', ';', $cont);
			
			fclose($fp);
			
			// EDITA O ARQUIVO
			$fp = fopen($post['arquivo'], 'w+');
			fwrite($fp, $cont);
			fclose($fp);
			
			echo json_encode(array('erro'=>$post['erro'],'href'=>'http://'.$_SERVER['HTTP_HOST'].'/'.$post['arquivo'],'paginator'=>$paginator->getPages()->pageCount,'page'=>$pagina, 'arquivo'=>$post['arquivo']));
		
		endif;
		
		echo json_encode($result);
	
	}
	
}