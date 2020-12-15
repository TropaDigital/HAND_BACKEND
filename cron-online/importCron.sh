#!/bin/bash
###
#CRON QUE CHAMA ARQUIVO QUE IMPORTA AS LISTAS DE CONTATO
###
a=0

urlsrv="http://api.handmkt.com.br"
pastaler="/home/handmktbk/public_html/importacao"

#for eachfile in $yourfilenames
for d in $pastaler/*;
do

	if [ -d "$d" ];
	then
	
		while [ $a -lt 30 ]
		do
		   #echo $a
		   sleep 2
		   kar=`wget -O /dev/null "$urlsrv/api/importacao/cron-importacao"`
		   a=`expr $a + 1`
		done
		
	fi
	
   exit
done
