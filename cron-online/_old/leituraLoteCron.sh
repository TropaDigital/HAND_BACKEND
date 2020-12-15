#!/bin/bash
###
#CRON QUE LE O ARQUIVO DE LOTE E CRIA ARQUVIS VAZIOS NECESSARIOS PARA O ENVIO - LIMITE DE 350
###
a=0

urlsrv="http://api.handmkt.com.br"
pastaler="/home/handmktbk/public/lotes/txt_recibo_campanha/fila"

yourfilenames=`ls $pastaler/*.txt`

for eachfile in $yourfilenames
do

	while [ $a -lt 1 ]
	do
	   sleep 30
	   kar=`wget -O /dev/null "$urlsrv/api/lotes/leitura-lote"`
	   a=`expr $a + 1`
	done

   exit
done
		
