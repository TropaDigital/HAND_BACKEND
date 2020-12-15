<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class Api_TemplatesController extends My_Controller 
{
	
	public function shorturlAction()
	{
	
		$get = $this->_request->getParams();
	
		// SELECT DA LANDING PAGE
		$sms_enviados = new Zend_Db_Select($this->db);
		$sms_enviados->from(array('ENVIADOS'=>$this->config->tb->sms_enviados),array('*'))
	
			->where('shorturl = \''.$get['id'].'\'');
	
		$sms_enviados = $sms_enviados->query(Zend_Db::FETCH_OBJ);
		$this->view->sms_enviados = $sms_enviados->fetchAll();
	
		echo json_encode($this->view->sms_enviados);
	
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
		
		$db = new templates_click();
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
	
	public function getVisualizacaoAction()
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
		
}