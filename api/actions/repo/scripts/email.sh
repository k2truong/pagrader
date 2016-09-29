#!/bin/bash
# Script to email comments to all students
# Author:   Kenneth Truong
# Version:  1.0
# Date:     06/05/13
# Usage:
# 1) chmod 777 email.sh  // Give permission if access denied
# 2) ./email.sh kenneth.e.truong@gmail.com 'CS5F2: PA5 Grades'
#    ./email.sh <EMAIL>                     <TITLE>             <VERIFICATION>

if [[ $3 ]]; then
  grades=(*.html)
  counter=0
  # Loop until all grades are sent
  while [ $counter -lt ${#grades[@]} ]; do
    user="${grades[${counter}]%.*}"
    export MAILTO="$user@acsmail.ucsd.edu"
    export BCC="$1"
    export SUBJECT="$2"
    (
       echo "To: $MAILTO"
       echo "Bcc: $BCC"
       echo "Subject: $SUBJECT"
       echo "MIME-Version: 1.0"
       echo "Content-Type: text/html; charset=utf-8"
       echo "Content-Disposition: inline"
       cat ${grades[${counter}]}
    ) | /usr/sbin/sendmail
    counter=$((counter+1))
  done
fi

(
  echo "Grades and comments attached"
) | mutt -a PAScores.txt -s "$2 $3" "$1, smarx@cs.ucsd.edu"
