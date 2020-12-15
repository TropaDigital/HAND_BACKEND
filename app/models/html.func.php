<?php

function ListCheckbox($seletor = "", $checked = "",$custom = NULL,$nome = "custom",$numtds = 1)
{
	switch ($seletor) 
	{
		case "custom" :
			$values = $custom;
			$seletor = $nome;
		break;
	}
	
	$check = "";
	$cont = 0;
	
	while ( list($key,$val) = each($values) )
	{
		 
		if ( is_array($checked) )
		{
    		if ( in_array($key, $checked) )
    			$a = "checked=checked";
    		else
    			$a = NULL;
		} elseif ( $key == $checked )
			$a = "checked=checked";
		
		$check .= "<input ".$a." type=checkbox name=".$seletor."[] value=".$key.">".$val." \n";
		
		if ( $cont == $numtds )
		{
			$cont = 0;
		} else
			$cont++;
		
	}
	return $check;
}

function ListBox($seletor = "", $selected = "",$custom=NULL)
{
	switch ($seletor) 
	{
		case "pilhas" :
			$values['2_aa_inclusa.gif'] 	= "2 AA Inclusas";
			$values['2_aaa_inclusa.gif'] 	= "2 AAA Inclusas";
			$values['2_ambulancia.gif'] 	= "2 AA Ambulancia";
			$values['2_lr44_inclusa.gif'] 	= "2 LR44 Inclusas";
			$values['3_2_1.gif'] 			= "3 AAA 2 AA 1B9v";
			$values['3_aa.gif'] 			= "3 AA";
			$values['3_aa_inclusa.gif'] 	= "3 AA Inclusas";
			$values['3_aa_n_inclusas.gif'] 	= "2 AA Não Inclusas";
			$values['3_aaa_inclusa.gif'] 	= "3 AAA Inclusas";
			$values['3_lr44_inclusa.gif'] 	= "3 LR44 Inclusas";
			$values['4_aa.gif'] 			= "4 AA";
			$values['4_aa_1.gif'] 			= "4 AA Não Inclusas";
			$values['4_aa_inclusa.gif'] 	= "4 AA Inclusas";
			$values['4_lr44_bipe.gif'] 		= "4 LR44 Inclusas 2Bipe 2Est.";
			$values['4_lr44_inclusas.gif'] 	= "4 LR44 Inclusas";
		break;
		
		case "month" :
			$values['01'] = "Janeiro";
			$values['02'] = "Fevereiro";
			$values['03'] = "Março";
			$values['04'] = "Abril";
			$values['05'] = "Maio";
			$values['06'] = "Junho";
			$values['07'] = "Julho";
			$values['08'] = "Agosto";
			$values['09'] = "Setembro";
			$values['10'] = "Outubro";
			$values['11'] = "Novembro";
			$values['12'] = "Dezembro";
		break;

		case "states" :	
			$values['AC'] =	'Acre';
			$values['AL'] =	'Alagoas';
			$values['AM'] =	'Amazonas';
			$values['AP'] =	'Amapá';
			$values['BA'] =	'Bahia';
			$values['CE'] =	'Ceará';
			$values['DF'] =	'Distrito Federal';
			$values['ES'] =	'Espírito Santo';
			$values['GO'] =	'Goiás';
			$values['MA'] =	'Maranhão';
			$values['MG'] = 'Minas Gerais';
			$values['MS'] = 'Mato Grosso do Sul';
			$values['MT'] = 'Mato Grosso';
			$values['PA'] = 'Pará';
			$values['PB'] = 'Paraíba';
			$values['PE'] = 'Pernambuco';
			$values['PI'] = 'Piauí';
			$values['PR'] = 'Paraná';
			$values['RJ'] = 'Rio de Janeiro';
			$values['RN'] = 'Rio Grande do Norte';
			$values['RO'] = 'Rondônia';
			$values['RR'] = 'Roraima';
			$values['RS'] = 'Rio Grande do Sul';
			$values['SC'] = 'Santa Catarina';
			$values['SE'] = 'Sergipe';
			$values['SP'] = 'São Paulo';
			$values['TO'] = 'Tocantins';
			$values['NA'] = 'Outros';
		break;
		
		case "yearF" :
			for ($i=date("Y");$i<(date("Y")+5);$i++)			
				$values["{$i}"] = $i;
		break;
		
		case "yearP" :
			for ($i=date("Y");$i>(date("Y")-60);$i--)			
				$values["{$i}"] = $i;			
		break;
		
		case "yearI" :
			for ($i=date("Y")+10;$i>(date("Y")-30);$i--)			
				$values["{$i}"] = $i;			
		break;
		
		case "Day" :
			for ($i=1;$i<=31;$i++)			
				$values["{$i}"] = $i;			
		break;
		
		case "custom" :
			$values = $custom;
		break;
	}
	
	$form = "";
	
	while ( list($key,$val) = each($values) )
	{
		$a  = ($key == $selected)
					?" selected "
					:"";
					
		$form .= "<option value='{$key}'$a>{$val}</option>";
	}
	return $form;
}

function GeraSenha ($letters = 8, $nums = 2, $word = '')
{
	$chars = array(array('b' , 'd' , 'f' , 'g' , 'h' , 'k' , 'l' , 'm' , 'n' , 'p' , 'r' , 's' , 't' , 'v' , 'w' , 'z') ,
			array('a' , 'e' , 'i' , 'o' , 'u')
	);
	unset($pw, $nm);
	foreach (range(0, $letters - 1) as $i)
		$pw .= $chars[$i % 2][array_rand($chars[$i % 2])];
	foreach (range(1, $nums) as $i)
		$nm .= rand(0, 9);
	$keys = array(1 => ucfirst($word) , ucfirst($pw) , $nm);
	$rand_keys = array_rand($keys, 3);
	return $keys[$rand_keys[0]] . $keys[$rand_keys[1]] . $keys[$rand_keys[2]];
}