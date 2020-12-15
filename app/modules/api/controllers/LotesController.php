<?php
	
include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';
include_once 'app/models/RedisHand.php';

class Api_LotesController extends My_Controller 
{
	
	// DIRETORIO RAIZ DA PASTA DE LOTES
	protected $dir;
	
	// PASTAS DENTRO DE LOTE
	protected $txt_recibo;
	protected $txt_vazio;
	protected $txt_preenchido;
	protected $txt_enviados;
	
	protected $request;
	
	public function ini ()
	{
		
		$this->dir = $_SERVER['DOCUMENT_ROOT'].'/lotes/';
		
		// RECEBE O LOTE DO SISTEMA
		$this->txt_recibo = $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_recibo_campanha/';
		
		// TEM OS TXT VÁZIOS COM ID DO LOTE/CAMPANHA COM OFFSET E LIMIT DE CADA TXT	
		$this->txt_vazio = $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_null/';
		
		// TEM TODOS OS TXT PREENCHIDOS, PRONTO PARA SER LIDO E ENVIADO
		$this->txt_preenchido = $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_preenchido/';
		
		// TEM OS MESMOS ARQUIVOS DA PASTA TXT_PREENCHIDO PORÉM EM XML E ORGANIZADO OQ FOI ENVIADO COM SUCESSO E ERRO
		$this->txt_enviados = $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_enviados/';
		
		// PEGA O REQUEST DA PÁGINA
		$this->request = $this->_request->getParams();
		
		unset($this->request['controller']);
		unset($this->request['action']);
		unset($this->request['module']);
		
	}
	
