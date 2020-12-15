<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class Api_RelatoriosController extends My_Controller 
{
	
    public function getSinteticoAction()
    {
        
        
//         ESME_ROK -> Enviado (Enviado para operadora)
//         ACCEPTD -> Enviado (Enviado para operadora)
//         DELIVRD -> Entregue (Entrega confirmada no dispositivo)
//         UNDELIV -> Não Entregue (Mensagem não entregue a esse destinatário)
//         EXPIRED -> Expirada (Mensagem expirou o tempo de entrega)
//         REJECTED -> Rejeitada (Rejeitada pela operadora)
//         Quaisquer erro diferente dos acima -> Erro ao Enviar (Falha ao enviar a operadora)
        
//         Admin:
//         Whitelabel | Erros | Envios | Entregues | Não Entregues | Abertos
        
//         Whitelabel:
//         Conta (cliente) | Erros | Envios | Entregues | Não Entregues | Abertos
        
//         Usuário:
//         Campanha (id campanha) | Erros | Envios | Entregues | Não Entregues | Abertos
        
//         Envios é igual a soma de todos status (enviado, entregue, nao entregue)
//         Erros é o restante
        
        $get = $this->_request->getParams();
        
        // GET PAGINAÇÃO
        $pagina = $get['p'] == NULL ? 1 : $get['p'];
        $limit = $get['limit'] == NULL ? 1 : $get['limit'];
        $order = $get['order'] != NULL ? explode('_', $get['order']) : NULL;
        
        $db = new sms_enviados();
        $sql = $db->select()->from(array('SQL'=>$this->config->tb->sms_enviados),array('id_campanha', 'count("SQL".id_campanha) AS total'));
        
        $sql->joinLeft(array('ENVIOS'=>$this->config->tb->sms_enviados),
            '"SQL".id_sms_enviado = "ENVIOS".id_sms_enviado AND "ENVIOS".status IN (\'ESME_ROK\',\'ACCEPTD\',\'DELIVRD\',\'UNDELIV\',\'EXPIRED\')',array('count("ENVIOS".id_sms_enviado) AS envios'));
        
        $sql->joinLeft(array('ERRO'=>$this->config->tb->sms_enviados),
            '"SQL".id_sms_enviado = "ERRO".id_sms_enviado AND "ERRO".status NOT IN (\'ESME_ROK\',\'ACCEPTD\',\'DELIVRD\',\'UNDELIV\',\'\')',array('count("ERRO".id_sms_enviado) AS erros'));
        
        $sql->joinLeft(array('NAO_ENTREGUES'=>$this->config->tb->sms_enviados),
            '"SQL".id_sms_enviado = "NAO_ENTREGUES".id_sms_enviado AND "NAO_ENTREGUES".status IN (\'UNDELIV\')',array('count("NAO_ENTREGUES".id_sms_enviado) AS nao_entregues'));
         
        $sql->joinLeft(array('SUCESSO'=>$this->config->tb->sms_enviados),
            '"SQL".id_sms_enviado = "SUCESSO".id_sms_enviado AND "SUCESSO".status IN (\'DELIVRD\')',array('count("SUCESSO".id_sms_enviado) AS entregues'));
         
        $sql->joinLeft(array('FILA'=>$this->config->tb->sms_enviados),
            '"SQL".id_sms_enviado = "FILA".id_sms_enviado AND "FILA".status IN (\'?\', NULL, \'\')',array('count("FILA".id_sms_enviado) AS fila'));
         
        
        if ( $get['id_usuario'] ) {
            $sql->where(' "SQL".id_usuario IN ('.$get['id_usuario'].') ');
        }
        
        if ( $get['id_campanha'] ) {
            $sql->where(' "SQL".id_campanha IN ('.$get['id_campanha'].') ');
        }
        
        if ( $get['d_i'] ) {
            $sql->where(' "SQL".data_lote >= \''.$get['d_i'].' 00:00:00\' ');
        }
        
        if ( $get['d_f'] ) {
            $sql->where(' "SQL".data_lote <= \''.$get['d_f'].' 23:59:59\' ');
        }
        
        $sql->group('SQL.id_campanha');
        
        $sql->setIntegrityCheck(false);
		
		$adapter = new Zend_Paginator_Adapter_DbSelect($sql);
		$paginator = new Zend_Paginator($adapter);
		$paginator->setItemCountPerPage ( $limit );
		$paginator->setPageRange ( 10 );
		$paginator->setCurrentPageNumber ( $pagina );
		$fetch = $paginator->getCurrentItems();
		
// 		echo '<pre>'; print_r( $fetch ); exit;

        foreach ( $fetch as $key => $row ){
            
            $sql = new Zend_Db_Select($this->db);
            $sql->from(array('SQL'=>$this->config->tb->campanhas_visu),array('id_campanha', 'count("SQL".id_visualizacao) AS aberturas'));
            
            $sql->where('id_campanha = '.$row['id_campanha']);
            
            $sql->group('SQL.id_campanha');
            
            $sql = $sql->query(Zend_Db::FETCH_OBJ);
            $aberturas = current($sql->fetchAll());
            
            @$aberturas->aberturas = $aberturas->aberturas == NULL ? 0 : $aberturas->aberturas;
            
            $fetch[$key]['aberturas'] = $aberturas->aberturas;
            
        }
        
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
            $result['registros'] = $fetch;
        endif;
        
        echo json_encode($result);
        
    }
    
    public function getSinteticoUserAction()
    {
    
        $get = $this->_request->getParams();
    
        // GET PAGINAÇÃO
        $pagina = $get['p'] == NULL ? 1 : $get['p'];
        $limit = $get['limit'] == NULL ? 1 : $get['limit'];
        $order = $get['order'] != NULL ? explode('_', $get['order']) : NULL;
    
        $db = new sms_enviados();
        $sql = $db->select()->from(array('SQL'=>$this->config->tb->sms_enviados),array('id_usuario', 'count("SQL".id_campanha) AS total'));
    
        $sql->joinLeft(array('ENVIOS'=>$this->config->tb->sms_enviados),
            '"SQL".id_sms_enviado = "ENVIOS".id_sms_enviado AND "ENVIOS".status IN (\'ESME_ROK\',\'ACCEPTD\',\'DELIVRD\',\'UNDELIV\',\'EXPIRED\')',array('count("ENVIOS".id_sms_enviado) AS envios'));
        
        $sql->joinLeft(array('ERRO'=>$this->config->tb->sms_enviados),
            '"SQL".id_sms_enviado = "ERRO".id_sms_enviado AND "ERRO".status NOT IN (\'ESME_ROK\',\'ACCEPTD\',\'DELIVRD\',\'UNDELIV\',\'\')',array('count("ERRO".id_sms_enviado) AS erros'));
        
        $sql->joinLeft(array('NAO_ENTREGUES'=>$this->config->tb->sms_enviados),
            '"SQL".id_sms_enviado = "NAO_ENTREGUES".id_sms_enviado AND "NAO_ENTREGUES".status IN (\'UNDELIV\')',array('count("NAO_ENTREGUES".id_sms_enviado) AS nao_entregues'));
        
        $sql->joinLeft(array('SUCESSO'=>$this->config->tb->sms_enviados),
            '"SQL".id_sms_enviado = "SUCESSO".id_sms_enviado AND "SUCESSO".status IN (\'DELIVRD\')',array('count("SUCESSO".id_sms_enviado) AS entregues'));
        
        $sql->joinLeft(array('FILA'=>$this->config->tb->sms_enviados),
            '"SQL".id_sms_enviado = "FILA".id_sms_enviado AND "FILA".status IN (\'?\', NULL, \'\')',array('count("FILA".id_sms_enviado) AS fila'));
        
        if ( $get['id_usuario'] ) {
            $sql->where(' "SQL".id_usuario IN ('.$get['id_usuario'].') ');
        }
        
        if ( $get['d_i'] ) {
            $sql->where(' "SQL".data_lote >= \''.$get['d_i'].' 00:00:00\' ');
        }
        
        if ( $get['d_f'] ) {
            $sql->where(' "SQL".data_lote <= \''.$get['d_f'].' 23:59:59\' ');
        }
    
        $sql->group('SQL.id_usuario');
    
        $sql->setIntegrityCheck(false);
    
        $adapter = new Zend_Paginator_Adapter_DbSelect($sql);
        $paginator = new Zend_Paginator($adapter);
        $paginator->setItemCountPerPage ( $limit );
        $paginator->setPageRange ( 10 );
        $paginator->setCurrentPageNumber ( $pagina );
        $fetch = $paginator->getCurrentItems();
    
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
        $result['registros'] = $fetch;
        endif;
    
        echo json_encode($result);
    
    }
    
	public function getVisuAction()
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

		if ( $get['id_campanha'] ) unset($where['id_usuario']);
		
		$db = new templates_click();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->campanhas_visu),array('*'));
	
			// WHERE INDIVIDUAL
			foreach($where as $key => $row):
				
				$is_array = explode(',', $row);
			
				if (count($is_array) > 0):
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
	
	public function getClickAction()
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
		
		$db = new campanhas_visu();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->templates_click),array('*'));
	
			// WHERE INDIVIDUAL
			foreach($where as $key => $row):
				
				$is_array = explode(',', $row);
			
				if (count($is_array) > 0):
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
	
	public function getCampanhaAction()
	{
        header('Content-Type: application/json');

		// GET
		$get = $this->_request->getParams();
		
		$sql = new Zend_Db_Select($this->db);
		$sql->from(array('SQL'=>$this->config->tb->sms_enviados),array('id_campanha', 'count("SQL".id_sms_enviado) AS total'));

			$sql->joinLeft(array('ENVIADOS'=>$this->config->tb->sms_enviados),
				'"SQL".id_sms_enviado = "ENVIADOS".id_sms_enviado AND "ENVIADOS".status IN (\'UNDELIV\',\'DELIVRD\',\'ESME_ROK\',\'ACCEPTD\',\'EXPIRED\')',array('count("ENVIADOS".id_sms_enviado) AS enviados'));
			
			$sql->joinLeft(array('NAO_ENTREGUES'=>$this->config->tb->sms_enviados),
			    '"SQL".id_sms_enviado = "NAO_ENTREGUES".id_sms_enviado AND "NAO_ENTREGUES".status IN (\'UNDELIV\')',array('count("NAO_ENTREGUES".id_sms_enviado) AS nao_entregues'));
				
			$sql->joinLeft(array('SUCESSO'=>$this->config->tb->sms_enviados),
			    '"SQL".id_sms_enviado = "SUCESSO".id_sms_enviado AND "SUCESSO".status IN (\'DELIVRD\')',array('count("SUCESSO".id_sms_enviado) AS sucesso'));
			
			$sql->joinLeft(array('ERRO'=>$this->config->tb->sms_enviados),
				'"SQL".id_sms_enviado = "ERRO".id_sms_enviado AND "ERRO".status NOT IN (\'ESME_ROK\',\'ACCEPTD\',\'DELIVRD\',\'UNDELIV\',\'EXPIRED\',\'REJECTED\') ',array('count("ERRO".id_sms_enviado) AS erro'));
			
			if ( $get['id'] ) {
			
				$sql->where('"SQL".id_campanha IN ('.$get['id'].') ');
			
			}
			
			$sql->group('SQL.id_campanha');
			
		$sql = $sql->query(Zend_Db::FETCH_OBJ);
		$fetch = $sql->fetchAll();
		
		$result = array();
		$i = 0;
		foreach($fetch as $row){
			
			@$result[$i]->id_campanha = $row->id_campanha;
			
			// CLIQUES
			@$result[$i]->cliques->total = $this->getClick($row->id_campanha, 'total');
			@$result[$i]->cliques->unicos = $this->getClick($row->id_campanha, 'total_unicos');
			@$result[$i]->cliques->primeiro = $this->getClick($row->id_campanha, 'data_inicio') == NULL ? 'Sem informações.' : $this->getClick($row->id_campanha, 'data_inicio');
			@$result[$i]->cliques->ultimo = $this->getClick($row->id_campanha, 'data_final') == NULL ? 'Sem informações.' : $this->getClick($row->id_campanha, 'data_final');
			
			// ABERTURAS
			@$result[$i]->aberturas->total = $this->getVisu($row->id_campanha, 'total');
			@$result[$i]->aberturas->unicos = $this->getVisu($row->id_campanha, 'total_unicos');
			@$result[$i]->aberturas->primeiro = $this->getVisu($row->id_campanha, 'data_inicio') == NULL ? 'Sem informações.' : $this->getVisu($row->id_campanha, 'data_inicio');
			@$result[$i]->aberturas->ultimo = $this->getVisu($row->id_campanha, 'data_final') == NULL ? 'Sem informações.' : $this->getVisu($row->id_campanha, 'data_final');

            @$result[$i]->aceites->total = $this->getAceites($row->id_campanha );

		    @$result[$i]->envios->total = $row->total;
		    @$result[$i]->envios->sucesso_enviado = $row->enviados;
		    @$result[$i]->envios->sucesso = $row->sucesso;
		    @$result[$i]->envios->erro = $row->erro;
		    @$result[$i]->envios->nao_entregues = $row->nao_entregues;
		    @$result[$i]->envios->pendentes = $row->total - $row->sucesso -  $row->erro;
		    @$result[$i]->envios->rejeicoes = $result[$i]->envios->sucesso + @$result[$i]->envios->pendentes - $result[$i]->aberturas->unicos;
		    @$result[$i]->envios->rejeicoes = @$result[$i]->envios->rejeicoes < 0 ? 0 : @$result[$i]->envios->rejeicoes;
			    
			@$result[$i]->envios->duplicados = $this->getDuplicadosSms($row->id_campanha);
			@$result[$i]->envios->resposta_sms = $this->getMo($row->id_campanha);
			
			@$result[$i]->respostas->total = $this->getRespostas($row->id_campanha);
            @$result[$i]->respostas->unicos = $this->getRespostas($row->id_campanha, true);
			
			@$result[$i]->envios->inicio = $this->getCallback('ASC', $row->id_campanha);
			@$result[$i]->envios->fim = $this->getCallback('DESC', $row->id_campanha);
			
			if ( $get['id_lista'] ){
				
				$contatos = $this->contatos( $get['id_lista'] );
				@$result[$i]->contatos = $contatos;
				
			}
			
			$i++;
		}
		
// 		echo '<pre>';print_r($result); exit;
		
		if ( $_GET['kaique'] ) {
		    echo '<pre>';print_r($result); exit;
		} else {
		    echo json_encode($result);
		}
		
	}
	
	public function getEnviosAction()
	{
		
		$this->view->tituloPag = 'Envios de SMS';
		
		$get = $this->_request->getParams();
		
		// GET PAGINAÇÃO
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		$limit = $get['limit'] == NULL ? 1 : $get['limit'];
		$order = $get['order'] != NULL ? explode('-', $get['order']) : NULL;
		
		$get['status'] = $get['status'] == 'PEND' ? '' : $get['status'];
		$separatorStatus = explode('|', $get['status']);
		$separatorStatus = "'".implode("','", $separatorStatus)."'";
		
// 		echo $separatorStatus; exit;
		
		if ( !empty($get['id_campanha']) )
		{
			unset($get['id_usuario']);
		}
		
		$db = new sms_enviados();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->sms_enviados),array('*'));
		
			$sql->joinLeft(array('VISU'=>$this->config->tb->campanhas_visu),
				'"SQL".celular = "VISU".contato AND "SQL".id_campanha = "VISU".id_campanha AND "VISU".unique = 0 ',array('contato AS rejeicao_data', 'unique'));
			
			$sql->joinLeft(array('CONTATOS'=>$this->config->tb->contatos),
				'"SQL".id_contato = "CONTATOS".id_contato',array('id_lista'));
			
			if ( $get['id_usuario'] ){
				$sql->where(" \"SQL\".id_usuario IN ( ".$get['id_usuario']." ) ");
			}
			
			if ( $get['id_campanha'] ){
				$sql->where(" \"SQL\".id_campanha = '".$get['id_campanha']."' ");
			}
			
			if ( isset($get['status']) ){
				
			    if ( $get['status'] == 'ERROR' ) {
			        
			        $separatorStatus = "'ESME_ROK','ACCEPTD','DELIVRD','UNDELIV','EXPIRED','REJECTED'";
			        $sql->where(" \"SQL\".status NOT IN (".$separatorStatus.") ");
			        
			    } else {
			    
				    $sql->where(" \"SQL\".status IN (".$separatorStatus.") ");
				
			    }
				
			}
			
		
			if ( $get['mensagem'] ){
				$sql->where(" LOWER(\"SQL\".mensagem) LIKE LOWER('%".$get['mensagem']."%') ");
			}
			
			if ( $get['celular'] ){
				$sql->where(" LOWER(\"SQL\".celular) LIKE LOWER('%".$get['celular']."%') ");
			}
			
			if ( $get['rejeitados'] == 'on' ){
				
			    $sql->where(' "CALLBACK".referencia IS NULL OR "CALLBACK".status IN (\'CL\') ');
			    $sql->where(" \"VISU\".contato IS NULL ");
			    
			} else if ( $get['rejeitados'] == 'off' ) {
			    
				$sql->where(" \"VISU\".contato IS NOT NULL ");
				
			}
			
			if ( $get['d_i'] ){
				$sql->where(" \"SQL\".data_lote >= '".$get['d_i']." 00:00:00' ");
			}
			
			if ( $get['d_f'] ){
				$sql->where(" \"SQL\".data_lote <= '".$get['d_f']." 23:59:59' ");
			}
			
			// ORDEM
			if (isset($order)){
				$sql->order('SQL.'.$order[0].' '.$order[1]);
			}
			
		$sql->setIntegrityCheck(false);
		
		$adapter = new Zend_Paginator_Adapter_DbSelect( $sql );
		$paginator = new Zend_Paginator( $adapter );
		$paginator->setItemCountPerPage ( $limit );
		$paginator->setPageRange ( 10 );
		$paginator->setCurrentPageNumber ( $pagina );
		$registros = $paginator->getCurrentItems();
		
		
