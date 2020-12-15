<?php
	
	$id_campanha = 10;

	$envios = 70;	

	// PROCEDIMENTO DE SALVAR/ATUALIZAR QUANTOS ENVIOS FORAM FEITOS
	if ( !file_exists( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_envios_quantidade' ) ){
		mkdir( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_envios_quantidade', 0777, true );
	}
	
	$fp = fopen( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_envios_quantidade/'.$id_campanha.'.txt' , 'r');
	$get = fgets($fp);
	$reescreve = intval($get) + intval($envios);
	fclose($fp);

	$fp = fopen( $_SERVER['DOCUMENT_ROOT'].'/lotes/txt_envios_quantidade/'.$id_campanha.'.txt' , 'w');
	fwrite($fp, $reescreve);
	fclose($fp);
	
?>