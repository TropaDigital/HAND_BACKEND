#!/bin/bash
###
#CHECA SE O ARQUIVO AINDA TEM URLS E COLCA DE VOLTA NA FILA
###

pastamvr="/home/handmktbk/homolog.api.handmkt.com.br/public/lotes/sh_preencher/fila"
pastaler="/home/handmktbk/homolog.api.handmkt.com.br/public/lotes/sh_preencher/preenchendo"

timestamp=$( date +%s )

yourfilenames=`ls $pastaler/*.txt`

for eachfile in $yourfilenames
do
	actualsize=$(du -k "$eachfile" | cut -f 1)
	
	last_modified=`stat -c "%Y" $eachfile`
	
	#echo $actualsize
	
	if [ $(($timestamp - $last_modified)) -gt 180 ]
	then
		if [ $actualsize -gt 0 ]
		then
			#echo 'mover'
			kar=`mv $eachfile $pastamvr`
		fi
	fi

done
