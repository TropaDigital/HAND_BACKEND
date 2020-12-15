#!/bin/bash
###
#CRON QUE LE ARQUIVOS DE LOTE CRIADOS E ENVIA PARA O BAKCEND
###
a=0
while [ $a -lt 4 ]
do
   sleep 15
   kar=`wget -O /dev/null "http://10.0.0.222:8154/naiche/campanha-gerenciamento/cron-lote"`
   a=`expr $a + 1`
done
