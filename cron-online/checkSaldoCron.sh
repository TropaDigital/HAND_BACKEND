#!/bin/bash
###
#CRON SALDO
###
a=0
while [ $a -lt 1 ]
do
   sleep 15
   kar=`wget -O /dev/null "http://handmkt.com.br/home/zink/login/rotina-saldo"`
   a=`expr $a + 1`
done
