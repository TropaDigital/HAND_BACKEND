#!/bin/bash
###
#CHAMA SCRIPT QUE ENVIA OS XMLS PARA A TWW 
###

caminho="/home/handmktbk/homolog.api.handmkt.com.br/public/cron-homolog/enviaLoteCron.sh"

a=0
while [ $a -lt 3 ]
do
   kar=`sh $caminho`
   sleep 15
   a=`expr $a + 1`
done
