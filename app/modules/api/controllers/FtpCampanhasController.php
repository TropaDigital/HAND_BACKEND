<?php

include_once 'app/models/My_Controller.php';
include_once 'app/models/Model_Data.php';
include_once 'app/models/db.php';

class Api_FtpCampanhasController extends My_Controller 
{
	
    public function createUsuarioAction()
    {
        
        //request
        $post = $_REQUEST;
        
        //pasta
        $dir = $_SERVER['DOCUMENT_ROOT'].'/ftp_campanhas/';
        
        //diretorio do usuario
        $dirusuario = $dir.$post['user'];
        
        if ( file_exists( $dirusuario ) ) {
            
            $msg = 'Já existe um usuario com esse nome.';
            
        } else {
            
            //cria pasta raiz do usuario
            $createPasta = mkdir($dirusuario, 0777);
            
            if ( $createPasta ) {
                
                //pastas de acesso
                $acesso = mkdir($dirusuario.'/acesso', 0777);
                
                if ( $acesso ) {
                
                    $campanhas = mkdir($dirusuario.'/acesso/campanhas', 0777);
                    $campanhas = mkdir($dirusuario.'/acesso/campanhas_sftp', 0777);
                    
                    if ( !$campanhas ) {
                        
                        $msg = 'Campanhas: Não foi possivel criar uma pasta.';
                        
                    }
                    
                    $campanhas_relatorios = mkdir($dirusuario.'/acesso/relatorios', 0777);
                    $campanhas_relatorios = mkdir($dirusuario.'/acesso/relatorios_sftp', 0777);
                    
                    if ( !$campanhas_relatorios ) {
                        
                        $msg = 'Campanhas relatorios: Não foi possivel criar uma pasta.';
                        
                    }
                    
                }
                
                $config = mkdir($dirusuario.'/config', 0777);
                
                if ( !$config ) {
                    
                    $msg = 'Config: Não foi possivel criar uma pasta.';
                    
                } else {
                    
                    $fpWrite = array();
                    $fpWrite['id'] = $post['id'];
                    $fpWrite['user'] = $post['user_envio'];
                    $fpWrite['pass'] = $post['pass_envio'];
                    $fpWrite = json_encode( $fpWrite );
                    
                    $fp = fopen($dirusuario.'/config/config.txt', 'a');
                    fwrite( $fp, $fpWrite );
                    fclose( $fp );
                    
                }
                
                $logs = mkdir($dirusuario.'/logs', 0777);
                
                if ( !$logs ) {
                    
                    $msg = 'Logs: Não foi possivel criar uma pasta.';
                    
                }
                
                $relatorios_temp = mkdir($dirusuario.'/relatorios_temp', 0777);
                
                if ( !$relatorios_temp ) {
                    
                    $msg = 'Relatorios tempo: Não foi possivel criar uma pasta.';
                    
                }
                
            } else {
                
                $msg = 'Pasta do usuario: Não foi possivel criar uma pasta.';
                
            }
            
        }
        
        if ( !$msg ) {
            
            echo json_encode( array( 'return'=>'true' ) );
            
        } else {
            
            echo json_encode( array( 'return'=>'false', 'msg'=>$msg ) );
            
        }
        
    }
    
    public function listaUsuariosFtpAction()
    {
        
        //pasta 
        $dir = $_SERVER['DOCUMENT_ROOT'].'/ftp_campanhas/';
        $pastas = scandir( $dir );
        unset( $pastas[0] );
        unset( $pastas[1] );
        
        $return = array();
        
        $i=0;
        foreach ( $pastas as $pasta )
        {
            
            $config = fopen( $dir.'/'.$pasta.'/config/config.txt', 'r');
            $dados = json_decode( fgets($config) );
            fclose( $config );
            
            $return[$i] = array();
            $return[$i]['pasta'] = $pasta;
            $return[$i]['config'] = $dados;
            
            $i++;
            
        }
        
        echo '<pre>'; print_r( $return ); exit;
        
    }
    
    public function removeDirFtpAction()
    {
        
        //request
        $post = $_REQUEST;
        
        //pasta
        $dir = $_SERVER['DOCUMENT_ROOT'].'/ftp_campanhas/'.$post['user'];
        
        $this->delTree( $dir );
        
    }
    
