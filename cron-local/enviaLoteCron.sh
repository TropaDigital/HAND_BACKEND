#!/bin/bash
###
#CRON QUE ENVIA OS XMLS PARA A TWW 
###

timestamp=$( date +%s )

urlsrv="http://10.0.0.222:8155"

pastaler="/var/www/html/zigzag_universal_relatorio/lotes/sh_envios/fila"
pastamvr="/var/www/html/zigzag_universal_relatorio/lotes/sh_envios/enviando"
pastacpr="/var/www/html/zigzag_universal_relatorio/lotes/sh_envios/logs"

yourfilenames=`ls $pastaler/*.txt`

for eachfile in $yourfilenames
do
	########
	cpar=`cp -r $eachfile $pastacpr/$timestamp.txt`
	mvar=`mv $eachfile $pastamvr/$timestamp.txt`
		 
	input="$pastamvr/$timestamp.txt"
	
	#echo $input
	#exit

	##while IFS= read -r var
	##while read LINE
	##while IFS="" read -r line
	cat $input | while read LINE
	do
		########
		lar=`sed -n 1p $input`
		nar=`ex -sc '1d|x' $input`	
		mar=`wget -O /dev/null "$urlsrv$lar"`
		#echo "$urlsrv$lar"
		sleep 2
	#done < $input
	done

	########
	#dlar=`rm -rf $pastamvr/$timestamp.txt`
   
   exit
done