	public function cancelAction()
	{
		
		$get = $this->_request->getParams();
		
		$id_campanha = $get['id'];
		$numusu = $get['numusu'];
		$senha = $get['senha'];
		
		$cancelTWW = 'http://tww.com.br:8070/reluzcap/wsreluzcap.asmx/DelSMSAgendaIdLote?numusu='.$numusu.'&senha='.$senha.'&idlote='.$id_campanha.'';
		$cancelTWW = file_get_contents( $cancelTWW );
		
		@$delNull = $this->delTree( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_null/fila/'.$id_campanha );
		@$delPreenchido = $this->delTree( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_preenchido/fila/'.$id_campanha );
		@$delShEnvios = unlink( $_SERVER['DOCUMENT_ROOT'].'/lotes/sh_envios/fila/'.$id_campanha.'.txt' );
		@$delShPreenche = unlink( $_SERVER['DOCUMENT_ROOT'].'/lotes/sh_preenche/fila/'.$id_campanha.'.txt' );
		@$PatchRecibo = scandir( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_recibo_campanha/fila/' );
		$matches = preg_grep("/@".$id_campanha."@/", $PatchRecibo);
		
		foreach ( $matches as $row ) {
			
			echo 'del: '.$_SERVER['DOCUMENT_ROOT'].'/lotes/txt_recibo_campanha/fila/'.$row.' <br/>';
			$delmatch = unlink( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_recibo_campanha/fila/'.$row );
			
		}
		
		
	}
	
	protected static function delTree( $dir )
	{
		
		$files = array_diff(scandir($dir), array('.','..'));
		
		foreach ($files as $file) {
			(is_dir("$dir/$file")) ? delTree("$dir/$file") : unlink("$dir/$file");
		}
		
		return rmdir($dir);
		
	}
	
	public function redisCampanhaAction()
	{
	    
	    $post = $this->_request->getPost();
	    
	    $redisHand = new redisHand();
	    $redisCampanha = $redisHand->SetCampanha( $post );
	    
	    echo json_encode( $redisCampanha ); exit;
	    
	}
	
	public function recebeLoteAction()
	{
		
		
		$caminho = $this->txt_recibo.'fila/'.$this->limpaNomeArquivo($this->request['nome_arquivo']).'.txt';
		
		if ( !file_exists( $this->txt_recibo.'logs_finalizado/'.$this->limpaNomeArquivo($this->request['nome_arquivo']).'.txt' ) ) {
		
			$arquivo = fopen($caminho, "w+");
			$conteudo = json_encode($this->request);
			$update = fwrite($arquivo, $conteudo);
			fclose($arquivo);
			
			die('created');
		
		} else {
			
			die('duplicated');
			
		}
		
	}
	
	public function leituraLoteAction()
	{
		
		// SEMPRE QUE ALTERAR A QUANTIDADE DE TXT A SER PREENCHIDO ALTERAR O $limitePorTxt E NO PREENCHER O LIMIT
		
		// DIRETÓRIO DA FILA DE RECIBO DOS LOTES
		$fila = $this->txt_recibo.'fila/';
		$finalizado = $this->txt_recibo.'logs_finalizado/';
		
		// LE A PASTA COMPLETA
		$files = scandir($fila);
		unset($files[0]);
		unset($files[1]);
		asort($files);
		
		$totalPastas = count($files);
		
		if ( $totalPastas == 0 ) {
		
			die('Nenhum arquivo.');
			
		} else {
			
			$limitePorTxt = 10;
			
			// PEGA O PRIMEIRO ARQUIVO
			$arquivo = $files[2];
			$arquivoNameInfo = explode('@', str_replace('.txt', '', $arquivo));
			$id_campanha = $arquivoNameInfo[1];
			$id_lote = $arquivoNameInfo[2];
			
			$pastaLote = $this->txt_vazio.'fila/'.$id_campanha.'/'.$id_lote;
			$pastaCampanha = $this->txt_vazio.'fila/'.$id_campanha;
			
			if ( !file_exists( $pastaCampanha ) ) {
				mkdir($pastaCampanha, 0777, true);
			}
			
			if ( !file_exists( $pastaLote ) ){
				mkdir($pastaLote, 0777, true);
			}
			
			// ABRE O ARQUIVO
			$fp = fopen($fila.'/'.$arquivo, "r");
			$dados = fgetcsv($fp, 0, ';');
			$dados = json_decode($dados[0]);
			fclose($fp);
			
			$quantidadePorArquivo = 100;
			
			$quantidadeDeArquivos = $dados->total / $quantidadePorArquivo;
			$quantidadeDeArquivos = ceil ( $quantidadeDeArquivos );
			
			$quantidadeportxt = $quantidadePorArquivo;
			$offset = $dados->offset;
			$referencia = $dados->referencia;
			
			$resto = $dados->total % $quantidadePorArquivo;
			
			$a=1;
			$b=1;
			for ($i = 1; $i <= $quantidadeDeArquivos; $i++) {

				$inicio = $b - $limitePorTxt;
				$final = $b;
				
				$total = $offset + $quantidadeportxt;
				
				// VERIFICA SEMPRE SE EXISTE A PASTA EM SH_PREENCHER
				if ( !file_exists($_SERVER['DOCUMENT_ROOT'].'/lotes/sh_preencher/montando_txt/'.$id_campanha.'-'.$id_lote) ) {
					
					mkdir($_SERVER['DOCUMENT_ROOT'].'/lotes/sh_preencher/montando_txt/'.$id_campanha.'-'.$id_lote, 0777, true);
					
				}
				
				// QUANDO CHEGA NO FINAL
				if ($i == $quantidadeDeArquivos){
					
					$texto = '/api/lotes/preencher-lote?ref='.$referencia.'&login='.$dados->login_envio.'&senha='.$dados->senha_envio.'&i_c='.$id_campanha.'&i_l='.$id_lote.'&arquivos='.$inicioFinal.','.$b;
					$this->criaLogProcedimento('Leitura Lote • Escreveu no arquivo sh_preencher: '.$texto, $id_campanha);
					
					$total = $dados->total + $dados->offset;
					$quantidadeportxt = $total - $offset;
					
					// CRIA ARQUIVO COM 100
					$create = fopen($_SERVER['DOCUMENT_ROOT'].'/lotes/sh_preencher/montando_txt/'.$id_campanha.'-'.$id_lote.'/links.txt', 'a');
					fwrite($create, $texto."\n");
					fclose($create);
					
					// COPIA O ARQUIVO PARA FILA
					copy( 
						$_SERVER['DOCUMENT_ROOT'].'/lotes/sh_preencher/montando_txt/'.$id_campanha.'-'.$id_lote.'/links.txt',
						$_SERVER['DOCUMENT_ROOT'].'/lotes/sh_preencher/fila/'.$id_lote.'.txt'
					);
					
					// COPIA O ARQUIVO PARA LOGS
// 					copy(
// 						$_SERVER['DOCUMENT_ROOT'].'/lotes/sh_preencher/montando_txt/'.$id_campanha.'-'.$id_lote.'/links.txt',
// 						$_SERVER['DOCUMENT_ROOT'].'/lotes/sh_preencher/logs/'.$id_lote.'.txt'
// 					);
					
					// REMOVE O ARQUIVO
					unlink($_SERVER['DOCUMENT_ROOT'].'/lotes/sh_preencher/montando_txt/'.$id_campanha.'-'.$id_lote.'/links.txt');
					
					// REMOVE A PASTA
					rmdir($_SERVER['DOCUMENT_ROOT'].'/lotes/sh_preencher/montando_txt/'.$id_campanha.'-'.$id_lote);
					
				}
				
				// A CADA 100 ELE INSERE UM TXT
				if ( $a == $limitePorTxt ){
					
					if ( $inicio == 0 )
						$inicio = 1;
					
					$inicioFinal = $final;
						
					$texto = '/api/lotes/preencher-lote?login='.$dados->login_envio.'&senha='.$dados->senha_envio.'&i_c='.$id_campanha.'&i_l='.$id_lote.'&arquivos='.$inicio.','.$final;
					$this->criaLogProcedimento('Leitura Lote • Escreveu no arquivo sh_preencher: '.$texto, $id_campanha);
					
					// CRIA ARQUIVO COM 100
					$create = fopen($_SERVER['DOCUMENT_ROOT'].'/lotes/sh_preencher/montando_txt/'.$id_campanha.'-'.$id_lote.'/links.txt', 'a');
					fwrite($create, $texto."\n");
					fclose($create);
					
					$a = 0;
					
				}
				
				$dadosEnvio = json_encode(
					array(
						'offset'=> $offset,
						'limite'=> $quantidadeportxt,
						'total'=> $total,
					    'referencia'=> $referencia
					)
				);
				
				$offset = $offset + $quantidadeportxt;
				
				echo '<pre>'; print_r($dadosEnvio);
// 				print_r($dados);
				
				$lote = fopen($pastaLote.'/'.$i.'-'.$dados->login_envio.'-'.$dados->senha_envio.'.txt', "w+");
				$escreve = fwrite($lote, $dadosEnvio);
				fclose($lote);
				
				$b++;
				$a++;
				
			}
			
// 			exit;
			
			// MOVE ARQUIVO DE RECIBO DA FILA PARA FINALIZADO
			$de = $fila.$arquivo;
			$para = $finalizado.$arquivo;
			if ( copy( $de, $para ) ) {
				unlink($de);
			}
			
			exit;
			
		}
		
	}
	
	public function preencherLoteAction()
	{
		
		$get = $this->_request->getParams();
		
		$id_campanha = $get['i_c'];
		$id_lote = $get['i_l'];
		
		$arquivos = $get['arquivos'];
		$login = $get['login'];
		$senha = $get['senha'];
		$divideArquivos = explode(',', $arquivos);
		
		// CRIA PASTA EM PREENCHIDO
		if ( !file_exists( $this->txt_preenchido.'/fila/'.$id_campanha ) ){
			
			mkdir($this->txt_preenchido.'/fila/'.$id_campanha, 0777, true);
			
		}
		
		if ( !file_exists( $this->txt_preenchido.'/fila/'.$id_campanha.'/'.$id_lote ) ){
		
			mkdir($this->txt_preenchido.'/fila/'.$id_campanha.'/'.$id_lote, 0777, true);
		
		}
		
		if ( $divideArquivos[0] != 1 ){
			
			$divideArquivos[0] = $divideArquivos[0] + 1;
			$divideArquivos[1] = $divideArquivos[1];
			
		}
		
		$primeiro = $this->txt_vazio.'fila/' . $id_campanha . '/' . $id_lote . '/'.$divideArquivos[0].'-'.$login.'-'.$senha.'.txt';
		$ultimo   = $this->txt_vazio.'fila/' . $id_campanha . '/' . $id_lote . '/'.$divideArquivos[1].'-'.$login.'-'.$senha.'.txt';
		
		$openPrimeiro = fopen($primeiro, 'r');
		$leituraPrimeiro = json_decode(fgets($openPrimeiro));
		fclose($openPrimeiro);
		
		$openUltimo = fopen($ultimo, 'r');
		$leituraUltimo = json_decode(fgets($openUltimo));
		fclose($openUltimo);
		
		$offset = $leituraPrimeiro->offset;
		$limite = 1000;
		
		$this->criaLogProcedimento('Preencher lote com limite: '. $limite .', e offset: '. $leituraPrimeiro->offset .' ', $id_campanha);
		
// 		echo 'offset: '.$offset.' <br/> ';
// 		echo 'limite: '.$limite.' <br/> ';

		// ABRE A SELECT SOMENTE COM O LIMIT E OFFSET DO LOTE
		$sql = new Zend_Db_Select($this->db);
		$sql->from(array('"ENVIADOS"'=>$this->config->tb->sms_enviados_control),array('*'));
		
			$sql->where('id_campanha = ?', $id_campanha);
			$sql->order('id_sms_enviado ASC');
			$sql->limit($limite, $offset);
		
		$sql = $sql->query(Zend_Db::FETCH_OBJ);
		$registros = $sql->fetchAll();
		
// 		echo '<pre>'; print_r($registros); exit;
		
		$inicio = $divideArquivos[0];
		$i = 1;
		$a = 1;
		
		echo 'count: '.count($registros).' <br/>';
		
		foreach ( $registros as $row ){
			
			if ( $i == 101 ) {
			
				$i = 1;
				$inicio++;
			
			}
			
			// COMEÇO DO ARQUIVO
			if ( $i == 1 ) {
				$xml = '';
			}
			
			$msg = str_replace('&', '', $row->mensagem);
			$msg = str_replace("'", '', $msg);
			$msg = str_replace("\n", '', $msg);
			$msg = str_replace('[zig=interrogazao]', '?', $msg);
			$msg = strip_tags($msg);

			if ( $row->referencia ) {
			    
    			$id = $row->id_sms_enviado;
    			$id_qtde = 19 - strlen($id);
    			$referencia = $id.'-'.substr ( $row->referencia, 0, $id_qtde);
    			
			} else {
			    
			    $referencia = $row->id_sms_enviado;
			    
			}
			
			$xml .= json_encode( array('message'=>$msg, 'number'=>$row->celular) );
			$xml .= '[row]';
			
			// FINAL DO ARQUIVO
			if ( $i == 100 || $a == count ( $registros ) ) {
				
				// ABRE/CRIA ARQUIVO EM PREENCHIDO
				$arquivo = $this->txt_preenchido.'/fila/'. $id_campanha .'/'. $id_lote . '/'.$inicio.'-'.$login.'-'.$senha.'.txt';
				$fp = fopen($arquivo, 'w');
				fwrite($fp, $xml);
				fclose($fp);
				
				// CRIA PASTA DA CAMPANHA/LOTE EM LOG FINALIZADOS DE TXT VAZIO
				if ( !file_exists( $this->txt_vazio.'/logs_finalizado/'.$id_campanha ) ){
				
					mkdir( $this->txt_vazio.'/logs_finalizado/'.$id_campanha, 0777, true );
					
				}
				
				if ( !file_exists( $this->txt_vazio.'/logs_finalizado/'.$id_campanha.'/'.$id_lote ) ){
				
					mkdir( $this->txt_vazio.'/logs_finalizado/'.$id_campanha.'/'.$id_lote, 0777, true );
				
				}
				
				// MOVE PARA FINALIZADOS
				@copy(
					$this->txt_vazio.'/fila/'. $id_campanha .'/'. $id_lote. '/'. $inicio .'-'. $login .'-'. $senha .'.txt', 
					$this->txt_vazio.'/logs_finalizado/'. $id_campanha .'/'. $id_lote. '/'. $inicio .'-'. $login .'-'. $senha .'.txt'
				);
				
				// REMOVE O ARQUIVO DA FILA
				@unlink( $this->txt_vazio.'/fila/'. $id_campanha .'/'. $id_lote. '/'. $inicio .'-'. $login .'-'. $senha .'.txt' );
				
			}
			
			$i++;
			$a++;
			
		}
		
		echo '<pre>';
		
		$quantidadeASerPreenchido = scandir( $this->txt_vazio.'/fila/'.$id_campanha.'/'.$id_lote.'/' );
		$quantidadeASerPreenchido = count( $quantidadeASerPreenchido ) - 2;
		
		$quantidadeASerPreenchidoFin = scandir( $this->txt_vazio.'/logs_finalizado/'.$id_campanha.'/'.$id_lote.'/' );
		$quantidadeASerPreenchidoFin = count( $quantidadeASerPreenchidoFin ) - 2;
		
		$quantidadeASerPreenchido = $quantidadeASerPreenchido + $quantidadeASerPreenchidoFin;
		
		$quantidadePreenchido = scandir( $this->txt_preenchido.'/fila/'.$id_campanha.'/'.$id_lote.'/' );
		$quantidadePreenchido = count( $quantidadePreenchido ) - 2;
		
		echo ' Precisa preencher ' .$quantidadeASerPreenchido.'<br/>';
		echo ' Já está preenchido ' .$quantidadePreenchido.'<br/>';
		
		if ( $quantidadePreenchido >= $quantidadeASerPreenchido ){
			
			echo 'cria arquivo';
			
			$arquivosASeremEnviados = scandir( $this->txt_preenchido.'fila/'.$id_campanha.'/'.$id_lote );
			unset ( $arquivosASeremEnviados[0] );
			unset ( $arquivosASeremEnviados[1] );
				
			$urls = NULL;
				
			foreach( $arquivosASeremEnviados as $txt )
			{
					
				$urls .= '/api/lotes/enviar?local='.base64_encode($this->txt_preenchido.'/fila/'.$id_campanha.'/'.$id_lote.'/'.$txt). "\n";
			
			}
				
			echo $urls;
				
			$open = fopen($_SERVER['DOCUMENT_ROOT'].'/lotes/sh_envios/fila/'.$id_lote.'.txt', 'w');
			fwrite($open, $urls);
			fclose($open);
			
		}
		
	}
	
	public function enviarAction()
	{
		
		$get = $this->_request->getParams();
		$local = base64_decode($get['local']);
		
		$arr = explode('/', $local);
		$primeiroNaFila = end( $arr );
		$totalIndice = count ( $arr );		
		$indiceIdCampanha = $totalIndice - 3;
		$indiceIdLote = $totalIndice - 2;
		
		$id_campanha = $arr[$indiceIdCampanha];
		$id_lote = $arr[$indiceIdLote];
		
		$dados_login = explode('-', $primeiroNaFila);
		$login_envio = $dados_login[1];
		$senha_envio = str_replace('.txt', '', $dados_login[2]);
		
		$nomePrimeiroFila = explode('.txt', $primeiroNaFila);
		$nomePrimeiroFila = $nomePrimeiroFila[0];
		
		$rootPrimeiro = $local;
		
		$openPrimeiroFila = fopen($rootPrimeiro, 'r') or die( 'Erro ao ler arquivo.' );
		$leitura = fgets($openPrimeiroFila);
		fclose($openPrimeiroFila);
		
// 		$leitura = str_replace('http', PHP_EOL.' http', $leitura);
		
		// CRIA A PASTA DA CAMPANHA EM LOGS FINALIZADO
		if ( !file_exists($this->txt_preenchido.'/logs_finalizado/'.$id_campanha) ){
			mkdir($this->txt_preenchido.'logs_finalizado/'.$id_campanha, 0777, true);
		}
		
		if ( !file_exists($this->txt_preenchido.'/logs_finalizado/'.$id_campanha.'/'.$id_lote) ){
			mkdir($this->txt_preenchido.'/logs_finalizado/'.$id_campanha.'/'.$id_lote, 0777, true);
		}
		
		$smsArrayJson = explode('[row]', $leitura);
		$smsArrayJson = array_filter($smsArrayJson);
		
		// INSERE NO REDIS OS SMS
		$RedisHand = new redisHand();
		$resultEnvia = $RedisHand->setSMS( $id_campanha, $smsArrayJson );
		
		if ( $resultEnvia > 0 ){
			$retorno = 'true';
		} else {
			$retorno = 'false';
		}
		
		$this->criaLogProcedimento('json SMS redis: '.json_encode( $smsArrayJson ), $id_campanha);
		$this->criaLogProcedimento('json SMS redis - message: '. $smsArrayJson['message'], $id_campanha);
		$this->criaLogProcedimento('json SMS redis - number: '. $smsArrayJson['number'], $id_campanha);
		
		$this->criaLogProcedimento('Retorno insert SMS redis: '.$resultEnvia, $id_campanha);
		
		$envios = $resultEnvia[1];
		
		// PROCEDIMENTO DE SALVAR/ATUALIZAR QUANTOS ENVIOS FORAM FEITOS
		if ( !file_exists( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_envios_quantidade' ) ){
			mkdir( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_envios_quantidade', 0777, true );
		}
		
		$fp = fopen( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_envios_quantidade/'.$id_campanha.'.txt' , 'r');
		$leituraQtde = fgets( $fp );
		$reescreve = intval($leituraQtde) + intval($envios);
		fclose($fp);
		
		$fp = fopen( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_envios_quantidade/'.$id_campanha.'.txt' , 'w');
		fwrite( $fp, $reescreve);
		fclose( $fp );
		
		// CRIA OS DIRETORIOS NECESSARIOS SE NÃO EXISTIR
		if ($retorno == 'true'){
		
			if ( !file_exists($this->txt_enviados.'sucesso/') ){
				mkdir($this->txt_enviados.'sucesso/', 0777, true);
			}
				
			if ( !file_exists($this->txt_enviados.'sucesso/'.$id_campanha) ){
				mkdir($this->txt_enviados.'sucesso/'.$id_campanha, 0777, true);
			}
				
			if ( !file_exists($this->txt_enviados.'sucesso/'.$id_campanha.'/'.$id_lote) ){
				mkdir($this->txt_enviados.'sucesso/'.$id_campanha.'/'.$id_lote, 0777, true);
			}
				
			// MOVE O ARQUIVO PARA ENVIADOS
			$de = $this->txt_preenchido.'fila/'.$id_campanha.'/'.$id_lote.'/'.$primeiroNaFila;
			$finalizado = $this->txt_preenchido.'logs_finalizado/'.$id_campanha.'/'.$id_lote.'/'.$primeiroNaFila;
			$para = $this->txt_enviados.'sucesso/'.$id_campanha.'/'.$id_lote.'/'.$nomePrimeiroFila.'.json';
				
			copy($de, $para);
			copy($de, $finalizado);
				
			unlink($de);
		
		} else {
				
			if ( !file_exists($this->txt_enviados.'erro/') ){
				mkdir($this->txt_enviados.'erro/', 0777, true);
			}
				
			if ( !file_exists($this->txt_enviados.'erro/'.$id_campanha) ){
				mkdir($this->txt_enviados.'erro/'.$id_campanha, 0777, true);
			}
				
			if ( !file_exists($this->txt_enviados.'erro/'.$id_campanha.'/'.$id_lote) ){
				mkdir($this->txt_enviados.'erro/'.$id_campanha.'/'.$id_lote, 0777, true);
			}
			
			if ( !file_exists($this->txt_enviados.'callback_erro') ){
			    mkdir($this->txt_enviados.'callback_erro', 0777, true);
			}
			
			if ( !file_exists($this->txt_enviados.'callback_erro_logs') ){
			    mkdir($this->txt_enviados.'callback_erro_logs', 0777, true);
			}
				
			$de = $this->txt_preenchido.'fila/'.$id_campanha.'/'.$id_lote.'/'.$primeiroNaFila;
			$finalizado = $this->txt_preenchido.'logs_finalizado/'.$id_campanha.'/'.$id_lote.'/'.$primeiroNaFila;
			$para = $this->txt_enviados.'erro/'.$id_campanha.'/'.$id_lote.'/'.$nomePrimeiroFila.'.json';
			$callback = $this->txt_enviados.'callback_erro/'.$nomePrimeiroFila.'.json';
		
			copy($de, $para);
			copy($de, $finalizado);
			copy($de, $callback);
			
			unlink($de);
				
		}
		
		// ALTERA STATUS
		$this->statusCampanha('enviar', $id_campanha, $id_lote);
		
	}
	
	public function alteraStatusAction()
	{
		
		$dir = $this->txt_enviados;
		$sucesso = scandir($dir.'sucesso/');
		$erro = scandir($dir.'erro/');
		
		unset($sucesso[0]);
		unset($sucesso[1]);
		unset($erro[0]);
		unset($erro[1]);
		
		// SUCESSO
		$sucesso_id_campanha = $sucesso[2];
		$sucesso_id_lote = scandir($dir.'sucesso/'.$sucesso_id_campanha);
		$sucesso_id_lote = $sucesso_id_lote[2];
		$pasta = scandir($dir.'sucesso/'.$sucesso_id_campanha.'/'.$sucesso_id_lote);
		
		$xmlOpen = fopen($dir.'sucesso/'.$sucesso_id_campanha.'/'.$sucesso_id_lote.'/'.$pasta[2], 'r');
		$xml = fgetcsv($xmlOpen, '[@]-;-[@]');
		fclose($xmlOpen);
		
		print_r($xml);
		
	}
	
	public function callbackErroAction()
	{
	    
	    $callback_erro = $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_enviados/callback_erro/';
	    $callback_erro_logs = $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_enviados/callback_erro_logs/';
	    
	    $whilePasta = scandir( $callback_erro );
	    $arquivo = $whilePasta[2];
	    
	    $fp = fopen( $callback_erro.$arquivo , 'r');
	    $dados = fgetcsv( $fp, 0, ';' );
	    fclose( $fp );
	    
	    print_r( $dados );
	    
	}
	
	private function statusCampanha( $tipo, $id_campanha, $id_lote )
	{
			
		$pasta_preenchido_fila = count ( scandir( $this->txt_preenchido.'/fila/'. $id_campanha .'/'. $id_lote .'/' ) ) - 2;
		$pasta_preenchido_fina = count ( scandir( $this->txt_preenchido.'/logs_finalizado/'. $id_campanha .'/'. $id_lote .'/' ) ) - 2;
		$total_preenchido = $pasta_preenchido_fila + $pasta_preenchido_fina;
		
		$pasta_enviada_fila = count ( scandir( $this->txt_enviados.'/sucesso/'. $id_campanha .'/'. $id_lote .'/' ) ) - 2;
		$pasta_enviada_erro = count ( scandir( $this->txt_enviados.'/erro/'. $id_campanha .'/'. $id_lote .'/' ) ) - 2;
		$total_enviada = $pasta_enviada_fila + $pasta_enviada_erro + 1;
		
		if ( $total_preenchido == $total_enviada ) {
			
			// LE QUANTOS OK RECEBEU DA TWW
			$fp = fopen( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_envios_quantidade/'.$id_campanha.'.txt' , 'r');
			$leituraQtde = fgets( $fp );
			fclose($fp);
			
			$redisHand = new redisHand();
			$CampanhaLoad = $redisHand->LoadCampanha( ['idCampaign'=>$id_campanha, 'idLot'=>'None', 'action'=>'start'] );
			
			// CRIA LOG DIZENDO QUANTOS OK RECEBEMOS
			$this->criaLogProcedimento('Start campanha no redis: '. json_encode( $CampanhaLoad ), $id_campanha);
			
			if ( $leituraQtde == 0 ) {
			    
// 			    $url = $this->view->front.'naiche/campanha/status?id='. $id_campanha .'&status=Campanha%20com%20erro';
			    $url = $this->view->front.'naiche/campanha/status?id='. $id_campanha .'&status=Campanha%20preparada';
			    $acessa = file_get_contents( $url );
			    $this->criaLogProcedimento('Servidor tentou acessar essa url: '. $url, $id_campanha);
			    
			} else {
			    
			    $url = $this->view->front.'naiche/campanha/status?id='. $id_campanha .'&status=Campanha%20preparada';
			    $acessa = file_get_contents( $url );
			    $this->criaLogProcedimento('Servidor tentou acessar essa url: '. $url, $id_campanha);
			    
			}
			
			// REMOVE O ARQUIVO DA PASTA TXT_ENVIOS_QUANTIDADE
			unlink($_SERVER['DOCUMENT_ROOT'].'/lotes/txt_envios_quantidade/'.$id_campanha.'.txt');
			
		} else {
			
			$this->criaLogProcedimento('Verificou se precisa alterar o status mas o total preenchido é: '. $total_preenchido .' e o total de enviado é: '. $total_enviada, $id_campanha);
			
		}
			
	}
	
	public function testeLoadCampanhaAction()
	{
	    
	    $redisHand = new redisHand();
	    $CampanhaLoad = $redisHand->LoadCampanha( array('idCampaign'=>'26', 'idLot'=>'None', 'action'=>'start') );
	    
	    print_r( $CampanhaLoad ); exit;
	    
	}
	
	private function criaLogProcedimento ( $mensagem, $id_campanha )
	{
		
		if ( !file_exists( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_logs_processos' ) ) {
			mkdir( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_logs_processos', 0777, true );
		}
		
		$fp = fopen( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_logs_processos/'.$id_campanha.'.txt', 'a' );
		fwrite( $fp , date('d/m/Y H:i:s').' - '.$mensagem."\n");
		fclose($fp);
		
	}
	
	private function copiar_diretorio($diretorio, $destino, $ver_acao = false)
	{
	
// 		echo $diretorio; echo ' - '; echo $destino; exit;
		
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
	
	private function limpaNomeArquivo($name)
	{
		
		$name = str_replace('-', '', $name);
		$name = str_replace(' ', '', $name);
		$name = str_replace(':', '', $name);
		return $name;
		
	}
	
}