// 		print_r($paginator); exit;
		
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
		
		if ($result['total_page'] >= $pagina){
			
			$registros = $this->utf8_encode_deep( $registros );
			
// 			echo '<pre>';print_r($registros); exit;
			
			$result['registros'] = $registros;
			
		}
		
		echo json_encode($result);
		
// 		echo '<pre>'; print_r( $result ); 
		
	}
	
	public function getSftpAction()
	{
	
		$this->view->tituloPag = 'Envios de SMS';
	
		$get = $this->_request->getParams();
	
		// GET PAGINAÇÃO
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		$limit = $get['limit'] == NULL ? 1 : $get['limit'];
		$order = $get['order'] != NULL ? explode('-', $get['order']) : NULL;
	
		if ( !empty($get['id_campanha']) )
		{
			unset($get['id_usuario']);
		}
	
		$db = new sms_enviados();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->sms_enviados),array('*'));
	
		$sql->joinLeft(array('CALLBACK'=>$this->config->tb->callback_tww),
				'"SQL".id_sms_enviado = "CALLBACK".referencia',array('textostatus','status','data AS data_recibo'));
			
		$sql->joinLeft(array('VISU'=>$this->config->tb->campanhas_visu),
				'"SQL".celular = "VISU".contato AND "SQL".id_campanha = "VISU".id_campanha AND "VISU".unique = 0 ',array('contato AS rejeicao_data', 'criado AS data_rejeicao_real', 'unique'));
			
		$sql->joinLeft(array('CONTATOS'=>$this->config->tb->contatos),
				'"SQL".id_contato = "CONTATOS".id_contato',array('id_lista', 'editavel_40', 'editavel_39'));
			
		if ( $get['id_usuario'] ){
			$sql->where(" \"SQL\".id_usuario IN ( ".$get['id_usuario']." ) ");
		}
			
		if ( $get['id_campanha'] ){
			$sql->where(" \"SQL\".id_campanha = '".$get['id_campanha']."' ");
		}
			
		if ( $get['status'] == 'IN' )
		{
			 
			$sql->where(' "CALLBACK".referencia IS NULL ');
			 
		}
			
		// status
		$get['status'] = str_replace('IN', '', $get['status']);
			
		if ( $get['status'] == 'E0' ){
	
			$sql->where(" \"CALLBACK\".status != 'CL' ");
	
		} else {
				
			if ( $get['status'] ){
					
				if ( $get['status'] != 'AG' ){
						
					$sql->where(" \"CALLBACK\".status = '".$get['status']."' ");
	
				} else {
						
					$sql->where(" \"SQL\".data_lote > '".date('Y-m-d H:i')."' ");
	
				}
					
			}
				
		}
			
	
		if ( $get['mensagem'] ){
			$sql->where(" LOWER(\"SQL\".mensagem) LIKE LOWER('%".$get['mensagem']."%') ");
		}
			
		if ( $get['celular'] ){
			$sql->where(" LOWER(\"SQL\".celular) LIKE LOWER('%".$get['celular']."%') ");
		}
			
		if ( $get['rejeitados'] == 'on' ){
			$sql->where(" \"VISU\".contato IS NULL ");
		} else if ( $get['rejeitados'] == 'off' ) {
			$sql->where(" \"VISU\".contato IS NOT NULL ");
		}
			
		if ( $get['d_i'] ){
			$sql->where(" \"SQL\".data_lote >= '".$get['d_i']." 00:00:00' ");
		}
			
		if ( $get['d_f'] ){
			$sql->where(" \"SQL\".data_lote <= '".$get['d_f']." 99:99:99' ");
		}
			
		// ORDEM
		if (isset($order)){
			$sql->order('SQL.'.$order[0].' '.$order[1]);
		}
			
		$sql->setIntegrityCheck(false);
	
		$adapter = new Zend_Paginator_Adapter_DbSelect( $sql );
		$paginator = new Zend_Paginator( $adapter );
		$paginator->setItemCountPerPage ( $limit );
		$paginator->setPageRange ( 10 );
		$paginator->setCurrentPageNumber ( $pagina );
		$registros = $paginator->getCurrentItems();
	
	
		// 		print_r($paginator); exit;
	
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
	
		if ($result['total_page'] >= $pagina){
				
			$registros = $this->utf8_encode_deep( $registros );
				
			// 			echo '<pre>';print_r($registros); exit;
				
			$result['registros'] = $registros;
				
		}
	
		echo json_encode($result);
	
		// 		echo '<pre>'; print_r( $result );
	
	}
	
	protected function utf8_encode_deep($array)
	{
		
		array_walk_recursive($array, function(&$item, $key){
			if(!mb_detect_encoding($item, 'utf-8', true)){
				$item = utf8_encode($item);
			}
		});
	
		return $array;
		
	}
	
	public function getDuplicadosAction()
	{
		
		$this->view->tituloPag = 'Envios duplicados';
		
		$get = $this->_request->getParams();
		
		// GET PAGINAÇÃO
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		$limit = $get['limit'] == NULL ? 1 : $get['limit'];
		$order = $get['order'] != NULL ? explode('-', $get['order']) : NULL;
		
		if ( $get['id_campanha'] )
			$id_campanha = 'id_campanha = '.$get['id_campanha'].' AND';
		
		if ( $get['mensagem'] )
			$mensagem = "LOWER(mensagem) LIKE LOWER('%".$get['mensagem']."%') AND";
		
		if ( $get['celular'] )
			$celular = "celular LIKE '%".$get['celular']."%' AND";
		
		$query = '
				SELECT * FROM (
				SELECT id_contato, celular, data_lote, criado, mensagem, campanha, id_campanha, ROW_NUMBER() OVER(PARTITION BY celular ) AS LINHA
				FROM zz_sms_enviados
				WHERE '.$id_campanha.' '.$mensagem.' '.$celular.' id_usuario = '.$get['id_usuario'].'
				) CC
				WHERE CC.LINHA > 1';
			
		$db = new Zend_Db_Select($this->db);
		$sql = $db->getAdapter()->quoteInto($query, "");
			
		$array = $db->getAdapter()->fetchAll($sql);

		$result = array();
		$result['paginacao'] = array();
		$result['total_registros'] = count($array);
		$result['total_page'] = ceil($result['total_registros'] / $limit);
		
		$array = (array)$array;
		$registros = array_chunk($array, $limit);
		$registros = (object)$registros[$pagina - 1];
		
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
		
		if ($result['total_page'] >= $pagina){
			$result['registros'] = $registros;
		}
		
		echo json_encode($result);
		
	}
	
	public function getCliquesAction()
	{
	
		$this->view->tituloPag = 'Interações';
		
		$get = $this->_request->getParams();
        if ( $get['id_campanha'] ) unset($get['id_usuario']);
	
		// GET PAGINAÇÃO
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		$limit = $get['limit'] == NULL ? 1 : $get['limit'];
		$order = $get['order'] != NULL ? explode('-', $get['order']) : NULL;
	
		$db = new templates_click();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->templates_click),array('*'));
		
		$sql->joinLeft(array('ENVIOS'=>$this->config->tb->sms_enviados),
		    '"SQL".contato = "ENVIOS".celular AND "SQL".id_campanha = "ENVIOS".id_campanha',array('referencia'));
	
		if ( $get['id_campanha'] ){
			$sql->where(" \"SQL\".id_campanha = '".$get['id_campanha']."' ");
		}

        if ( $get['id_usuario'] ){
            $sql->where(" \"SQL\".id_usuario = '".$get['id_usuario']."' ");
        }
		
		if ( $get['acao'] ){
			$sql->where(" LOWER(\"SQL\".tipo_acao) = LOWER('".$get['acao']."') ");
		}
		
		if ( $get['celular'] ){
			$sql->where(" LOWER(\"SQL\".contato) LIKE LOWER('%".$get['celular']."%') ");
		}
		
		if ( $get['d_i'] ){
			$sql->where(" \"SQL\".criado >= '".$get['d_i']." 00:00:00' ");
		}
			
		if ( $get['d_f'] ){
			$sql->where(" \"SQL\".criado <= '".$get['d_f']." 99:99:99' ");
		}
		
		if ( $get['unique'] ){
			$sql->where(" \"SQL\".unique = '0' ");
		}
			
		// ORDEM
		if (isset($order)){
			$sql->order('SQL.'.$order[0].' '.$order[1]);
		}
		
	
		$sql->setIntegrityCheck(false);
	
		$adapter = new Zend_Paginator_Adapter_DbSelect( $sql );
		$paginator = new Zend_Paginator( $adapter );
		$paginator->setItemCountPerPage ( $limit );
		$paginator->setPageRange ( 10 );
		$paginator->setCurrentPageNumber ( $pagina );
		$registros = $paginator->getCurrentItems();
	
		// 		print_r($paginator); exit;
	
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
	
		if ($result['total_page'] >= $pagina){
			$result['registros'] = $registros;
		}
	
		echo json_encode($result);
	
		// 		echo '<pre>'; print_r( $result );
	
	}
	
	public function getAberturasAction()
	{

		
		$get = $this->_request->getParams();
        if ( $get['id_campanha'] ) unset($get['id_usuario']);
	
		// GET PAGINAÇÃO
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		$limit = $get['limit'] == NULL ? 1 : $get['limit'];
		$order = $get['order'] != NULL ? explode('-', $get['order']) : NULL;
	
		$db = new templates_click();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->campanhas_visu),array('*'));
		
		$sql->joinLeft(array('ENVIOS'=>$this->config->tb->sms_enviados),
		    '"SQL".contato = "ENVIOS".celular AND "SQL".id_campanha = "ENVIOS".id_campanha',array('referencia'));
	
		if ( $get['id_campanha'] ){
			$sql->where(" \"SQL\".id_campanha = '".$get['id_campanha']."' ");
		}
		
		if ( $get['id_usuario'] ){
		    $sql->where(" \"SQL\".id_usuario IN ('".$get['id_usuario']."') ");
		}
	
		if ( $get['celular'] ){
			$sql->where(" LOWER(\"SQL\".contato) LIKE LOWER('%".$get['celular']."%') ");
		}
			
		if ( $get['d_i'] ){
			$sql->where(" \"SQL\".criado >= '".$get['d_i']." 00:00:00' ");
		}
			
		if ( $get['d_f'] ){
			$sql->where(" \"SQL\".criado <= '".$get['d_f']." 99:99:99' ");
		}
	
		if ( $get['unique'] ){
			$sql->where(" \"SQL\".unique = 0 ");
		}
		
			
		// ORDEM
		if (isset($order)){
			$sql->order('SQL.'.$order[0].' '.$order[1]);
		}
	
		$sql->setIntegrityCheck(false);
		
		$adapter = new Zend_Paginator_Adapter_DbSelect( $sql );
		$paginator = new Zend_Paginator( $adapter );
		$paginator->setItemCountPerPage ( $limit );
		$paginator->setPageRange ( 10 );
		$paginator->setCurrentPageNumber ( $pagina );
		$registros = $paginator->getCurrentItems();
	
		// 		print_r($paginator); exit;
		
		if ( $_GET['kaique_dev'] == 'kaique' ){
		    echo '<pre>'; print_r( $paginator ); exit;
		}
	
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
	
		if ($result['total_page'] >= $pagina){
			$result['registros'] = $registros;
		}
	
		echo json_encode($result);
	
		// 		echo '<pre>'; print_r( $result );
	
	}
	
	public function getMoAction()
	{
		
		$this->view->tituloPag = 'Respostas via SMS';
	
		$get = $this->_request->getParams();
	
		// GET PAGINAÇÃO
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		$limit = $get['limit'] == NULL ? 1 : $get['limit'];
		$order = $get['order'] != NULL ? explode('-', $get['order']) : NULL;
	
		$db = new recibos_mo();
		/*
		 * adcionei 'MO.seunum' @capetão
		 */
		$sql = $db->select()->from(array('MO'=>$this->config->tb->recibos_mo),array('mensagem AS msg_resp', 'celular', 'id_mo_jasmin', 'criado'));
	
		$sql->joinLeft(array('SQL'=>$this->config->tb->sms_enviados),
				'"SQL".id_sms_enviado = "MO".id_sms_enviados',array('id_mt','criado','mensagem','id_usuario','id_sms_enviado','id_campanha', 'campanha'));
		
		if ( $get['id_usuario'] ){
		    $sql->where('"SQL".id_usuario IN ('. $get['id_usuario'] .')');
		}
		
		if ( $get['id_campanha'] ){
			$sql->where(" \"SQL\".id_campanha = '".$get['id_campanha']."' ");
		}
	
		if ( $get['celular'] ){
			$sql->where(" LOWER(\"SQL\".celular) LIKE LOWER('%".$get['celular']."%') ");
		}
			
		if ( $get['d_i'] ){
			$sql->where(" \"MO\".criado >= '".$get['d_i']." 00:00:00'");
		}
			
		if ( $get['d_f'] ){
			$sql->where(" \"MO\".criado <= '".$get['d_f']." 23:59:59'");
		}
	
		// ORDEM
		if (isset($order)){
			$sql->order('SQL.'.$order[0].' '.$order[1]);
		}
		
		/*
		 * adcionei group @capetão
		 */
		$sql->order('MO.mensagem DESC');
	
		$sql->setIntegrityCheck(false);
	
		$adapter = new Zend_Paginator_Adapter_DbSelect( $sql );
		$paginator = new Zend_Paginator( $adapter );
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
	
		if ($result['total_page'] >= $pagina){
			$result['registros'] = $registros;
		}
	
		echo json_encode($result);
	
	}
	
	public function getFormAction()
	{
		
		$get = $this->_request->getParams();

        if ( $get['id_campanha'] ) unset($get['id_usuario']);

		// GET PAGINAÇÃO
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		$limit = $get['limit'] == NULL ? 1 : $get['limit'];
		$order = $get['order'] != NULL ? explode('-', $get['order']) : NULL;
	
		$db = new contato_campanha();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->contato_campanha),array('*'));
		
		$sql->joinLeft(array('ENVIOS'=>$this->config->tb->sms_enviados),
		    '"SQL".celular = "ENVIOS".celular AND "SQL".id_campanha = "ENVIOS".id_campanha',array('referencia'));
	
		$sql->where(" \"SQL\".campos != '[]'");

        if ( $get['unique'] ){

            if ( $get['id_campanha'] ){
                $whereUnique = 'id_campanha = '.$get['id_campanha'];
            }

            if ( $get['id_usuario'] ){
                $whereUnique = 'id_usuario IN ('.$get['id_usuario'].')';
            }

            $query = "
                SELECT
                    MAX(id_contato_campanha) AS id_contato_campanha, celular
                FROM
                   zz_contato_campanha
                WHERE
                    $whereUnique
                GROUP BY 
                    celular
            ";

            $dbUnique = new Zend_Db_Select($this->db);
            $sqlUnique = $dbUnique->getAdapter()->quoteInto($query, "");
            $registrosUniques = $dbUnique->getAdapter()->fetchAll($sqlUnique);

            $ids = array();

            foreach ( $registrosUniques as $row ){
                $ids[] = $row['id_contato_campanha'];
            }

            $uniques = implode(',',$ids);

            $sql->where(" \"SQL\".id_contato_campanha IN (".$uniques.") ");

        }

        if ( $get['id_usuario'] ){
            $sql->where(" \"SQL\".id_usuario IN (".$get['id_usuario'].") ");
        }

		if ( $get['id_campanha'] ){
			$sql->where(" \"SQL\".id_campanha = '".$get['id_campanha']."' ");
		}
	
		if ( $get['celular'] ){
			$sql->where(" LOWER(\"SQL\".celular) LIKE LOWER('%".$get['celular']."%') ");
		}
			
		if ( $get['d_i'] ){
			$sql->where(" \"SQL\".criado >= '".$get['d_i']." 00:00:00' ");
		}
			
		if ( $get['d_f'] ){
			$sql->where(" \"SQL\".criado <= '".$get['d_f']." 99:99:99' ");
		}
	
		// ORDEM
		if (isset($order)){
			$sql->order('SQL.'.$order[0].' '.$order[1]);
		}
	
		$sql->setIntegrityCheck(false);
	
		$adapter = new Zend_Paginator_Adapter_DbSelect( $sql );
		$paginator = new Zend_Paginator( $adapter );
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


		if ($result['total_page'] >= $pagina){
		    $result['registros'] = $registros;
		}
	
		echo json_encode($result);
	
		// 		echo '<pre>'; print_r( $result );
	
	}

    public function getAceitesAction()
    {

        $get = $this->_request->getParams();

        // GET PAGINAÇÃO
        $pagina = $get['p'] == NULL ? 1 : $get['p'];
        $limit = $get['limit'] == NULL ? 1 : $get['limit'];
        $order = $get['order'] != NULL ? explode('-', $get['order']) : NULL;

        $db = new templates_click();
        $sql = $db->select()->from(array('SQL'=>$this->config->tb->aceites_navega),array('*'));

        if ( $get['id_campanha'] ){
            $sql->where(" \"SQL\".id_campanha = '".$get['id_campanha']."' ");
        }

        if ( $get['id_usuario'] ){
            $sql->where(" \"SQL\".id_usuario IN ('".$get['id_usuario']."') ");
        }

        if ( $get['celular'] ){
            $sql->where(" LIKE LOWER('%".$get['celular']."%') ");
        }

        if ( $get['d_i'] ){
            $sql->where(" \"SQL\".criado >= '".$get['d_i']." 00:00:00' ");
        }

        if ( $get['d_f'] ){
            $sql->where(" \"SQL\".criado <= '".$get['d_f']." 99:99:99' ");
        }

        if ( $get['unique'] ){
            $sql->where(" \"SQL\".unique = 0 ");
        }

        // ORDEM
        if (isset($order)){
            $sql->order('SQL.'.$order[0].' '.$order[1]);
        }

        $sql->setIntegrityCheck(false);

        $adapter = new Zend_Paginator_Adapter_DbSelect( $sql );
        $paginator = new Zend_Paginator( $adapter );
        $paginator->setItemCountPerPage ( $limit );
        $paginator->setPageRange ( 10 );
        $paginator->setCurrentPageNumber ( $pagina );
        $registros = $paginator->getCurrentItems();

        // 		print_r($paginator); exit;

        if ( $_GET['kaique_dev'] == 'kaique' ){
            echo '<pre>'; print_r( $paginator ); exit;
        }

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

        if ($result['total_page'] >= $pagina){
            $result['registros'] = $registros;
        }

        echo json_encode($result);

        // 		echo '<pre>'; print_r( $result );

    }

	public function newConfirmAction()
    {

        $get = $this->_request->getParams();

        $this->data = new Model_Data(new aceites_navega());
        $this->data->_required(array('id_navegacao', 'id_usuario', 'id_campanha', 'celular', 'titulo', 'texto', 'criado'));
        $this->data->_notNull(array('id_usuario', 'celular', 'id_campanha'));

        $sql = new aceites_navega();
        $getSql = count($sql->fetchAll(" id_campanha = '$get[id_campanha]' AND celular = '$get[celular]'  "));

        if ( $getSql == 0 ) {
            $edt = $this->data->edit(NULL, $get, NULL, Model_Data::NOVO);
        }

        print_r($edt); exit;

    }
	
	private function getCallback ( $order, $id_campanha )
	{
		
		$db = new sms_enviados();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->sms_enviados),array('*'));
		
		$sql->where('"SQL".id_campanha = '.$id_campanha.'');
		
		$sql->order('SQL.data_lote '.$order);
		
		$sql->setIntegrityCheck(false);
		
		$adapter = new Zend_Paginator_Adapter_DbSelect($sql);
		$paginator = new Zend_Paginator($adapter);
		$registros = $paginator->getCurrentItems();
		
		if ( $registros[0]['data_lote'] != NULL ){
		
			return str_replace( '-', '/', date( 'd-m-Y H:i', strtotime( $registros[0]['data_lote'] ) ) );
		
		} else {
			
			return 'Sem informações.';
			
		}
		
	}

    private function getRespostas ( $id_campanha, $unique = false )
    {

        if ( $unique ) {

            $db = new contato_campanha();
            $sql = $db->select()->from(array('SQL'=>$this->config->tb->contato_campanha),array('count(celular) AS total'));

            $sql->where(" \"SQL\".campos != '[]' ");
            $sql->where('"SQL".id_campanha = '.$id_campanha.'');
            $sql->group('celular');

            $sql->setIntegrityCheck(false);

            $adapter = new Zend_Paginator_Adapter_DbSelect($sql);
            $paginator = new Zend_Paginator($adapter);
            $paginator->setItemCountPerPage ( 99999 );
            $paginator->setPageRange ( 10 );
            $paginator->setCurrentPageNumber ( 0 );
            $registros = $paginator->getCurrentItems();

            $registros[0]['total'] = count($registros);

        } else {

            $db = new contato_campanha();
            $sql = $db->select()->from(array('SQL'=>$this->config->tb->contato_campanha),array('count(*) AS total'));

            $sql->where(" \"SQL\".campos != '[]' ");
            $sql->where('"SQL".id_campanha = '.$id_campanha.'');

            $sql->setIntegrityCheck(false);

            $adapter = new Zend_Paginator_Adapter_DbSelect($sql);
            $paginator = new Zend_Paginator($adapter);
            $registros = $paginator->getCurrentItems();

        }

        return $registros[0]['total'];

    }
	
	private function getMo( $id_campanha )
	{

	    $query = '
				SELECT count(id_mo) AS total FROM zz_recibos_mo AS MO
                LEFT JOIN zz_sms_enviados AS ENVIADOS ON MO.id_sms_enviados = ENVIADOS.id_sms_enviado
                WHERE id_campanha = '.$id_campanha;
	    
	    $db = new Zend_Db_Select($this->db);
	    $sql = $db->getAdapter()->quoteInto($query, "");
	    $registros = $db->getAdapter()->fetchAll($sql);
	    
	    return current($registros)['total'];

	}
	
	private function getDuplicadosSms( $id_campanha )
	{
		
		$query = '
				SELECT * FROM (
					SELECT id_sms_enviado, ROW_NUMBER() OVER(PARTITION BY celular ) AS LINHA
					FROM zz_sms_enviados
						WHERE id_campanha = '.$id_campanha.'
					) CC
				WHERE CC.LINHA > 1';
		
		$db = new Zend_Db_Select($this->db);
		$sql = $db->getAdapter()->quoteInto($query, "");
		$registros = $db->getAdapter()->fetchAll($sql);
		
		return count( $registros );
		
	}
	
	private function contatos( $id_lista )
	{
		
		// GET PAGINAÇÃO
		$pagina = $get['p'] == NULL ? 1 : $get['p'];
		
		$db = new contatos();
		$sql = $db->select()->from(array('SQL'=>$this->config->tb->contatos),array('count(*) AS total'));
		
		$sql->joinLeft(array('LISTA'=>$this->config->tb->lista_contatos),
			'"SQL".id_lista = "LISTA".id_lista',array('id_lista', 'lista'));

		$sql->where(' "LISTA".id_lista IN ( '.$id_lista.' )');
		
		$sql->group('LISTA.id_lista');
		
		$sql->setIntegrityCheck(false);
		
		$adapter = new Zend_Paginator_Adapter_DbSelect($sql);
		$paginator = new Zend_Paginator($adapter);
		$registros = $paginator->getCurrentItems();
		
		$result = array();
		
		$i=0;
		foreach ( $registros as $row ){
			
			$result[$i] = $row;
			$i++;
			
		}
		
		return $result;
		
	}

    private function getAceites($id_campanha)
    {

        $sql = new Zend_Db_Select($this->db);
        $sql->from(array('SQL'=>$this->config->tb->aceites_navega), array('count(id_navegacao) AS total'));
        $sql->where('id_campanha = ?', $id_campanha);
        $sql = $sql->query(Zend_Db::FETCH_OBJ);
        $fetch = $sql->fetchAll();
        return $fetch[0]->total == NULL ? '0' : $fetch[0]->total;

    }
	
	private function getVisu($id_campanha, $funcao = NULL)
	{
		
		
		if ( $funcao == 'total' ){
			
			$campos = array('count(id_visualizacao) AS total');
			
		}  elseif ( $funcao == 'total_unicos' ){
			
			$campos = array('contato');
			
		} elseif ( $funcao == 'data_inicio' || $funcao == 'data_final' ){
			
			$campos = array('criado');
			
		}
		
		$sql = new Zend_Db_Select($this->db);
		$sql->from(array('SQL'=>$this->config->tb->campanhas_visu), $campos);
		
			$sql->where('id_campanha = ?', $id_campanha);
			
			if ( $funcao == 'total_unicos' ){
				
				$sql->where('"SQL".unique = \'0\' ');
				
			} else if ( $funcao == 'total' ) {
	
				$sql->group('id_campanha');
		
			}  else {
		
				$sql->group('criado');
		
			}
			
			if ( $funcao == 'data_inicio' ){
				
				$sql->order('criado ASC');
				
			} else if ( $funcao == 'data_final' ){
				
				$sql->order('criado DESC');
				
			}
			
			
		$sql = $sql->query(Zend_Db::FETCH_OBJ);
		
		
		$fetch = $sql->fetchAll();
		
		if ( $funcao == 'total' ){
			
// 			echo '<pre>'; print_r($sql);
			
			return $fetch[0]->total == NULL ? '0' : $fetch[0]->total;
			
		} elseif ( $funcao == 'total_unicos' ){
			
			return count( $fetch );
			
		} else {
			
			if ( $fetch[0]->criado ) {
				return str_replace('-', '/', date('d-m-Y H:i', strtotime($fetch[0]->criado)));
			}
			
		}
		
		
	}
	
	private function getClick($id_campanha, $funcao = NULL)
	{
	
	
		if ( $funcao == 'total' ){
				
			$campos = array('count(id_click) AS total');
				
		}  elseif ( $funcao == 'total_unicos' ){
				
			$campos = array('contato');
				
		} elseif ( $funcao == 'data_inicio' || $funcao == 'data_final' ){
				
			$campos = array('criado');
				
		}
	
		$sql = new Zend_Db_Select($this->db);
		$sql->from(array('SQL'=>$this->config->tb->templates_click), $campos);
	
		$sql->where('id_campanha = ?', $id_campanha);
			
		if ( $funcao == 'total_unicos' ){
	
			$sql->group(array('contato','acao'));
	
		} else if ( $funcao == 'total' ) {
	
			$sql->group('id_campanha');
	
		}  else {
	
			$sql->group('criado');
	
		}
			
		if ( $funcao == 'data_inicio' ){
	
			$sql->order('criado ASC');
	
		} else if ( $funcao == 'data_final' ){
	
			$sql->order('criado DESC');
	
		}
			
			
		$sql = $sql->query(Zend_Db::FETCH_OBJ);
	
	
		$fetch = $sql->fetchAll();
	
		if ( $funcao == 'total' ){
				
			return $fetch[0]->total == NULL ? '0' : $fetch[0]->total;
				
		} elseif ( $funcao == 'total_unicos' ){
				
			return count( $fetch );
				
		} else {
				
			if ( $fetch[0]->criado ) {
				return str_replace('-', '/', date('d-m-Y H:m', strtotime($fetch[0]->criado)));
			}
				
		}
	
	
	}
		
}