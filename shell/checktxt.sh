#!/bin/bash

pastaler="/var/www/html/zigzag_relatorio/shell/enviando"
pastamvr="/var/www/html/zigzag_relatorio/shell/fila"

timestamp=$( date +%s )

#last_modified=`stat -c "%Y" $input/teste.txt`
#echo $timestamp
#echo $last_modified
#echo `expr $timestamp - $last_modified`

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