    private function delTree( $dir )
    {
        
        $files = array_diff(scandir($dir), array('.','..'));
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? $this->delTree("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir); 
        
    }
    
    public function rotinaAction()
    {
        
        $dir = $_SERVER['DOCUMENT_ROOT'].'/ftp_campanhas';
        
        //leitura da pasta ftp_campanhas
        $usuarios = scandir( $dir );
        unset($usuarios[0]);
        unset($usuarios[1]);
        
        //lista usuarios
        foreach ( $usuarios as $usuario )
        {
            
            $dirUsuario = $dir.'/'.$usuario;
            $openDirUsuario = scandir( $dirUsuario );
            unset($openDirUsuario[0]);
            unset($openDirUsuario[1]);
            
            //verifica se tem alguma campanha para ser enviada
            $campanhas = scandir( $dirUsuario.'/acesso/campanhas' );
            unset($campanhas[0]);
            unset($campanhas[1]);
            
            if ( count( $campanhas ) > 0 ) {
                
                //primeira campanha
                $primeiraCampanha = $dirUsuario.'/acesso/campanhas/'.$campanhas[2];
                
                echo 'Campanha: '.$primeiraCampanha;
                
                //configs do usuario
                $configUsuario = fopen( $dirUsuario.'/config/config.txt' , 'r');
                $config = fgets( $configUsuario );
                $config = json_decode( $config );
                fclose( $configUsuario );
                
                $config->pasta_usuario = $dirUsuario;
                
                $transfer = $this->transfereFila( $config, $primeiraCampanha );
                
                //move para logs
                copy($dirUsuario.'/acesso/campanhas/'.$campanhas[2], $dirUsuario.'/logs/'.$campanhas[2]);
                unlink($dirUsuario.'/acesso/campanhas/'.$campanhas[2]);
                
            }
            
        }
        
    }
    
    protected function transfereFila( $config, $arquivo )
    {
       
        $return = array( 'config'=>$config, 'arquivo'=>$arquivo );
        
        $meuArray = Array();
        $file = fopen($arquivo, 'r');
        while (($line = fgetcsv($file, null, ';')) !== false)
        {
            $meuArray[] = $line;
        }
        fclose($file);
        
        //dados da campanha
        $campanha = $meuArray[0];
        $campanha = $campanha[0];
        $campanha = explode('|', $campanha);

        //cria lista
        $newLista = $this->CreateLista( $campanha, $config );
        
        //verifica se a lista foi criada
        if ( $newLista ) {
        
            $campanha['id_lista'] = $newLista;
            
            //cria campanha
            $newCampanha = $this->CreateCampanha( $campanha, $config );
           
            if ( $newCampanha ) {
                
                //inseriu lista/campanha correto, retorno de tudo
                $return =  array(
                    'return'=>true,
                    'fase'=>'campanha',
                    'ids'=> json_decode( $newCampanha ),
                    'id_lista'=> $newLista,
                    'campanha'=> $campanha,
                    'config'=> $config,
                    'qtdade'=> count( file( $arquivo ) ) - 2,
                );
                
                //faz todo o caminho do upload e move para fila de importação
                $transfereForUpload = $this->transfereForUploads( $meuArray[1], $return, $arquivo, $meuArray );

                $return['diretorio_importacao'] = $transfereForUpload;
                
                //campanha txt para fila
                $campanhaTxt = $this->criaTxtCampanha( $return );
                
                echo 'Campanha TXT: '.$campanhaTxt;
                
            } else {
                
                return array('return'=>false, 'fase'=>'campanha', 'result'=>$newCampanha);
                
            }
            
        } else {
            
            return array('return'=>false, 'fase'=>'lista');
            
        }
        
    }
    
    protected function criaTxtCampanha ( $dados )
    {
        
        $post = [];
        $post['data_i'] = $dados['campanha'][3];
        $post['data_f'] = $dados['campanha'][4];
        $post['retorno_relatorio'] = $dados['campanha'][5];
        $post['qtdade'] = $dados['qtdade'];
        $post['total'] = $dados['qtdade'];
        $post['status'] = '0';
        $post['inseridos'] = '0';
        $post['paginacao'] = '0';
        $post['mensagem'] = $dados['campanha'][2];
        $post['id_lista'] = $dados['id_lista'];
        $post['campanha'] = $dados['campanha'][0];
        $post['id_landing_page'] = $dados['campanha'][1];
        $post['id_usuario'] = $dados['config']->id;
        $post['ofsset'] = '0';
        $post['message_id'] = 'LOTE';
        $post['id_lote'] = $dados['ids']->id_lote;
        $post['id_campanha'] = $dados['ids']->id_campanha;
        $post['shorturl'] = 'smsclk.co';
        
        if ( $this->view->front == 'http://homologacao.sistema.smsclique.com.br/' ) {
            $post['login_envio'] = 'zznaiche';
            $post['senha_envio'] = 'funknovo';
        } else {
            $post['login_envio'] = $dados['config']->user;
            $post['senha_envio'] = $dados['config']->pass;
        }
        
        $post['diretorio'] = $dados['diretorio_importacao'];
        $post['pasta_usuario'] = $dados['config']->pasta_usuario;
        
        $json = json_encode( $post );
        
        $envia = [];
        $envia['json'] = $json;
        $envia['data_i'] = $post['data_i'];
        $envia['id_lote'] = $post['id_lote'];
        
        $newTxtCampanha = $this->view->front.'zigzag/campanha/api-create-txt-campanha';
        
        $postdata = http_build_query( $envia );
        
        $opts = array('http' =>
            array(
                'method'  => 'POST',
                'header'  => 'Content-type: application/x-www-form-urlencoded',
                'content' => $postdata
            )
        );
        
        $context  = stream_context_create($opts);
        $result = file_get_contents( $newTxtCampanha, false, $context );
        
        return json_encode( array( 'url'=> $newTxtCampanha, 'retorno'=> $result, 'envio'=> $envia ) );
        
    }
     
    protected function transfereForUploads( $campos, $return, $arquivo, $meuarray )
    {
        
        //gerando um nome para pasta de importação
        $nomePasta = time();
        
        //gerando post correto para importação
        $importa = [];
        $importa['id_lista'] = $return['id_lista'];
        $importa['tipo'] = ';';
        $importa['diretorio'] = $nomePasta;
        $importa['cabecalho'] = 'sim';
        $importa['topo'] = $campos;
        foreach ( $campos as $campo )
        {
            $importa[$campo] = $campo;
        }
        
        //colocando arquivo na fila de importação
        $diretorioPasta = $_SERVER['DOCUMENT_ROOT'].'/assets/importacao/'.$nomePasta;
        if ( !file_exists( $diretorioPasta ) ) {
            $criaPasta = mkdir($diretorioPasta, 0777);
        }
        
        $shell = shell_exec('split -d -l 2000 '.$arquivo.' '.$diretorioPasta.'/splitcronimport ');
        
        $fp = fopen($diretorioPasta.'/config.txt', 'w');
        fwrite($fp, json_encode( $importa ));
        fclose( $fp );
        
        $this->copiar_diretorio($diretorioPasta, $_SERVER['DOCUMENT_ROOT'].'/importacao/'.$nomePasta);
        
        return $nomePasta;
        
    }
    
    protected function copiar_diretorio($diretorio, $destino, $ver_acao = false)
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
    
    private function CreateCampanha( $campanha, $config )
    {
        
        $infoCampanha = [];
        $infoCampanha['id_usuario'] = $config->id;
        $infoCampanha['id_lista'] = $campanha['id_lista'];
        $infoCampanha['campanha'] = $campanha[0];
        $infoCampanha['id_landing_page'] = $campanha[1];
        $infoCampanha['mensagem'] = $campanha[2];
        $infoCampanha['data_i'] = $campanha[3];
        $infoCampanha['data_f'] = $campanha[4];
        $infoCampanha['retorno_relatorio'] = $campanha[5];
        
        $newCampanha = $this->view->front.'zigzag/campanha/api-create-campanha?'.http_build_query( $infoCampanha );
        
        $open = file_get_contents( $newCampanha );
        return $open;
        
    }
    
    private function CreateLista ( $campanha, $config )
    {
        
        $lista = [];
        $lista['id_usuario'] = $config->id;
        $lista['lista'] = $campanha[0];
        
        $this->lista = new Model_Data(new lista_contatos());
        $this->lista->_required(array('lista','id_usuario'));
        $this->lista->_notNull(array());
        
        $newLista = $this->lista->edit(NULL, $lista, NULL, Model_Data::NOVO);
        
        return $newLista;
        
    }
    
    public function rotinaRelatorioAction()
    {
        
        $id_campanha = $this->_request->getParam('id_campanha');
        $id_usuario = $this->_request->getParam('id_usuario');
        $pasta = $this->_request->getParam('pasta_usuario');
        $campanha = $this->_request->getParam('campanha');
        $retorno_relatorio = $this->_request->getParam('retorno_relatorio');
        
        $campanha = str_replace(' ', '%20', $campanha);
        
        if ( !$id_campanha )
            die('Impossivel executar o comando, pois não tem o id da campanha.');
        
        if ( !$id_usuario )
            die('Impossivel executar o comando, pois não tem o id do usuario.');
        
        if ( !$pasta )
            die('Impossivel executar o comando, pois não tem a pasta do usuario.');
        
        if ( !$campanha )
            die('Impossivel executar o comando, pois não tem a campanha.');
        
        $arquivos = array();
        
        for ($i = 0; $i <= 10; $i++) {
            
            $data = date('Y-m-d', strtotime('+'. $i .' days', strtotime( date('Y-m-d') )));
            
            $arquivos[$i] = array();
            
            $arquivos[$i]['nome_arquivo'] = $data.'@'.$id_campanha;
            $arquivos[$i]['pasta'] = $pasta;
            $arquivos[$i]['campanha'] = $campanha;
            $arquivos[$i]['retorno_relatorio'] = $retorno_relatorio;
            
            $arquivos[$i]['links'] = array();
            $arquivos[$i]['links']['sftp'] = 'http://'.$_SERVER['HTTP_HOST'].'/api/relatorios/get-sftp?retorno_relatorio='.$retorno_relatorio.'&id_campanha='. $id_campanha .'&limit=1&campanha='.$campanha;
            $arquivos[$i]['links']['envios'] = 'http://'.$_SERVER['HTTP_HOST'].'/api/relatorios/get-envios?retorno_relatorio='.$retorno_relatorio.'&id_campanha='. $id_campanha .'&limit=1&campanha='.$campanha;
            $arquivos[$i]['links']['visu'] = 'http://'.$_SERVER['HTTP_HOST'].'/api/relatorios/get-aberturas?retorno_relatorio='.$retorno_relatorio.'&id_campanha='. $id_campanha .'&limit=1&campanha='.$campanha;;
            $arquivos[$i]['links']['click'] = 'http://'.$_SERVER['HTTP_HOST'].'/api/relatorios/get-cliques?retorno_relatorio='.$retorno_relatorio.'&id_campanha='. $id_campanha .'&limit=1&campanha='.$campanha;
            $arquivos[$i]['links']['mo'] = 'http://'.$_SERVER['HTTP_HOST'].'/api/relatorios/get-mo?retorno_relatorio='.$retorno_relatorio.'&id_campanha='. $id_campanha .'&limit=1&id_usuario='.$id_usuario.'&campanha='.$campanha;
            $arquivos[$i]['links']['form'] = 'http://'.$_SERVER['HTTP_HOST'].'/api/relatorios/get-form?retorno_relatorio='.$retorno_relatorio.'&id_campanha='. $id_campanha .'&limit=1&campanha='.$campanha;
            
        }
        
        $dir = $_SERVER['DOCUMENT_ROOT'].'/ftp_campanhas_relatorios/';
        $logfp = array();
        
        foreach ( $arquivos as $arquivo )
        {
            
            $fp = fopen($dir.'fila_links/'.$arquivo['nome_arquivo'].'.txt', 'a');
            fwrite( $fp , json_encode( $arquivo ) );
            fclose( $fp );
            
            $logfp[$dir.'fila_links/'.$arquivo['nome_arquivo'].'.txt'] = json_encode( $arquivo );
            
        }
        
        echo '<pre>';
        print_r( $logfp );
        exit;
        
    }
    
    public function rotinaListaRelatoriosAction()
    {
        
        $dir = $_SERVER['DOCUMENT_ROOT'].'/ftp_campanhas_relatorios/';
        
        $openLinks = scandir( $dir.'fila_links' );
        unset( $openLinks[0] );
        unset( $openLinks[1] );
        
        foreach ( $openLinks as $link )
        {
            
            $arquivoNome = $link;
            
            $nomeArquivo = explode( '@', $link );
            $dataArquivo = $nomeArquivo[0];
            
            if ( $dataArquivo == date('Y-m-d') ) {
                
                $arquivoASerLido = $dir.'fila_links/'.$link;
                $fp = fopen( $arquivoASerLido, 'r' );
                $dados = json_decode( fgets( $fp ) );
                fclose( $fp );
 
                $limit = 20000;
                
                $campanha = str_replace(' ', '%20', $dados->campanha);
                
                //listando todos links
                foreach ( $dados->links as $link ) {
                    
                    //corrigindo link pós json
                    $link = str_replace('//', '/', $link);
                    $link = str_replace('http:/', 'http://', $link);
                    $link = str_replace('limit=1', 'limit='.$limit, $link);
                    
                    //tipo de relatorio
                    $tipo = explode('/relatorios/', $link);
                    $tipo = explode('?', $tipo[1]);
                    $tipo = $tipo[0];
                    $tipo = str_replace('get-', '', $tipo);
                    
                    $openLink = json_decode( file_get_contents( $link ) );
                    $registros = $openLink->total_registros;
                    $paginas = ceil( $registros / $limit );
                    
                    $txt = null;
                    for ($i = 1; $i <= $paginas; $i++) {
                    
                        $final = $i == $paginas ? '&final=true' : '';
                        
                        $txt .= 'http://'.$_SERVER['HTTP_HOST'].'/api/ftp-campanhas/gera-'.$tipo.'?url='.base64_encode( $link.'&p='.$i ).'&p='.$i.'&data='.$dataArquivo.$final.'&pasta='.base64_encode( $dados->pasta ).'&campanha='.$campanha.'&retorno_relatorio='.$dados->retorno_relatorio.'&time='.time();
                        $txt .= PHP_EOL;
                        
                    }
                    
                    $fp = fopen($_SERVER['DOCUMENT_ROOT'].'/ftp_campanhas_relatorios/preenche/links.txt', 'a');
                    fwrite( $fp, $txt );
                    fclose( $fp );
                    
//                     echo $txt; exit;
                    
                    copy( $dir.'fila_links/'.$arquivoNome, $dir.'logs_links/'.$arquivoNome );
                    unlink( $dir.'fila_links/'.$arquivoNome );
                    
                }
                
                break;
                
            }
            
        }
        
    }
    
    //daqui pra baixo, gera relatorios em csv na pasta correta.
    public function geraEnviosAction()
    {
        
        $get = $this->_request->getParams();
        
        $url = base64_decode( $get['url'] );
        $pasta = base64_decode( $get['pasta'] );
        $data = $get['data'];
        
        $pastaTemp = $pasta.'/relatorios_temp/';
        $pastaFinal = $pasta.'/acesso/relatorios/';
        
        $open = file_get_contents( $url );
        
        if ( !$open )
            die('Impossivel acessar.');        
        
        $result = json_decode( $open );
        $formato = ';';
        $nomeCsv = 'envios-'.$data.'_'.$get['campanha'].'_'.$get['time'].'.csv';
        
        // ABRE/CRIA O ARQUIVO
        $fp = fopen($pastaTemp.$nomeCsv, 'a');
        
        // INICIA A VARIAVEL DO CSV
        $csv = NULL;
        
        // MONTA O TOPO DO ARQUIVO
        if ( $get['p'] == 1 ) {
            
            $csv .= 'CELULAR';
            $csv .= $formato;
            $csv .= 'CAMPANHA';
            $csv .= $formato;
            $csv .= 'MENSAGEM';
            $csv .= $formato;
            $csv .= 'STATUS';
            $csv .= $formato;
            $csv .= 'TEXTO STATUS';
            $csv .= $formato;
            $csv .= 'REJEITADO';
            $csv .= $formato;
            $csv .= 'DATA DE ENVIO';
            $csv .= $formato;
            $csv .= 'DATA DE STATUS';
            $csv .= PHP_EOL;
            
        }
        
        foreach ( $result->registros as $row ):
        
            // CELULAR
            $csv .= $row->celular;
            $csv .= $formato;
            
            // CAMPANHA
            $csv .= strip_tags($get['campanha']);
            $csv .= $formato;
            
            // MENSAGEM
            $msg = $row->mensagem;
            $msg = strip_tags($msg);
            $msg = str_replace(PHP_EOL, '', $msg);
            $msg = str_replace('\n', '', $msg);
            $msg = str_replace('[zig=interrogazao]', '?', $msg);
            
            $csv .= $msg;
            $csv .= $formato;
            
            // RENOMEIA O STATUS PARA FICAR IGUAL AO DO ZIGZAG
            if ( $row->status == 'E0' ) {
                $csv .= 'Inválido';
            } else if ( $row->status == 'CL' ) {
                $csv .= 'Confirmado';
            } else {
                $csv .= 'Enviado';
            }
            $csv .= $formato;
            
            // TEXTO STATUS
            $csv .= $row->textostatus == NULL ? 'Enviado para operadora.' : $row->textostatus;
            $csv .= $formato;
            
            // REJEITADO
            $csv .= $row->rejeicao_data == NULL ? 'Sim' : 'Nao';
            $csv .= $formato;
            
            // DATA ENVIADO
            $csv .= date('d-m-Y H:i', strtotime( $row->data_lote ) );
            $csv .= $formato;
            
            // DATA RECIBO
            if ( $row->data_recibo == NULL && $horas >= 24 ) {
                
                if ( date('Y-m-d H:i') < $row->data_lote ) {
                    $csv .= 'Agendado para: '.str_replace('-', '/', date('d-m-Y H:i', strtotime( $row->data_lote ) ) );
                } else {
                    $csv .= str_replace('-', '/', date('d-m-Y H:i', strtotime( $row->data_lote ) ) );
                }
                
            } else {
                
                $csv .= $row->data_recibo == NULL ? 'Sem informacoes' : str_replace('-', '/', date('d-m-Y H:i', strtotime( $row->data_recibo ) ) );
                
            }
            $csv .= $formato;
            $csv .= PHP_EOL;
        
        endforeach;
        
        fwrite($fp, $csv);
        fclose($fp);
        
        if ( $get['final'] == 'true' ) {
            
            copy($pastaTemp.$nomeCsv, $pastaFinal.$nomeCsv);
            unlink($pastaTemp.$nomeCsv);
            
        }
        
    }
    
    public function geraSftpAction()
    {
    
    	$get = $this->_request->getParams();
    
    	$url = base64_decode( $get['url'] );
    	$pasta = base64_decode( $get['pasta'] );
    	$data = $get['data'];
    
    	$pastaTemp = $pasta.'/relatorios_temp/';
    	$pastaFinal = $pasta.'/acesso/relatorios_sftp/';
    
    	$open = file_get_contents( $url );
    
    	if ( !$open )
    		die('Impossivel acessar.');
    
    		$result = json_decode( $open );
    		$formato = '|';
    		$nomeCsv = $get['retorno_relatorio'];
    		$nomeCsv = str_replace('.txt', '.csv', $nomeCsv);
    
    		// ABRE/CRIA O ARQUIVO
    		$fp = fopen($pastaTemp.$nomeCsv, 'a');
    
    		// INICIA A VARIAVEL DO CSV
    		$csv = NULL;
    
    		// MONTA O TOPO DO ARQUIVO
    		if ( $get['p'] == 1 ) {
    
//     			COD_PMC| CAMPANHA
//     			IDT_ARQ|
//     			IDT_CLI| EDITAVEL_40
//     			COD_TRT| EDITAVEL_39
//     			DES_RET| STATUS SMS
//     			GRP_RET| GRUPO DE RETORNO
//     			DAT_HRA_RET| DATA DE ABERTURA
//     			IDT_CTO| CELULAR
//     			DES_CNL| FIXO
//     			DAT_CRG_ARQ| DATA E HORA DE GERAÇÃO DO ARQUIVO
//     			DAT_CRG VAZIO
    			
    			$csv .= 'COD_PMC';
    			$csv .= $formato;
    			$csv .= 'IDT_ARQ';
    			$csv .= $formato;
    			$csv .= 'IDT_CLI';
    			$csv .= $formato;
    			$csv .= 'COD_TRT';
    			$csv .= $formato;
    			$csv .= 'DES_RET';
    			$csv .= $formato;
    			$csv .= 'GRP_RET';
    			$csv .= $formato;
    			$csv .= 'DAT_HRA_RET';
    			$csv .= $formato;
    			$csv .= 'IDT_CTO';
    			$csv .= $formato;
    			$csv .= 'DES_CNL';
    			$csv .= $formato;
    			$csv .= 'DAT_CRG_ARQ';
    			$csv .= $formato;
    			$csv .= 'DAT_CRG';
    			$csv .= PHP_EOL;
    
    		}
    
    		foreach ( $result->registros as $row ):
	    
	    		$csv .= $row->campanha;
	    		$csv .= $formato;
	    
	    		$csv .= $nomeCsv;
	    		$csv .= $formato;
	    		
	    		$csv .= $row->editavel_40;
	    		$csv .= $formato;
	    		
	    		$csv .= $row->editavel_39;
	    		$csv .= $formato;
	    
	    		// RENOMEIA O STATUS PARA FICAR IGUAL AO DO ZIGZAG
	    		if ( $row->rejeicao_data ) {
	    			
	    			$csv .= 'Clicou no link';
	    			
	    		} else {
	    		
		    		if ( $row->status == 'E0' ) {
		    			$csv .= 'Inválido';
		    		} else if ( $row->status == 'CL' ) {
		    			$csv .= 'Confirmado';
		    		} else {
		    			$csv .= 'Enviado';
		    		}
		    		
	    		}
	    		
	    		$csv .= $formato;
	    
	    		$csv .= "";
	    		$csv .= $formato;
	    
	    		// REJEITADO
	    		$csv .= $row->data_rejeicao_real;
	    		$csv .= $formato;
	    
	    		$csv .= $row->celular;
	    		$csv .= $formato;
	    		
	    		$csv .= "Fixo";
	    		$csv .= $formato;
	    		
	    		$csv .= $get['data'];
	    		$csv .= $formato;
	    		
	    		$csv .= "";
	    		
	    		$csv .= PHP_EOL;
    
    		endforeach;
    
    		fwrite($fp, $csv);
    		fclose($fp);
    
    		if ( $get['final'] == 'true' ) {
    
    			copy($pastaTemp.$nomeCsv, $pastaFinal.$nomeCsv);
    			unlink($pastaTemp.$nomeCsv);
    
    		}
    
    }
    
    public function geraCliquesAction()
    {
        
        $get = $this->_request->getParams();
        
        $url = base64_decode( $get['url'] );
        $pasta = base64_decode( $get['pasta'] );
        $data = $get['data'];
        
        $pastaTemp = $pasta.'/relatorios_temp/';
        $pastaFinal = $pasta.'/acesso/relatorios/';
        
        $open = file_get_contents( $url );
        
        if ( !$open ){
            die('Impossivel acessar.');
        }
        
        $result = json_decode( $open );
        $formato = ';';
        $nomeCsv = 'cliques-'.$data.'_'.$get['campanha'].'_'.$get['time'].'.csv';
        
        // ABRE/CRIA O ARQUIVO
        $fp = fopen($pastaTemp.$nomeCsv, 'a');
        
        // INICIA A VARIAVEL DO CSV
        $csv = NULL;
        
        // MONTA O TOPO DO ARQUIVO
        if ( $get['p'] == 1 ) {
            
            $csv .= 'CELULAR';
            $csv .= $formato;
            $csv .= 'CAMPANHA';
            $csv .= $formato;
            $csv .= 'URL DA ACAO';
            $csv .= $formato;
            $csv .= 'ACAO';
            $csv .= $formato;
            $csv .= 'DATA';
            $csv .= PHP_EOL;
            
        }
        
        foreach ( $result->registros as $row ):
        
            // CELULAR
            $csv .= $row->contato;
            $csv .= $formato;
            
            // CAMPANHA
            $csv .= $get['campanha'];
            $csv .= $formato;
            
            // AÇÃO
            $csv .= $row->acao;
            $csv .= $formato;
            
            // URL DA AÇÃO
            $csv .= $row->tipo_acao;
            $csv .= $formato;
            
            // DATA ENVIADO
            $csv .= date('d-m-Y H:i', strtotime( $row->criado ) );
            $csv .= $formato;
            $csv .= PHP_EOL;
        
        endforeach;
        
        fwrite($fp, $csv);
        fclose($fp);
        
        if ( $get['final'] == 'true' ) {
            
            copy($pastaTemp.$nomeCsv, $pastaFinal.$nomeCsv);
            unlink($pastaTemp.$nomeCsv);
            
        }
        
    }
    
    public function geraAberturasAction()
    {
        
        $get = $this->_request->getParams();
        
        $url = base64_decode( $get['url'] );
        $pasta = base64_decode( $get['pasta'] );
        $data = $get['data'];
        
        $pastaTemp = $pasta.'/relatorios_temp/';
        $pastaFinal = $pasta.'/acesso/relatorios/';
        
        $open = file_get_contents( $url );
        
        if ( !$open ){
            die('Impossivel acessar.');
        }
        
        $result = json_decode( $open );
        $formato = ';';
        $nomeCsv = 'aberturas-'.$data.'_'.$get['campanha'].'_'.$get['time'].'.csv';
        
        // ABRE/CRIA O ARQUIVO
        $fp = fopen($pastaTemp.$nomeCsv, 'a');
        
        // INICIA A VARIAVEL DO CSV
        $csv = NULL;
        
        // MONTA O TOPO DO ARQUIVO
        if ( $get['p'] == 1 ) {
            
            $csv .= 'CELULAR';
            $csv .= $formato;
            $csv .= 'CAMPANHA';
            $csv .= $formato;
            $csv .= 'DATA';
            $csv .= PHP_EOL;
            
        }
        
        foreach ( $result->registros as $row ):
        
            // CELULAR
            $csv .= $row->contato;
            $csv .= $formato;
            
            // CAMPANHA
            $csv .= $get['campanha'];
            $csv .= $formato;
            
            // DATA ENVIADO
            $csv .= date('d-m-Y H:i', strtotime( $row->criado ) );
            $csv .= $formato;
            $csv .= PHP_EOL;
        
        endforeach;
        
        fwrite($fp, $csv);
        fclose($fp);
        
        if ( $get['final'] == 'true' ) {
            
            copy($pastaTemp.$nomeCsv, $pastaFinal.$nomeCsv);
            unlink($pastaTemp.$nomeCsv);
            
        }
        
    }
    
    public function geraMoAction()
    {
        
        $get = $this->_request->getParams();
        
        $url = base64_decode( $get['url'] );
        $pasta = base64_decode( $get['pasta'] );
        $data = $get['data'];
        
        $pastaTemp = $pasta.'/relatorios_temp/';
        $pastaFinal = $pasta.'/acesso/relatorios/';
        
        $open = file_get_contents( $url );
        
        if ( !$open ){
            die('Impossivel acessar.');
        }
        
        $result = json_decode( $open );
        $formato = ';';
        $nomeCsv = 'respostas-'.$data.'_'.$get['campanha'].'_'.$get['time'].'.csv';
        
        // ABRE/CRIA O ARQUIVO
        $fp = fopen($pastaTemp.$nomeCsv, 'a');
        
        // INICIA A VARIAVEL DO CSV
        $csv = NULL;
        $csv = NULL;
        
        // MONTA O TOPO DO ARQUIVO
        if ( $get['p'] == 1 ) {
            
            $csv .= 'CELULAR';
            $csv .= $formato;
            $csv .= 'CAMPANHA';
            $csv .= $formato;
            $csv .= 'MENSAGEM ENVIADA';
            $csv .= $formato;
            $csv .= 'MENSAGEM RECEBIDA';
            $csv .= $formato;
            $csv .= 'DATA';
            $csv .= PHP_EOL;
            
        }
        
        foreach ( $result->registros as $row ):
            
            // CELULAR
            $csv .= $row->celular;
            $csv .= $formato;
            
            // CAMPANHA
            $csv .= $get['campanha'];
            $csv .= $formato;
            
            // MENSAGEM ENVIADA
            $csv .= $row->mensagem;
            $csv .= $formato;
            
            // MENSAGEM RECEBIDA
            $csv .= $row->msg_resp;
            $csv .= $formato;
            
            // DATA ENVIADO
            $csv .= date('d-m-Y H:i', strtotime( $row->criado ) );
            $csv .= $formato;
            $csv .= PHP_EOL;
        
        endforeach;
        
        fwrite($fp, $csv);
        fclose($fp);
        
        if ( $get['final'] == 'true' ) {
            
            copy($pastaTemp.$nomeCsv, $pastaFinal.$nomeCsv);
            unlink($pastaTemp.$nomeCsv);
            
        }
        
    }
    
    public function geraFormAction()
    {
        
        $get = $this->_request->getParams();
        
        $url = base64_decode( $get['url'] );
        $pasta = base64_decode( $get['pasta'] );
        $data = $get['data'];
        
        $pastaTemp = $pasta.'/relatorios_temp/';
        $pastaFinal = $pasta.'/acesso/relatorios/';
        
        $open = file_get_contents( $url );
        
        if ( !$open ){
            die('Impossivel acessar.');
        }
        
        $result = json_decode( $open );
        $formato = ';';
        $nomeCsv = 'formularios-'.$data.'_'.$get['campanha'].'_'.$get['time'].'.csv';
        
        // ABRE/CRIA O ARQUIVO
        $fp = fopen($pastaTemp.$nomeCsv, 'a');
        
        // INICIA A VARIAVEL DO CSV
        $csv = NULL;
        foreach ( $result->registros as $row ){
        
            $campos = json_decode ( $row->campos );
            
            $csv .= 'Celular';
            $csv .= $formato;
            
            $csv .= 'Campanha';
            $csv .= $formato;
            
            // CAMPOS
            foreach ( $campos as $key => $myrow ){
                
                $csv .= strip_tags( key( $myrow ) );
                $csv .= $formato;
                
            }
            
            $csv .= 'Data';
            $csv .= $formato;
            $csv .= PHP_EOL;
            
            // CELULAR
            $csv .= $row->celular;
            $csv .= $formato;
            
            // CAMPANHA
            $csv .= $get['campanha'];
            $csv .= $formato;
            
            // CAMPOS
            foreach ( $campos as $key => $myrow ){
                
                if ( is_array( current($myrow) ) ){
                    
                    $i=0;
                    foreach ( current( $myrow ) as $secondrow ) {
                        
                        if ( $i == 0 ) {
                            
                            // current para chckbox
                            $csv .= strip_tags( ( $secondrow ) );
                            
                        } else {
                            
                            $csv .= ' ,'.strip_tags( current( $secondrow ) );
                            
                        }
                        
                        $i++;
                        
                    }
                    
                    $csv .= $formato;
                    
                } else {
                    
                    $csv .= strip_tags( current( $myrow ) );
                    $csv .= $formato;
                    
                }
                
            }
            
            // DATA
            $csv .= date('d-m-Y H:i', strtotime( $row->criado ) );
            $csv .= $formato;
            $csv .= PHP_EOL;
        
        }
        
        fwrite($fp, $csv);
        fclose($fp);
        
        if ( $get['final'] == 'true' ) {
            
            copy($pastaTemp.$nomeCsv, $pastaFinal.$nomeCsv);
            unlink($pastaTemp.$nomeCsv);
            
        }
            
    }
    
    public function sftpRotinaAction()
    {
    	
    	 $dir = $_SERVER['DOCUMENT_ROOT'].'/ftp_campanhas';
        
        //leitura da pasta ftp_campanhas
        $usuarios = scandir( $dir );
        unset($usuarios[0]);
        unset($usuarios[1]);
        
        //lista usuarios
        foreach ( $usuarios as $usuario )
        {
            
            $dirUsuario = $dir.'/'.$usuario;
            $openDirUsuario = scandir( $dirUsuario );
            unset($openDirUsuario[0]);
            unset($openDirUsuario[1]);
            
            //verifica se tem alguma campanha para ser enviada
            $campanhas = scandir( $dirUsuario.'/acesso/campanhas_sftp' );
            unset($campanhas[0]);
            unset($campanhas[1]);
            
            if ( count( $campanhas ) > 0 ) {
            	
            	foreach( $campanhas as $cfg ) {
            		
            		$extensao = explode('cfg', $cfg);
            		if ( count( $extensao ) > 1 ) {
            			
            			$dirCfg = $dirUsuario.'/acesso/campanhas_sftp/'.$cfg;
            			
            			//0 nome do arquivo .txt a ser disparado
            			//1 layout do arquivo .txt
            			//2 data e hora de agendamento
            			//3 campanha onde ocorrerá o arquivo
            			//4 data e hora de geração do relatório de retorno
            			//5 nome desejado do arquivo de retorno
            			//6 conta e e-mail de login na TWW
            			
            			##layout como deve ser##
            			
            			//Campanha legal|556|Ola [nome], conheca nossa plataforma enviada com FTP em producao:|2017-12-06 12:00|2017-12-06 14:00
						//nome;celular
						//Kaique;11940349111
						
            			//restume array for campaing
            			$data = [];
            			
            			$lines = file ( $dirUsuario.'/acesso/campanhas_sftp/'.$cfg );
            			
            			echo '<pre>';
            			
            			foreach ( $lines as $cnfg ) {
            				
            				$cnfg = strip_tags($cnfg);
            				$cnfg = str_replace(PHP_EOL, '', $cnfg);
            				$cnfg = str_replace("\n", '', $cnfg);
            				$cnfg = str_replace("\r", '', $cnfg);
            				
            				$arraycnfg = explode(';', $cnfg);
            				
            				if ( $arraycnfg[0] == 1 ) {
            					
            					$data['arquivo_txt'] = $arraycnfg[1];
            					
            				} elseif ( $arraycnfg[0] == 2 ) {
            					
            					$data['layout_txt'] = $arraycnfg[1];
            					
            				} elseif ( $arraycnfg[0] == 3 ) {
            				
            					$data['data_inicio'] = date('Y-d-m', strtotime($arraycnfg[1])).' '.$arraycnfg[2];
            					$data['data_final'] = date('Y-d-m', strtotime($arraycnfg[1])).' '.$arraycnfg[3];
            					
            				} elseif ( $arraycnfg[0] == 5 ) {
            					
            					$data['campanha'] = $arraycnfg[1];
            					
            				} elseif ( $arraycnfg[0] == 6 ) {
            					
            					$data['data_relatorio'] = date('Y-m-d', strtotime($arraycnfg[1])).' '.$arraycnfg[2];
            					
            				} elseif ( $arraycnfg[0] == 7 ) {
            					
            					$data['relatorio_nome'] = $arraycnfg[1];
            					$data['relatorio_nome'] = str_replace('csv', 'txt', $data['relatorio_nome']);
            					$data['relatorio_nome'] = str_replace('{date_time}', date('Y-m-d_H:i:s'), $data['relatorio_nome']);
            					
            				} elseif ( $arraycnfg[0] == 9 ) {
            					
            					$data['email_tww'] = $arraycnfg[1];
            					
            				} elseif ( $arraycnfg[0] == 10 ) {
            					
            					$data['id_lainding_page'] = $arraycnfg[1];
            					
            				} elseif ( $arraycnfg[0] == 11 ) {
            					
            					$data['menasgem'] = $arraycnfg[1];
            					
            				}
            				
            			}
            			
            			$dirContatos = $dirUsuario.'/acesso/campanhas_sftp/'.strip_tags($data['arquivo_txt']);
            			
            			$lines = file( $dirContatos );
            			$lines = implode('', $lines);
            			$prilinha = $data['campanha'].'|'.$data['id_lainding_page'].'|'.$data['menasgem'].'|'.$data['data_inicio'].'|'.$data['data_final'].'|'.$data['relatorio_nome'].PHP_EOL;
            			$prilinha .= $lines;
            			
            			$fp = fopen($dirContatos, 'r+');
            			fwrite($fp, $prilinha);
            			fclose($fp);
            			 
            			$nomearquivo = $data['campanha'].'.txt';
            			
            			echo $dirContatos.', '.$dirUsuario.'/acesso/campanhas/'.$nomearquivo;
            			
            			copy($dirContatos, $dirUsuario.'/acesso/campanhas/'.$nomearquivo);
            			copy($dirCfg, $dirUsuario.'/logs/'.$cfg);
            			copy($dirContatos, $dirUsuario.'/logs/'.$data['arquivo_txt']);
            			
            			unlink( $dirCfg );
            			unlink( $dirContatos );
            			
            		}
            		
            	}
            	
            }
            
        }
    	
    }
    
    public function sftpLeituraTxtAction()
    {
    	
    	$root = $_SERVER['DOCUMENT_ROOT'].'/ftp_campanhas//csu/acesso/campanhas_sftp/COBBSU000058SAMI1801111215E1.txt';
    	$lines = file($root);
    	echo '<pre>'; print_r( $lines );
    	
    }
    
}