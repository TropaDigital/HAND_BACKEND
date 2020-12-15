#!/bin/bash

input="/var/www/html/zigzag_relatorio/shell/teste.txt"
a=0
while [ $a -lt 2 ]
do
   #kar=`wget -O /dev/null "http://10.0.0.222:8142/api/lotes/envia-lote"`
   
   rar=`sed -n 1p $input`
   
   #echo "-- $rar"
   kar=`wget -O /dev/null "http://10.0.0.222:8142$rar"`
   
   nar=`sed -i 1d $input`
   
   sleep 1
   
   a=`expr $a + 1`
done

#input="/var/www/html/zigzag_relatorio/lotes/teste.txt"
#a=0
#while IFS= read -r var
#do
#	if [ $a -lt 5 ]
	#then
		#yar=`date` 
		#echo "$yar - $var"
		#echo "$var"
		#kar=`sed -i '1d' $input`
	#	sleep 1
	#	a=`expr $a + 1`
	#else
	#	break
	#fi
#done < "$input"

