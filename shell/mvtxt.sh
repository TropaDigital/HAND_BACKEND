#!/bin/bash

input="/var/www/html/zigzag_relatorio/shell"
inputy="/var/www/html/zigzag_relatorio/shell/pasta"
#arquivo="testee.txt"
#arquivuu="kaique.txt"
#a=0
#while [ $a -lt 2 ]
#do

#	kar=`mv $input$arquivo $inputy$arquivuu`
   
#   sleep 60
   
#   a=`expr $a + 1`
#done


timestamp=$( date +%s )

pastaler="/var/www/html/zigzag_relatorio/shell/fila"
pastamvr="/var/www/html/zigzag_relatorio/shell/enviando"
pastacpr="/var/www/html/zigzag_relatorio/shell/logs"

yourfilenames=`ls $pastaler/*.txt`

for eachfile in $yourfilenames
do
	#echo $eachfile
	#echo $timestamp
	
	cpar=`cp -r $eachfile $pastacpr/$timestamp.txt`
	mvar=`mv $eachfile $pastamvr/$timestamp.txt`
	
	
	sleep 60
	
	#dlar=`rm -rf $pastamvr/$timestamp.txt`
   
   exit
done
