<?php

require_once 'library/Zend/Filter/Interface.php';

class Filter_Acentos  implements Zend_Filter_Interface
{
	protected $_espacoBranco;
	
	public function __construct ($espacoBranco=false)
	{
		$this->espacoBranco($espacoBranco);
	}
	
	public function espacoBranco ($v)
	{
		$this->_espacoBranco = (bool) $v; 
	}
	
	public function filter($var) 
	{
		$var = trim($var);
		
		//$var = strtolower($var);
		
		//$var = htmlentities($var);
		//$var = utf8_encode($var);
		//$var = utf8_decode($var);

		$var = str_replace(array("/{&aacute;}/","/{&Aacute;}/","/{&agrave;}/","/{&Agrave;}/","/{&atilde;}/","/{&Atilde;}/"),"a",$var);
		$var = str_replace(array("/{&eacute;}/","/{&Eacute;}/","/{&egrave;}/","/{&Egrave;}/"),"e",$var);
		$var = str_replace(array("/{&oacute;}/","/{&Oacute;}/","/{&ograve;}/","/{&Ograve;}/","/{&otilde;}/","/{&Otilde;}/"),"o",$var);
		$var = str_replace(array("/{&uacute;}/","/{&Uacute;}/","/{&ugrave;}/","/{&Ugrave;}/"),"u",$var);
		$var = str_replace(array("/{&iacute;}/","/{&Iacute;}/","/{&igrave;}/","/{&Igrave;}/"),"i",$var);
		$var = str_replace("/{&ccedil;}/","c}/",$var);
/*		$var = eregi_replace("[áÁàÀ]","a",$var);	
		$var = eregi_replace("[éÉèÈ]","e",$var);
		$var = eregi_replace("[óÓòÒ]","o",$var);
		$var = eregi_replace("[úÚùÙ]","u",$var);
		$var = eregi_replace("[íÍìÌ]","i",$var);*/

/*		$var = str_replace(array('á','Á','à','À'),array("a","a","a","a"),$var);	
		$var = str_replace(array('é','É','è','È'),array("e","e","e","e"),$var);
		$var = str_replace(array('ó','Ó','ò','Ò'),array("o","o","o","o"),$var);
		$var = str_replace(array('ú','Ú','ù','Ù'),array("u","u","u","u"),$var);
		$var = str_replace(array('í','Í','ì','Ì'),array("i","i","i","i"),$var);*/
		
		$var = preg_replace("(á|Á|à|À|ã|Ã)","a",$var);
		$var = preg_replace("(é|É|è|È|ê|Ê)","e",$var);
		$var = preg_replace("(ó|Ó|ò|Ò|ô|Ô|õ|Õ)","o",$var);
		$var = preg_replace("(ú|Ú|ù|Ù)","u",$var);
		$var = preg_replace("(í|Í|ì|Ì)","i",$var);
		
		$var = str_replace("ç","c",$var);
		$var = str_replace("Ç","C",$var);
		$var = preg_replace('/[^a-zA-Z0-9\s_]/','',$var);
		if (! $this->_espacoBranco ) 
			$var = str_replace(array(' ','__'),'_',$var);
		return $var;
	}
}