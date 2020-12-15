<?php
set_time_limit(90);
ini_set('memory_limit', '256M');

include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class Api_ImportacaoController extends My_Controller 
{
	
	    
    public function uploadArquivoAction()
    {
    	
    	$post = $this->_request->getPost();
    	$get = $this->_request->getPost();
    	
    	if ($_POST['upload'] == 'novo'){
    	
    		// UPLOAD DO CSV
    		$file 		= $_FILES['uploadfile'];
    		$path 		= '';
    		$options 	= array(	'path' 		=> '',
    				'where' 	=> NULL,
    				'size' 	=> 500000,
    				'type' 		=> 'file',
    				'root' 		=> $this->pathUpload.'csv/' );
    		$upload =  new App_File_Upload($file, $path, $options);
    	
    		// TIPO DE ARQUIVO, SE É SEPARADO POR , OU ;
    		$post['tipo'] = $_POST['tipo'];
    	
    		// DIRETORIO DO ARQUIVO CSV
    		$diretorio = 'assets/uploads/csv/'.$upload->_where();
    	
    		//le a primeira linha
    		$fp = fopen($_SERVER['DOCUMENT_ROOT'].'/'.$diretorio, 'r');
    		$leitura = str_replace(' ', '_', fgets( $fp ) );
    		fclose( $fp );
    		
    		//edita primeira linha
    		$fp = fopen($_SERVER['DOCUMENT_ROOT'].'/'.$diretorio, 'r+');
    		fwrite($fp, $leitura);
    		fclose( $fp );
    		
    		// VE SE A EXTENSÃO É VÁLIDA
    		$extensao = explode('.', $diretorio);
    		$extensao = $extensao[1];
    	
    		// DIRETORIO DOS CSV QUEBRADO
    		$config = array();
    		$config['arquivo'] = $diretorio;
    		$config['tipo'] = $post['tipo'];
    		$config['lista'] = $post['lista'];
    		$config['topo'] = $post['topo'];
    	
//     		echo '<pre>';print_r($post); exit;
    		
    		$diretorioQuebrado = $this->arquivaContatos($config);
    		$post['diretorioQuebrado'] = $diretorioQuebrado;
    		
    		$post['topo_csv'] = $this->campos($post);
    		$post['arquivo'] = $upload->_where();
    	
    		// VERIFICA SE A EXTENSÃO É VALIDA E PERMITE A CONTINUAÇÃO DA IMPORTAÇÃO
    		if ($extensao != 'csv' && $extensao != 'CSV'):
    	
    			$this->_redirect($post['url_old'].$post['basemodule'].'/banco-dados/index?error=Arquivo com formato inválido, é aceito apenas CSV');
    	
    		else:
    	
    			$this->redirect_post($post['url_old'].$post['basemodule'].'/banco-dados/campos', $post);
    	
    		endif;
    		 
    	}
    	
    }
        
    public function sendAction()
    {
    	
    	// ESSA ETAPA CRIA O CONFIG DENTRO DA PASTA
    	$post = $this->_request->getPost();
    	$post['topo'] = json_decode($post['topo']);
    	
    	if ( !$post['id_lista'] ) {
    		
    		$this->_redirect( $post['url_old'].'/'.$post['basemodule'].'/banco-dados?error=list' );
    		exit;
    		
    	}
    	
    	$dir = $_SERVER['DOCUMENT_ROOT'].'/assets/importacao/'.$post['diretorio'].'/config.txt';
    	
    	$dirPasta = $_SERVER['DOCUMENT_ROOT'].'/assets/importacao/'.$post['diretorio'];
    	$dirNovo = $_SERVER['DOCUMENT_ROOT'].'/importacao/'.$post['diretorio'];
    	
    	$myfile = fopen($dir, "w+") or die("Unable to open file!");
    	fwrite($myfile, json_encode($post));
    	fclose($myfile);
    	
    	echo $dirPasta;
    	echo '<br/>';
    	echo $dirNovo;
    	
    	$this->copiar_diretorio($dirPasta, $dirNovo);
    	
    	$urlRedirect = $post['url_old'].'/'.$post['basemodule'].'/banco-dados/processando?key='.$post['diretorio'].'&id_lista='.$post['id_lista'];
    	
//     	echo $urlRedirect; exit;
    	
    	$this->_redirect($urlRedirect);
    	
    }
    
    public function cronImportacaoAction()
    {
    	
    	$dir = $_SERVER['DOCUMENT_ROOT'].'/importacao/';
    	$files = scandir($dir);
    	
    	unset($files[0]);
    	unset($files[1]);
    	$totalPastas = count($files);
    	
    	if ($totalPastas == 0){
    		
    		die('Nenhuma importação.');
    		
    	} else {
    		
    		$primeiroFila = $files[2];
    		$diretorioPrimeiroFila = $dir.'/'.$primeiroFila;
    		$files = scandir($diretorioPrimeiroFila);
    		$config = $files[2];
    		unset($files[0]);
    		unset($files[1]);
    		unset($files[2]);
    		$totalArquivos = count($files);
    		
    		if ($totalArquivos == 0){
    			
    			unlink($diretorioPrimeiroFila.'/'.$config);
    			rmdir($diretorioPrimeiroFila);
    			die('Removeu uma pasta da fila.');
    			
    		} else {
    			
	    		$contatos = $files[3];
				
	    		$insere = $this->importaCsvContatosMultiplos($primeiroFila, $contatos);
	    		
	    		//echo '<pre>'; print_r( $insere ); exit;
	    		
	    		if ($insere['result'] == 'true'){
	    			
	    			unlink($diretorioPrimeiroFila.'/'.$contatos);
	    			die('remove '.$diretorioPrimeiroFila.'/'.$contatos);
	    			
	    		} else {
	    			
	    			echo $insere;
	    			unlink($diretorioPrimeiroFila.'/'.$config);
	    			rmdir($diretorioPrimeiroFila);
	    			die('Erro interno na importação, removemos da fila para não interferir.');
	    			
	    		}
    		
    		}
    		
    	}
    	
    	
    }
    
    public function acompanhamentoAction()
    {
    	
    	$get = $this->_request->getParams();
    	$pasta = $_SERVER['DOCUMENT_ROOT'].'/importacao/'.$get['key'];
    	
    	
    	@$files = scandir($pasta);
    	
    	if (!$files){
    		
    		die('100');
    		
    	}
    	
    	unset($files[0]);
    	unset($files[1]);
    	unset($files[2]);
    	
    	$totalAtual = count($files);
    	
    	if ($get['type'] == 'start'){
    		
    		echo $totalAtual; exit;
    		
    	} else {
    		
    		$total = $get['total'];
    		$porcentagem =  $totalAtual/ $total * 100 - 100;
    		$porcentagem = $porcentagem * (-1);
    		$porcentagem = ceil($porcentagem);
    		echo $porcentagem; exit;
    		
    	}
    	
    }
    
    public function processandoAction()
    {
    	
    	$get = $this->_request->getParams();
    	$pasta = $_SERVER['DOCUMENT_ROOT'].'/importacao/'.$get['key'].'/config.txt';
    	
    	$myfile = fopen($pasta, "r") or die( $this->_redirect($this->baseModule) );
    	fclose($myfile);
    	
    }
    
    public function consultaPastaAction()
    {
        
        $get = $this->_request->getParams();
        
        $dir = $_SERVER['DOCUMENT_ROOT'].'/importacao/'.$get['pasta'];
        
        if ( file_exists( $dir ) ) {
            die('true');
        } else {
            die('false');
        }
        
    }
    
    private function campos($get)
    {
    	 
    	$get = (object)$get;
    	unset($get->controller);
    	unset($get->whitelabel);
    	unset($get->action);
    	unset($get->module);
    	unset($get->upload);
    	//print_r($get); exit;
    	 
    	$this->view->cabecalho = $get->topo;
    	 
    	// DIRETORIO DOS CSV QUEBRADOS.
    	$dir = $_SERVER['DOCUMENT_ROOT'].'/assets/importacao/'.$get->diretorioQuebrado;
    	 
    	// ABRE O ARQUIVO E MONTA O TOPO
    	$fp = fopen($dir.'/splitcronimport00', "r");
    	// processa os dados do arquivo
    	 
    	$prilinha = fgetcsv($fp, 0, $get->tipo);
    	 
    	// PRIMEIRA LINHA
    	$i=0;
    	foreach($prilinha as $dados){
    		 
    		$topo[$i] = $dados;
    		$topo[$i] = $this->antiInjection( $topo[$i] );
    		$topo[$i] = preg_replace(array("/(ç)/","/(á|à|ã|â|ä)/","/(Á|À|Ã|Â|Ä)/","/(é|è|ê|ë)/","/(É|È|Ê|Ë)/","/(í|ì|î|ï)/","/(Í|Ì|Î|Ï)/","/(ó|ò|õ|ô|ö)/","/(Ó|Ò|Õ|Ô|Ö)/","/(ú|ù|û|ü)/","/(Ú|Ù|Û|Ü)/","/(ñ)/","/(Ñ)/"),explode(" ","c a A e E i I o O u U n N"),$topo[$i]);
    		
    		$i++;
    		 
    	}
    	 
    	fclose($fp);
    	
    	return $topo;
    	 
    }
    
    private function antiInjection($sql)
    {
    
    	$sql = preg_replace(array("/(ç)/","/(á|à|ã|â|ä)/","/(Á|À|Ã|Â|Ä)/","/(é|è|ê|ë)/","/(É|È|Ê|Ë)/","/(í|ì|î|ï)/","/(Í|Ì|Î|Ï)/","/(ó|ò|õ|ô|ö)/","/(Ó|Ò|Õ|Ô|Ö)/","/(ú|ù|û|ü)/","/(Ú|Ù|Û|Ü)/","/(ñ)/","/(Ñ)/"),explode(" ","c a A e E i I o O u U n N"),$sql);
    	$sql = str_replace("'", "`", $sql);
    	$sql = addslashes($sql);
    	$sql = trim($sql);
    	$sql = strip_tags($sql);
    	$sql = (get_magic_quotes_gpc()) ? $sql : addslashes($sql);
    	return $sql;
    
    }
    
    private function importaCsvContatosMultiplos($diretorio, $arquivo)
    {
    	
    	$dir = $_SERVER['DOCUMENT_ROOT'].'/importacao/'.$diretorio.'/';
    	$config = $dir.'config.txt';
    	
    	$myfile = fopen($config, "r") or die( $this->delTree($dir) );
    	$conteudo = fgets ($myfile);
    	fclose($myfile);
    	
    	$postGet = json_decode($conteudo);
    	$postGet = (array)$postGet;
    	
    	$cabecalho = $postGet['cabecalho'];
    	
    	// REMONTA O POSTGET
    	foreach($postGet as $key => $row)
    	{
    		
    		if ( is_array($row) ){
    			
    			$postGet[$key] = array();
    			
    			foreach($row as $keyd => $rowd){
    				
    				$postGet[$key][$keyd] = $rowd;
    				
    				$postGet[$key][$keyd] = $this->antiInjection( $postGet[$key][$keyd] );
    				$postGet[$key][$keyd] = preg_replace(array("/(ç)/","/(á|à|ã|â|ä)/","/(Á|À|Ã|Â|Ä)/","/(é|è|ê|ë)/","/(É|È|Ê|Ë)/","/(í|ì|î|ï)/","/(Í|Ì|Î|Ï)/","/(ó|ò|õ|ô|ö)/","/(Ó|Ò|Õ|Ô|Ö)/","/(ú|ù|û|ü)/","/(Ú|Ù|Û|Ü)/","/(ñ)/","/(Ñ)/"),explode(" ","c a A e E i I o O u U n N"), $postGet[$key][$keyd] );
//     				$postGet[(string)$key] = preg_replace('/[A-Za-z0-9, ();:!@#$%¨&*-<>?=]/i', '', $postGet[(string)$key]);
    				
    			}
    			
    		} else {
    			
    			$postGet[(string)$key] = $row;
    			
    			$postGet[(string)$key] = $this->antiInjection( $postGet[(string)$key] );
    			$postGet[(string)$key] = preg_replace(array("/(ç)/","/(á|à|ã|â|ä)/","/(Á|À|Ã|Â|Ä)/","/(é|è|ê|ë)/","/(É|È|Ê|Ë)/","/(í|ì|î|ï)/","/(Í|Ì|Î|Ï)/","/(ó|ò|õ|ô|ö)/","/(Ó|Ò|Õ|Ô|Ö)/","/(ú|ù|û|ü)/","/(Ú|Ù|Û|Ü)/","/(ñ)/","/(Ñ)/"),explode(" ","c a A e E i I o O u U n N"), $postGet[(string)$key] );
//     			$postGet[(string)$key] = preg_replace('/[A-Za-z0-9, ();:!@#$%¨&*-<>?=]/i', '', $postGet[(string)$key]);
    			
    		}
    		
    		
    	}
    	
    	$diretorio 		= $dir.$arquivo;
    	$topo_conf		= $postGet['cabecalho'];
    	$tipo 			= $postGet['tipo'];
    	$lista	 		= $postGet['id_lista'];
    	$cerca 			= '"';
    	
    	// TOTAL DE LINHAS (REGISTROS)
    	$totalLinhas = count( file( $diretorio ) );
    	
    	// ABRE O ARQUIVO
    	$fp = fopen($diretorio, "r");
    	
    	// MONTA O ARRAY CORRETO COM TODOS OS REGISTROS
    	$linha = 0;
   		while(($dados = fgetcsv($fp, 0, $tipo)) !== FALSE){
    		
   			$countFtpImporta = count( explode('|', $dados[0]) );

   			if ( $countFtpImporta < 6 ) {
   			
	   		    if ( count(explode('|', $dados[0])) == 1 ) {   		    
	    		$quant_campos = count($dados);
	    		
	    		for($i = 0; $i < $quant_campos; $i++){
	    			
	    			//echo $linha;
	    			
	    			if ($linha == 0){
	    				
	    				$topo[$i] = $postGet['topo'][$i];
	    				echo $i;
	    					
		    			
		    			$topo[$i] = $this->limpaCampo($topo[$i], true);
						
		    			if ($diretorio != $dir.'splitcronimport00'){
		    				
		    				$post[ $linha ][$postGet[$topo[$i]]] = $dados[$i];
		    				
		    				$post[ $linha ][$postGet[$topo[$i]]] = $this->antiInjection( $post[ $linha ][$postGet[$topo[$i]]] );
		    				$post[ $linha ][$postGet[$topo[$i]]] = preg_replace(array("/(ç)/","/(á|à|ã|â|ä)/","/(Á|À|Ã|Â|Ä)/","/(é|è|ê|ë)/","/(É|È|Ê|Ë)/","/(í|ì|î|ï)/","/(Í|Ì|Î|Ï)/","/(ó|ò|õ|ô|ö)/","/(Ó|Ò|Õ|Ô|Ö)/","/(ú|ù|û|ü)/","/(Ú|Ù|Û|Ü)/","/(ñ)/","/(Ñ)/"),explode(" ","c a A e E i I o O u U n N"), $post[ $linha ][$postGet[$topo[$i]]] );
		    				
		    				$post[ $linha ]['id_lista'] = $lista;
		    				$post[ $linha ]['linha_arquivo'] = $linha;
		    				$post[ $linha ]['nome_arquivo'] = $diretorio;
		    				
		    			} else {
		    				
							if ($topo_conf == 'nao'){
									
								$post[ $linha ][$postGet[$topo[$i]]] = $dados[$i];
								
								$post[ $linha ][$postGet[$topo[$i]]] = $this->limpaCampo($post[ $linha ][$postGet[$topo[$i]]]);
								$post[ $linha ][$postGet[$topo[$i]]] = $this->antiInjection( $post[ $linha ][$postGet[$topo[$i]]] );
								$post[ $linha ][$postGet[$topo[$i]]] = preg_replace(array("/(ç)/","/(á|à|ã|â|ä)/","/(Á|À|Ã|Â|Ä)/","/(é|è|ê|ë)/","/(É|È|Ê|Ë)/","/(í|ì|î|ï)/","/(Í|Ì|Î|Ï)/","/(ó|ò|õ|ô|ö)/","/(Ó|Ò|Õ|Ô|Ö)/","/(ú|ù|û|ü)/","/(Ú|Ù|Û|Ü)/","/(ñ)/","/(Ñ)/"),explode(" ","c a A e E i I o O u U n N"), $post[ $linha ][$postGet[$topo[$i]]] );
								$post[ $linha ][$postGet[$topo[$i]]] = preg_replace("/[^a-z0-9_, ();:!@#$%¨&*-<>?=]/i", "", $post[ $linha ][$postGet[$topo[$i]]] );
								
								$post[ $linha ]['id_lista'] = $lista;
								$post[ $linha ]['linha_arquivo'] = $linha;
								$post[ $linha ]['nome_arquivo'] = $diretorio;
								
							}
							
		    			}
		    			
	    			} else {
	    				
	    				
	    				
	    				if ( $postGet[ $topo[$i] ] == 'celular' ){
	    					
	    					$post[ $linha ][ $postGet[ $topo[$i] ] ] = $this->limpaCelular($dados[$i]);
	    					
	    				} else {
	    				    
	    				    $post[ $linha ][ $postGet[ $topo[$i] ] ] = $this->limpaCampo($dados[$i]);
	    				    $post[ $linha ][ $postGet[ $topo[$i] ] ] = preg_replace("/[^a-z0-9_, ();:!@#$%¨&*-<>?=]/i", "", $post[ $linha ][ $postGet[ $topo[$i] ] ]);
	    				    
	    				}
	    				
	    				$post[ $linha ]['id_lista'] = $lista;
	    				$post[ $linha ]['linha_arquivo'] = $linha;
	    				$post[ $linha ]['nome_arquivo'] = $diretorio;
	    				
	    			}
	    			
	    		}
	    		
	    		$linha ++;
	    		
	   		    }
   		    
   			}
    		
    	}
    	
//     	echo '<pre>'; print_r( $post ); exit;
    	
    	// ENVIA TODOS CONTATOS MULTIPLOS PARA O POSTGRESQL
    	$file = $_SERVER['HTTP_HOST'].'/api/contatos/new-contato-multiplos';
    	$result = $this->httpPost($file, $post, $cabecalho);
    	
    	$result = json_decode($result);
    	
    	return array('result'=>$result->retorno, 'query'=>$result->query);
    	
    }
    
    private function limpaCampo($string, $topo = NULL) {
    	
    	if ($topo){
    		$string = str_replace(' ', '-', $string);
    		$string = str_replace('@', '-', $string);
    		$string = str_replace('(', '', $string);
    		$string = str_replace(')', '', $string);
    		$string = str_replace('.', '-', $string);
    	}
    	
    	if ( mb_detect_encoding($string) != 'UTF-8' ){
//     	    $string = utf8_encode($string);
    	}
    	
    	if (!$topo){
    	   //echo $string; echo ':'; print_r( mb_detect_encoding($string) ); echo '<br/>';
    	}
    	
    	$string = preg_replace(array("/(ç)/","/(á|à|ã|â|ä)/","/(Á|À|Ã|Â|Ä)/","/(é|è|ê|ë)/","/(É|È|Ê|Ë)/","/(í|ì|î|ï)/","/(Í|Ì|Î|Ï)/","/(ó|ò|õ|ô|ö)/","/(Ó|Ò|Õ|Ô|Ö)/","/(ú|ù|û|ü)/","/(Ú|Ù|Û|Ü)/","/(ñ)/","/(Ñ)/"),explode(" ","c a A e E i I o O u U n N"), $string );
//     	$string = preg_replace('/[A-Za-z0-9, ();:!@#$%¨&*-<>?=]/i', '', $string);
    	
    	return $string;
    	
    }
    
    private function limpaCelular($string) {
    		
    	$string = str_replace('-', '', $string);
    	$string = str_replace(' ', '', $string);
    	$string = str_replace('@', '', $string);
    	$string = str_replace('(', '', $string);
    	$string = str_replace(')', '', $string);
    	$string = str_replace('.', '', $string);
    	$string = str_replace('+', '', $string);
    	$string = preg_replace("/[^0-9]/", "", $string);
    	 
    	return $string;
    	 
    }
    
    private function copiar_diretorio($diretorio, $destino, $ver_acao = false)
    {
      
		if ($destino{strlen($destino) - 1} == '/'){
			$destino = substr($destino, 0, -1);
		}
     
		if (!is_dir($destino)){
			
			if ($ver_acao){
				
				echo "Criando diretorio {$destino}\n";
				
			}
			
			mkdir($destino, 0755);
         
		}
         
		$folder = opendir($diretorio);
         
		while ($item = readdir($folder)){
			
			if ($item == '.' || $item == '..'){
				continue;
            }
            
			if (is_dir("{$diretorio}/{$item}")){
				
				copy_dir("{$diretorio}/{$item}", "{$destino}/{$item}", $ver_acao);
				
			}else{
				
				if ($ver_acao){
					
					echo "Copiando {$item} para {$destino}"."\n";
					
				}
				
				copy("{$diretorio}/{$item}", "{$destino}/{$item}");
			}
			
		}
      
	}
    
    private function delTree($dir) {
		
    	$files = array_diff(scandir($dir), array('.','..'));
		foreach ($files as $file) {
			(is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
		}
    	return rmdir($dir);
    	
    }
    
    private function redirect_post($url, array $data)
	{
    
		echo '<html xmlns="http://www.w3.org/1999/xhtml">';
		echo '<head>';
		echo '<script type="text/javascript">';
		echo 'function closethisasap() {';
		echo 'document.forms["redirectpost"].submit();';
		echo '}';
		echo '</script>';
		echo '</head>';
		echo '<body onload="closethisasap();">';
		echo '<form name="redirectpost" method="post" action="'.$url.'">';
			if ( !is_null($data) ) {
				foreach ($data as $k => $v) {
					
					if (is_array($v)){
						
						foreach($v as $key => $var){
							
							echo '<input type="hidden" name="' . $k . '[]" value="' . $var . '">';
							
						}
						
					} else {
						echo '<input type="hidden" name="' . $k . '" value="' . $v . '">';
					}
					
				}
			}
		echo ' </form>';
		echo '</body>';
		echo '</html>';
	    exit;
	    
	}
    
    protected function arquivaContatos($config)
    {
    	 
    	$diretorioPasta = $_SERVER['DOCUMENT_ROOT'].'/assets/importacao/'.time();
    	$criaPasta = mkdir($diretorioPasta, 0777);
    	 
    	$shell = shell_exec('split -d -l 2000 '.$_SERVER['DOCUMENT_ROOT'].'/'.$config['arquivo'].' '.$diretorioPasta.'/splitcronimport ');
    	 
    	
    	
    	return time();
    	 
    }
    
	protected function httpPost($url,$params,$cabecalho)
    {

    	$params['cabecalho'] = $cabecalho;
    	$postData = http_build_query($params);
    	
		$ch = curl_init();
		
		curl_setopt($ch,CURLOPT_URL,$url);
		curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
		curl_setopt($ch,CURLOPT_HEADER, false);
		curl_setopt($ch, CURLOPT_POST, count($postData));
		curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
		
		$output = curl_exec($ch);
		curl_close($ch);
		
		return $output;
		
    }

}