<?php
error_reporting(E_ALL);
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$teste = ReturnXML("teste");
echo $teste;

function x_encode($data){
       
       $data = str_replace("&", "", $data);
       $data = str_replace("#x1", "", $data);
       $data = str_replace("#x0", "", $data);
       
       return $data;
       
  
}
   
function ReturnXML($data){
      
       $data = x_encode($data);
       $i = strpos($data, "?>")+2;
       
       if(strpos($data,"faultstring")>-1){
          
           $data= substr($data, strpos($data,"faultstring")+12,$i);
           $data =substr($data,0, strpos($data,"faultstring")-2);
           
           $data= "<erro>".$data."</erro>";
           
           return simplexml_load_string($data);
       }else{
       
      
            $xml_test = str_replace(array("diffgr:","msdata:"),'', substr($data, $i));
            $data = simplexml_load_string($xml_test);
            if($data){
                $response = $data->children('http://schemas.xmlsoap.org/soap/envelope/')->Body->children();
            }else{
                $response =false;
            }
            return $response;
       }
       
   }
   
   