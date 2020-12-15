<?php
	
	$caminho = $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_callback/';
	
	if ( $_GET['Seunum'] != 'EMG_LEAD-KAIQUE' ) {
	
		$openScan = scandir($caminho);
		$primeiro = $openScan[2];
		
		$arquivoEscreve = $caminho.$primeiro;
		
		$open = fopen($arquivoEscreve, 'a');
		fwrite($open, json_encode($_GET)."\n" );
		fclose($open);
		
		print_r( $_GET );
	
	}
	
?>