<?php
include_once 'library/Zend/Controller/Action.php';

class My_Controller extends Zend_Controller_Action {

	protected $_messages = null;
	
	public function init() {
		
		/* messages */
		$this->_messages 	= $this->_helper->getHelper('FlashMessenger');
		$this->view->e 		= current($this->_messages->getMessages());
		
		/* parse to view */
		$this->view->production 	= Zend_Registry::get ( 'production' );
		$this->view->baseModule 	= $this->getRequest ()->getModuleName ();
		$this->view->baseController = $this->getRequest ()->getControllerName ();
		$this->view->baseAction 	= $this->getRequest ()->getActionName ();
		$this->view->baseUrl 		= Zend_Registry::get ( 'config' )->www->baseurl;
		$this->view->baseImg 		= Zend_Registry::get ( 'config' )->www->baseimg;
		$this->view->baseHost 		= Zend_Registry::get ( 'config' )->www->host;
		$this->view->front 			= Zend_Registry::get ( 'config' )->www->front;
		
		$this->view->pathUpload 	= $this->pathUpload = $_SERVER ['DOCUMENT_ROOT'] . (Zend_Registry::get ( 'config' )->www->baseimgUp);
		
		/* configs */
		$this->_helper->getHelper ( 'viewRenderer' )->setViewSuffix ( 'php' );
		$this->config 	= Zend_Registry::get ( 'config' );
		$this->session 	= Zend_Registry::get ( 'session' );
		$this->db 		= Zend_Registry::get ( 'db' );
		
		$this->view->post = $this->post = $this->_request->getPost();
		
		/* auth */
		$auth 		= new Zend_Auth_Storage_Session ( $this->config->www->sessionname );
		$this->auth = $auth;
		$this->me 	= $this->view->me = $auth->read ();
		Zend_Registry::set ( 'me', $this->view->me );
		
		if ( $this->view->baseModule == 'api' || $this->view->baseModule == 'naichesms' ):
		
			header('Access-Control-Allow-Origin: *');
		
			Zend_Controller_Front::getInstance()->setParam('noViewRenderer', true);
		
			if ($this->view->baseAction == 'index' && $this->view->baseController == 'index'):
				
				$acl = array();
				$modulo = array();
				$modulo['api'] = './app/modules/'.$this->view->baseModule.'/controllers';
				
				foreach ($modulo as $module => $path) {
					
					foreach (scandir($path) as $file) {
				
						if (strstr($file, "Controller.php") !== false) {
				
							include_once $path . DIRECTORY_SEPARATOR . $file;
				
							foreach (get_declared_classes() as $class) {
				
								if (is_subclass_of($class, 'Zend_Controller_Action')) {
				
									$controller = strtolower(substr($class, 0, strpos($class, "Controller")));
									$controller = str_replace($this->view->baseModule.'_', '', $controller);
									$actions = array();
				
									foreach (get_class_methods($class) as $action) {
				
										if (strstr($action, "Action") !== false) {
											$actions[] = $action;
											$actions = str_replace('Action', '', $actions);
										}
									}
								}
							}
				
							
							$acl[$controller] = $actions;
							
						}
					}
				}
			
				echo '<ul>';
				foreach ($acl as $controller => $action):
				
					echo '<li><h3 style="margin:0px; padding:0px; margin-top:10px;">'.$controller.'</h3></li>';
					
					foreach($action as $row):
						echo '<li><a>'.$row.'</a></li>';
					endforeach;
				
				endforeach;
				echo '</ul>';
			
			endif;
		
		endif;
		
		$this->ini();
		
	}	
	
	public function groupBy($tabela, $nome, $campos){
		
		
		$row_tabela = explode(',', $tabela);
		$row_nome = explode(',', $nome);
		$row_campos = explode(',', $campos);
		
		$total_tabela = count($row_tabela);
		$total_nome = count($row_nome);
		$total_campos = count($row_campos);
		
		$campo = 0;
		
		$retorno = array();
		
		foreach($row_tabela as $row_t){
			
			$db = new Zend_Db_Select($this->db);
			$sql = $db->getAdapter()->quoteInto("
						SELECT rel.nspname, rel.relname, attrs.attname, \"Type\", \"Default\",   attrs.attnotnull
						FROM (
							SELECT c.oid, n.nspname, c.relname
							FROM pg_catalog.pg_class   c
							LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
							WHERE pg_catalog.pg_table_is_visible(c.oid)   ) rel
						JOIN (
							SELECT a.attname, a.attrelid, pg_catalog.format_type(a.atttypid,   a.atttypmod)
						AS \"Type\",
							(SELECT substring(d.adsrc for 128) FROM pg_catalog.pg_attrdef   d
							WHERE d.adrelid = a.attrelid AND d.adnum = a.attnum AND a.atthasdef)
						AS \"Default\",
						a.attnotnull, a.attnum
							FROM pg_catalog.pg_attribute a WHERE a.attnum > 0   AND NOT a.attisdropped )
						ATTRS
							ON (attrs.attrelid = rel.oid )
							WHERE relname = 'zz_".$row_t."' ORDER BY attrs.attnum;", "");
			
			$result = $db->getAdapter()->fetchAll($sql);
			$this->view->result = $this->result = $result;
			
			array_push(
				$retorno, $row_nome[$campo].'.'.$row_campos[$campo]
			);
			
			foreach($this->view->result as $row){
				
				if ($row['attname'] != $row_campos[$campo]){
				
					array_push(
						$retorno, $row_nome[$campo].'.'.$row['attname']
					);
				
				}
		
			}
			
			$campo++;
		
		}
		
		
		//print_r($retorno); exit();
		
		return $retorno;
		
	}
	
	public function __call($methodName, $arg) {
		$action = substr ( $methodName, 0, strlen ( $methodName ) - 6 );
		$this->render ( $action );
	}
	
}