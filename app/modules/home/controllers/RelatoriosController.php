<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class RelatoriosController extends My_Controller 
{
	
	public function ini()
	{
	
	}
	
	public function downloadAction()
	{
		
		header('Access-Control-Allow-Origin: *');
		
		if ($_GET['p']){
			$pagina = $_GET['p'];
		} else {
			$pagina = 0;
		}
		 
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		$filters = $params['filter'];
		
		$result = array();
		 
		if ($post['erro'] == 'false'){
			
			// SUCESSO
			$relatorio = new Zend_Db_Select($this->db);
			$relatorio->from(array('ENVIADOS'=>$this->config->tb->sms_enviados),array('*', 'criado AS data_enviado'))
			
				->joinLeft(array('CALLBACK'=>$this->config->tb->callback_sms),
					'"CALLBACK".message_id = "ENVIADOS".message_id',array('dlvrd', 'criado AS data_recibo'))
					 
				->order('ENVIADOS.criado DESC')
				->group($this->groupBy('sms_enviados,callback_sms', 'ENVIADOS,CALLBACK', 'id_sms_enviado,id_callback'));
					 
			$relatorio->where('"ENVIADOS".id_usuario = \''.$post['id_usuario'].'\'');
			$relatorio->where('"CALLBACK".mo_type = \'4\'');
					 
			if ($filters['data_i_c']){
				$relatorio->where('"ENVIADOS".criado >= \''.$filters[data_i_c].'\' ');
			}
			if ($filters['data_f_c']){
				$relatorio->where('"ENVIADOS".criado <= \''.$filters[data_f_c].'\'');
			}
			if ($filters['campanha']){
				$relatorio->where('"ENVIADOS".campanha LIKE \'%'.$filters[campanha].'%\'');
			}
			if ($filters['celular']){
				$relatorio->where('"ENVIADOS".celular LIKE \'%'.$filters[celular].'%\'');
			}
			if ($filters['mensagem']){
				$relatorio->where('"ENVIADOS".mensagem LIKE \'%'.$filters[mensagem].'%\'');
			}
			if ($filters['status']){
				$relatorio->where('"CALLBACK".dlvrd != \''.$filters[status].'\'');
			}
			if ($filters['i_campanha']){
				$relatorio->where('"ENVIADOS".id_campanha = \''.$filters[i_campanha].'\'');
			}
					 
			$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
			$this->view->relatorio = $relatorio->fetchAll();
					 
			// PAGINACAO
			$paginator = Zend_Paginator::factory ($this->view->relatorio);
			// Seta a quantidade de registros por página
			$paginator->setItemCountPerPage ( 10 );
			// numero de paginas que serão exibidas
			$paginator->setPageRange ( 5 );
			// Seta a página atual
			$paginator->setCurrentPageNumber ( $pagina );
			// Passa o paginator para a view
			$this->view->relatorio = $paginator;
		
		} elseif ($post['erro'] == 'true'){
			
			// ERROS
			$relatorio = new Zend_Db_Select($this->db);
			$relatorio->from(array('ERROS'=>$this->config->tb->sms_erros),array('*', 'criado AS data_enviado', 'criado AS data_recibo'))
			
				->order('ERROS.criado DESC');
						
			$relatorio->where('"ERROS".id_usuario = \''.$post['id_usuario'].'\'');
						
			if ($filters['data_i_c']){
				$relatorio->where('"ERROS".criado >= \''.$filters[data_i_c].'\' ');
			}
			if ($filters['data_f_c']){
				$relatorio->where('"ERROS".criado <= \' '.$filters[data_f_c].' \'');
			}
			if ($filters['campanha']){
				$relatorio->where('"ERROS".campanha LIKE \'%'.$filters[campanha].'%\'');
			}
			if ($filters['celular']){
				$relatorio->where('"ERROS".celular LIKE \'%'.$filters[celular].'%\'');
			}
			if ($filters['mensagem']){
				$relatorio->where('"ERROS".mensagem LIKE \'%'.$filters[mensagem].'%\'');
			}
			if ($filters['i_campanha']){
				$relatorio->where('"ERROS".id_campanha = \''.$filters[i_campanha].'\'');
			}
						
			$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
			$this->view->relatorio = $relatorio->fetchAll();
			
			// PAGINACAO
			$paginator = Zend_Paginator::factory ($this->view->relatorio);
			// Seta a quantidade de registros por página
			$paginator->setItemCountPerPage ( 10 );
			// numero de paginas que serão exibidas
			$paginator->setPageRange ( 5 );
			// Seta a página atual
			$paginator->setCurrentPageNumber ( $pagina );
			// Passa o paginator para a view
			$this->view->relatorio = $paginator;
		}
		
		foreach($this->view->relatorio as $row){
			array_push($result, (array)$row);
		}
		
		$this->view->relatorio = (object)$result;
		
		if ($post['erro'] == 'true'){
			$erro = 'erros';
		} else {
			$erro = 'sucessos';
		}
		
		if ($pagina == 0 && $post['erro'] == 'false'){
					 
			$arquivo = 'relatorios/relatorio_'.time().'.csv';
			$fp = fopen($arquivo, 'w');
		
			$header = array(utf8_decode('DATA DE ENVIO'),utf8_decode('DATA DE RECIBO'),utf8_decode('CAMPANHA'),utf8_decode('DESTINO'),utf8_decode('CONTEÚDO DA MENSAGEM'),utf8_decode('STATUS'));
			fputcsv($fp, $header);
		
			fclose($fp);
		
			// retorno
			echo json_encode(array('erro'=>$post['erro'],'href'=>'http://'.$_SERVER['HTTP_HOST'].'/'.$post['arquivo'],'paginator'=>$paginator->getPages()->pageCount,'arquivo'=>$arquivo));
					 
		} elseif ($pagina <= $paginator->getPages()->pageCount) {
					 
			$conteudo;
			foreach($this->view->relatorio as $row){
						 
				if ($row['dlvrd'] == '001'){
					$row['dlvrd'] = 'Sucesso';
				} else {
					$row['dlvrd'] = 'Erro';
				}
						 
				$totalCelular = strlen($row['celular']);
				$number = $totalCelular - 2;
				$ddd = substr($row['celular'], 0, 2);
				$num = substr($row['celular'], 2, $number);
				$celular = $ddd.' '.$num;
						 
				$row['data_recibo'] = date('d/m/Y H:i', strtotime($row['data_recibo']));
				$row['data_enviado'] = date('d/m/Y H:i', strtotime($row['data_enviado']));
						 
				// EDITA O ARQUIVO
				$fp = fopen($post['arquivo'], 'a');
				$cont = array(utf8_decode($row['data_enviado']),utf8_decode($row['data_recibo']),utf8_decode($row['campanha']),utf8_decode($celular),utf8_decode($row['mensagem']),utf8_decode($row['dlvrd']));
				fputcsv($fp, $cont);
				fclose($fp);
						 
			}
					 
			echo json_encode(array('erro'=>$post['erro'],'href'=>'http://'.$_SERVER['HTTP_HOST'].'/'.$post['arquivo'],'paginator'=>$paginator->getPages()->pageCount,'page'=>$pagina, 'arquivo'=>$post['arquivo']));
					 
		} else {
		
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
		
		}
				 
		exit;
		
	}
	
	public function smsGeral()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		if ($params['p']){
			$pagina = $params['p'];
		} else {
			$pagina = 0;
		}
		
		$result = array();
		
		// SUCESSO
		$relatorio = new Zend_Db_Select($this->db);
		$relatorio->from(array('ENVIADOS'=>$this->config->tb->sms_enviados),array('*', 'criado AS data_enviado'))
		
			->joinLeft(array('CALLBACK'=>$this->config->tb->callback_sms),
				'"CALLBACK".message_id = "ENVIADOS".message_id',array('dlvrd', 'criado AS data_recibo'))
		
			->order('ENVIADOS.criado DESC')
			->group($this->groupBy('sms_enviados,callback_sms', 'ENVIADOS,CALLBACK', 'id_sms_enviado,id_callback'));
		
			$relatorio->where('"CALLBACK".mo_type = \'4\'');
		
			if (!empty($post['id_usuario'])){
				$relatorio->where('"ENVIADOS".id_usuario = \''.$post['id_usuario'].'\' ');
			}
			if (!empty($params['data_i_c'])){
				$relatorio->where('"ENVIADOS".criado >= \''.$params['data_i_c'].'\'');
			}
			if (!empty($params['data_f_c'])){
				$relatorio->where('"ENVIADOS".criado <= \''.$params['data_f_c'].'\'');
			}
			if (!empty($params['celular'])){
				$relatorio->where('"ENVIADOS".celular LIKE \'%'.$params['celular'].'%\'');
			}
			if (!empty($params['status'])){
				$relatorio->where('"CALLBACK".dlvrd != \'00'.$params['status'].'\'');
			}
			if (!empty($params['campanha'])){
				$relatorio->where('"ENVIADOS".campanha LIKE \'%'.$params['campanha'].'%\'');
			}
			if (!empty($params['i_campanha'])){
				$relatorio->where('"ENVIADOS".id_campanha = \''.$params['i_campanha'].'\'');
			}
			if (!empty($params['mensagem'])){
				$relatorio->where('"ENVIADOS".mensagem LIKE \'%'.str_replace(' ','+', $params['mensagem']).'%\'');
			}
		
		$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
		$this->view->result = $relatorio->fetchAll();
		
		foreach($this->view->result as $row){
			array_push($result, $row);
		}
		
		if ($params['status'] != '0'){
		
			// ERRO
			$relatorio = new Zend_Db_Select($this->db);
			$relatorio->from(array('ERROS'=>$this->config->tb->sms_erros),array('*', 'criado AS data_enviado', 'criado AS data_recibo'))
			
				->order('ERROS.criado DESC');
			
				if ($params['i_campanha']){
					$relatorio->where('"ERROS".id_campanha = \''.$params['i_campanha'].'\'');
				}
				if (!empty($post['id_usuario'])){
					$relatorio->where('"ERROS".id_usuario = \''.$post['id_usuario'].'\' ');
				}
				if (!empty($params['data_i_c'])){
					$relatorio->where('"ERROS".criado >= \''.$params[data_i_c].'\' ');
				}
				if (!empty($params['data_f_c'])){
					$relatorio->where('"ERROS".criado <= \' '.$params[data_f_c].' \'');
				}
				if (!empty($params['celular'])){
					$relatorio->where('"ERROS".celular LIKE \'%'.$params[celular].'%\'');
				}
				if (!empty($params['campanha'])){
					$relatorio->where('"ERROS".campanha LIKE \'%'.$params['campanha'].'%\'');
				}
				if (!empty($params['mensagem'])){
					$relatorio->where('"ERROS".mensagem LIKE \'%'.$params['mensagem'].'%\'');
				}
			
			$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
			$this->view->result = $relatorio->fetchAll();
			
			foreach($this->view->result as $row){
				array_push($result, $row);
			}
		
		}
	
		return json_encode($result);
		
	}
	
	public function smsGeralAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		$sms = $this->smsGeral();
		
		echo $sms; 
		exit;
		
		
	}
	
	public function dlvrAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		$relatorio = new Zend_Db_Select($this->db);
		$relatorio->from(array('ENVIADOS'=>$this->config->tb->sms_enviados),array('message_id'))
		
			->joinLeft(array('CALLBACK'=>$this->config->tb->callback_sms),
					'"CALLBACK".message_id = "ENVIADOS".message_id',array('message_id'))
						 
			->where('"ENVIADOS".id_campanha = '.$params[id].' AND "CALLBACK".mo_type = \'4\' AND "CALLBACK".dlvrd '.$params['tipo'].'= \'001\' ')
			->group(array('ENVIADOS.message_id','CALLBACK.message_id'));
						 
		$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
		$this->view->relatorio = $relatorio->fetchAll();
		echo count($this->view->relatorio); exit;
		
	}
	
	public function clickAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		if ($params['total']){
			$campos = array('count(id_click) AS total');
		} else {
			$campos = array('*');
		}
		
		$relatorio = new Zend_Db_Select($this->db);
		$relatorio->from(array('CLICK'=>$this->config->tb->templates_click),$campos)
			
			->where('id_campanha = '.$params['id']);
			
			if ($params['total']){
				$relatorio->limit(1,0);
			} else {
				$relatorio->order('id_click DESC');
			}
			
		$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
		$this->view->relatorio = $relatorio->fetchAll();
				 
		if ($params['total']){
			
			echo $this->view->relatorio[0]->total == '' ? '0' : $this->view->relatorio[0]->total;
			
		} else {
			
			$result = array();
			
			foreach((array)$this->view->relatorio as $row){
				array_push($result, $row);
			}
				
			echo json_encode($result);
			
		}
		
		exit;
		
	}
	
	public function formulariosAction()
	{
	
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
	
		$relatorio = new Zend_Db_Select($this->db);
		$relatorio->from(array('CONTATO'=>$this->config->tb->contato_campanha),array('*'))
			->where('id_campanha = '.$params['id'])
			->order('celular');
		$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
		$this->view->relatorio = $relatorio->fetchAll();
	
		if ($params['total']){
				
			echo count($this->view->relatorio);
			exit;
				
		} else {
				
			$result = array();
				
			foreach((array)$this->view->relatorio as $row){
				array_push($result, $row);
			}
	
			echo json_encode($result);
				
		}
	
		exit;
	
	}
	
	public function aberturaAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		if ($params['total']){
			$campos = array('count(id_visualizacao) AS total');
		} else {
			$campos = array('*');
		}
		
		$relatorio = new Zend_Db_Select($this->db);
		$relatorio->from(array('ABERTURA'=>$this->config->tb->campanhas_visu),$campos)
			
			->where('id_campanha = '.$params['id']);
			
			if ($params['total']){
				$relatorio->limit(1,0);
			} else {
				$relatorio->order('id_visualizacao DESC');
			}
			
		$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
		$this->view->relatorio = $relatorio->fetchAll();
		
		if ($params['total']){
			
			echo $this->view->relatorio[0]->total == '' ? '0' : $this->view->relatorio[0]->total;
			
		} else {
			
			$result = array();
			
			foreach((array)$this->view->relatorio as $row){
				array_push($result, $row);
			}
				
			echo json_encode($result);
			
		}
		
		exit;
		
	}
	
	public function errosAction()
	{
	
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
	
		$relatorio = new Zend_Db_Select($this->db);
		$relatorio->from(array('ERRO'=>$this->config->tb->sms_erros),array('*'));
			
			if ($params['id']){
				$relatorio->where('id_campanha = \''.$params[id].'\'');
			}
			
			if ($post['id_usuario']){
				$relatorio->where('id_usuario = \''.$params[id_usuario].'\'');
			}
			
			if ($params['d_i']){
				$relatorio->where('criado >= \''.$params['d_i'].'\'');
			}
			
			if ($params['d_f']){
				$relatorio->where('criado <= \''.$params['d_f'].'\'');
			}
			
		$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
		$this->view->relatorio = $relatorio->fetchAll();
	
		echo count($this->view->relatorio); exit;
	
	}
	
	public function enviadosAction()
	{
	
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		$relatorio = new Zend_Db_Select($this->db);
		$relatorio->from(array('ENVIADOS'=>$this->config->tb->sms_enviados),array('*'))
			->where('id_campanha = \''.$params[id].'\'');
		$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
		$this->view->relatorio = $relatorio->fetchAll();
		
		echo count($this->view->relatorio); exit;
		
	}
	
	public function infoAberturaAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		$relatorio = new Zend_Db_Select($this->db);
		$relatorio->from(array('VISU'=>$this->config->tb->campanhas_visu),array('contato'))
			->where('"VISU".id_campanha = '.$params['id'].'');
			$relatorio->group('VISU.contato');
		$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
		$this->view->relatorio = $relatorio->fetchAll();
		
		echo count($this->view->relatorio); exit;
		
	}
	
	public function infoClickAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		$relatorio = new Zend_Db_Select($this->db);
		$relatorio->from(array('VISU'=>$this->config->tb->campanhas_visu),array('*'))
			->where('"VISU".id_campanha = '.$params['id'].'');
		$relatorio = $relatorio->query(Zend_Db::FETCH_OBJ);
		$this->view->relatorio = $relatorio->fetchAll();
		
		if (count($this->view->relatorio) > 0){
			echo $this->view->relatorio[0]->criado;
		} else {
			echo 'Não teve cliques';
		}
		
		exit;
		
	}
	
	public function creditoUtilizadoAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		if (!$params['data_inicio']){
			$params['data_inicio'] = date('01-m-Y');
		}
		
		if (!$params['data_final']){
			$params['data_final'] = date("01-m-Y",strtotime(date("Y-m-t", strtotime(date('Y-m-t')))));
		}
		
		$d_i = explode('-',$params['data_inicio']);
		$d_f = explode('-',$params['data_final']);
		
		$dataInicio = $d_i[2].'-'.$d_i[1].'-'.$d_i[0].' 00:00';
		$dataFinal = $d_f[2].'-'.$d_f[1].'-'.$d_f[0].' 00:00';
		
		$sms_enviados = new Zend_Db_Select($this->db);
		$sms_enviados->from(array('SMS_ENVIADOS'=>$this->config->tb->sms_enviados),array('*'))
		
			->where('"SMS_ENVIADOS".criado >= \''.$dataInicio.'\' AND "SMS_ENVIADOS".criado <= \''.$dataFinal.'\' AND "SMS_ENVIADOS".id_usuario = '.$post['id_usuario'].' ');
				 
		$sms_enviados = $sms_enviados->query(Zend_Db::FETCH_OBJ);
		$this->view->sms_enviados = $sms_enviados->fetchAll();
			
		$result = array();
				
		foreach((array)$this->view->sms_enviados as $row){
			array_push($result, $row);
		}
		
		$json = json_encode($result);

		echo $json;
		exit;
			
	}
	
	public function smsAbertoAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		if (!$params['data_inicio']){
			$params['data_inicio'] = date('01-m-Y');
		}
		
		if (!$params['data_final']){
			$params['data_final'] = date("01-m-Y",strtotime(date("Y-m-t", strtotime(date('Y-m-t')))));
		}
		
		$d_i = explode('-',$params['data_inicio']);
		$d_f = explode('-',$params['data_final']);
		
		$dataInicio = $d_i[2].'-'.$d_i[1].'-'.$d_i[0].' 00:00';
		$dataFinal = $d_f[2].'-'.$d_f[1].'-'.$d_f[0].' 00:00';
		
		$sms_aberto = new Zend_Db_Select($this->db);
		$sms_aberto->from(array('sms_aberto'=>$this->config->tb->campanhas_visu),array('id_visualizacao','criado'))
		 
			->where('"sms_aberto".criado >= \''.$dataInicio.'\' AND "sms_aberto".criado <= \''.$dataFinal.'\' AND "sms_aberto".id_usuario = '.$post['id_usuario'].' ');
		
		$sms_aberto = $sms_aberto->query(Zend_Db::FETCH_OBJ);
		$this->view->sms_aberto = $sms_aberto->fetchAll();
		
		$result = array();
		
		foreach((array)$this->view->sms_aberto as $row){
			array_push($result, $row);
		}
			
		echo json_encode($result);
		exit;
		
	}
	
	public function relatorioTotalAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		if (!$params['data_inicio']){
			$params['data_inicio'] = date('01-m-Y');
		}
		
		if (!$params['data_final']){
			$params['data_final'] = date("01-m-Y",strtotime(date("Y-m-t", strtotime(date('Y-m-t')))));
		}
		
		$d_i = explode('-',$params['data_inicio']);
		$d_f = explode('-',$params['data_final']);
		
		$dataInicio = $d_i[2].'-'.$d_i[1].'-'.$d_i[0].' 00:00';
		$dataFinal = $d_f[2].'-'.$d_f[1].'-'.$d_f[0].' 00:00';
		
		$sms_enviados = new Zend_Db_Select($this->db);
		$sms_enviados->from(array('SMS_ENVIADOS'=>$this->config->tb->sms_enviados),array('id_sms_enviado','criado'))
		
			->where('criado >= \''.$dataInicio.'\' AND criado <= \''.$dataFinal.'\' AND id_usuario = '.$post['id_usuario'].' ');
				 
		$sms_enviados = $sms_enviados->query(Zend_Db::FETCH_OBJ);
		$this->view->sms_enviados = $sms_enviados->fetchAll();
		
		$result = array();
		
		foreach((array)$this->view->sms_enviados as $row){
			array_push($result, $row);
		}
			
		echo json_encode($result);
		exit;
		
	}
	
	public function relatorioMensalAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		$mes = array('','Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez');
		 
		$d_i = explode('-',$params['data_inicio']);
		$d_f = explode('-',$params['data_final']);
		 
		$dataInicio = $d_i[2].$d_i[1].$d_i[0];
		$dataFinal = $d_f[2].$d_f[1].$d_f[0];
		 
		$CdataInicio = $d_i[2].'-'.$d_i[1].'-'.$d_i[0].'';
		$CdataFinal = $d_f[2].'-'.$d_f[1].'-'.$d_f[0].'';
		 
		$mesIncio = date('Y-m-d', strtotime($CdataInicio));
		$mesFinal = date('Y-m-d', strtotime($CdataFinal));
		
		$data1 = new DateTime( $mesFinal );
		$data2 = new DateTime( $mesIncio );
		
		$intervalo = $data1->diff( $data2 );
		 
		$dif = ceil(strtotime($CdataFinal) - strtotime($CdataInicio));
		 
		$dias = floor($dif / (60 * 60 * 24));
		 
		if ($dias < 30){
			$meses = 2;
		} else {
			$meses = $dif / (60 * 60 * 24 * 31);
		}

		$anoInicial = $d_i[2];
		 
		$retorno = array();
		
		for ($i = 0; $i <= $intervalo->y * 12 + $intervalo->m; $i++) {
		
			$m = date("m",strtotime(date("Y-m-d", strtotime($CdataInicio)) . " +".$i." month"));
			$y = date("Y",strtotime(date("Y-m-d", strtotime($CdataInicio)) . " +".$i." month"));
		
			$proxMes = date("m",strtotime(date("Y-m-d", strtotime($CdataInicio)) . " +".$i." month"));
		
			$b = $i + 1;
		
			$dia_i = $d_i[0];
			$dia_f = $d_f[0];
		
			if ($i != 0){
				if ($dia_i >= $dia_f && $mesFinal != $proxMes){
					$dia_i = '01';
					$dia_f = 31;
				}
				 
				if ($dia_i > $dia_f && $mesFinal == $proxMes){
					$dia_f = $d_f[0];
					$dia_i = '01';
				}
			} else {
				$dia_f = '31';
				$dia_i = $d_i[0];
			}
		
			$dateSearchInicio = date("Y-m-".$dia_i,strtotime(date("Y-m-d", strtotime($CdataInicio)) . " +".$i." month"));
			$dateSearchFim = date("Y-m-".$dia_f,strtotime(date("Y-m-d", strtotime($CdataInicio)) . " +".$i." month"));
			
			$sms_enviados = new Zend_Db_Select($this->db);
			$sms_enviados->from(array('SMS_ENVIADOS'=>$this->config->tb->sms_enviados),array('id_sms_enviado','criado'))
			 
				->where('"SMS_ENVIADOS".criado >= \''.$dateSearchInicio.'\' AND "SMS_ENVIADOS".criado <= \''.$dateSearchFim.'\' AND "SMS_ENVIADOS".id_usuario = '.$post['id_usuario'].' ');
		
			$sms_enviados = $sms_enviados->query(Zend_Db::FETCH_OBJ);
			$this->view->sms_enviados = $sms_enviados->fetchAll();
			$total = count($this->view->sms_enviados);
		
			array_push($retorno, array(
					'mes'=>$mes[ceil($m)],
					'ano'=>$y,
					'envios'=>$total
				)
			);
		
		}
		 
		echo json_encode($retorno);
		exit;
		
	}
	
	public function totalContatosAction()
	{
		
		$params = $this->_request->getParams();
		$post = $this->_request->getPost();
		
		$sql = new Zend_Db_Select($this->db);
		$sql->from(array('C'=>$this->config->tb->contatos),array('count(id_contato) AS total'));
		
			$sql->where('id_lista IN ('.$post['id_lista'].')');
			$sql->limit(1,0);
			
		$sql = $sql->query(Zend_Db::FETCH_OBJ);
		$this->view->contatos = $sql->fetchAll();
		
		echo $this->view->contatos[0]->total; exit;
		
	}
	
	public function callbackAction()
	{
		
		$params = $this->_request->getParams();
		$params['user'] = 'bol3638196';
		
		$sms_callback = new Zend_Db_Select($this->db);
		$sms_callback->from(array('sms_callback'=>$this->config->tb->callback_sms),array('message_id'))
		
			->joinLeft(array('ENVIADOS'=>$this->config->tb->sms_enviados),
				'"ENVIADOS".message_id = "sms_callback".message_id',array('message_id'))
		
			->where('sms_callback.criado >= \''.$params['d_i'].'\' AND sms_callback.criado <= \''.$params['d_f'].'\' AND sms_callback.mo_type = \'4\' AND sms_callback.source_address = \''.$params['user'].'\'')
			->group('ENVIADOS.message_id','sms_callback".message_id');
			
		$sms_callback = $sms_callback->query(Zend_Db::FETCH_OBJ);
		print_r($sms_callback); exit;
		$this->view->callback = $sms_callback->fetchAll();
		
		
		$result = array();
		
		foreach((array)$this->view->callback as $row){
			array_push($result, $row);
		}
			
		echo json_encode($result);
		exit;
		
	}
    
}