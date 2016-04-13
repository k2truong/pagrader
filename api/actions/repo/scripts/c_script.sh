#!/bin/bash
#Script for grading C programs (CSE 5)
#Usage: ./c_script.sh <Optional Bonus Due Date>
#Example: ./c_script.sh "01/24/2015 15:00"
red="\033[1;31m"
green="\033[1;32m"
blue="\033[1;34m"
clear="\033[0m"

#Enable bash's nullglob setting so that pattern *.c will expand to empty string if no such files
shopt -s nullglob

#Check if bonus date specified
if [[ -n $1 ]]; then
  # Bonus date change 15:00 if different time
  bonus=$(date +'%s' -d "${1}")
else
  # NO bonus dates so just setting artbitrary date in past
  bonus=$(date +'%s' -d "01/24/1991 15:00:00.000")
fi


if [ ! -e "input.txt" ]; then
  echo -en "Error: Missing file: \"input.txt\""
  exit -1
fi

prt=(*.prt)
#Parse PA#.prt for output
if test ${#prt[@]} -ne 1; then
  echo -en "Error: Missing PA prt file: \"PA#.prt\""
  exit -1
else
  awk -v regex="[A-z]*.output" '$0 ~ regex {seen = 1}
     seen {print}' $prt > output
  awk '(NR==1){print "<p>\n" $0} (NR%14&&NR!=1){print $0}!(NR%14){print $0} END{print "</p>"}' output > output.html
  rm output
fi

repos=(*/)
for dir in ${repos[@]}; do
  cp input.txt $prt $dir
  cd $dir

  assignments=(*.c)
  # Get filenames
  if test ${#assignments[@]} -le 0; then
    continue
  else
    echo $dir
  fi

  # Remove all previous output
  if [ -e ${assignments[0]%.c}.out.html ] ; then
     rm *.out.html
  fi

  # Convert C code to HTML using VIM for display
  for f in ${assignments[@]}; do
    vim -f +"syn on" +"colorscheme ron" +"TOhtml" +"wq" +"q" $f
  done

  bonuslist=""
  counter=0
  #Parse PA.prt file
  while read LINE
  do
    [ -z "$LINE" ] && continue
    #Find PA's info in PA.prt file for bonus date
    if [[ "$LINE" =~ "${assignments[${counter}]:0:6}" ]]
    then
      # echo ${assignments[${counter}]%.c}
      fname="${assignments[${counter}]%.c}"

      #Convert bonus date of PA to seconds
      filetime=$(date --date="$(echo $LINE | cut -d' ' -f6,7,8)" +%s)

      #Compile and ignore warnings
      gcc -Werror ${assignments[${counter}]} &> $fname.out
      #Check if error
      if [ $? -ne 1 ]; then
        #Check for extra credit
        if [ $filetime -le $bonus ]; then
          # echo -en "[ ${green}$fname${clear} ]\n"
          bonuslist="${bonuslist} \"${fname}\","
        # else
          # echo -en "[ ${blue}$fname${clear} ]\n"
        fi

        #Run program manually feeding input and printing out output in background process
        if [ -e "in" ]; then
          rm in
        fi

        cp input.txt input

        inCount=$(wc -l < input.txt)
        test `tail -c 1 "input.txt"` && ((inCount++))
        count=0
        # Run until all input given
        while [ $count -lt $inCount ]
        do
          if [ -e "in" ]; then
             echo "<br /><font color=red>Program ended on last input... Restarting program...</font><br />" >> $fname.out
          fi

          if [ -e "strace.fifo" ]; then
            rm strace.fifo
          fi

          flag=false
          mkfifo strace.fifo
          {
            while read -d, trace; do
              if [[ $trace = *"read(0" ]] ; then
                IFS= read -rn1 answer <&3 || break
                printf "<font color=purple>" >> $fname.out
                answer=${answer:-$'\n'}
                printf %s "$answer" >&2
                printf "$answer" >> in
                printf "</font>" >> $fname.out
                diff -w -B in input.txt > /dev/null
                if [ $? -eq 0 ] ; then
                  flag=true
                  echo "<font color=red>" >> $fname.out
                fi
                printf %s "$answer"
              elif $flag ; then
                killall -15 a.out > /dev/null 2>&1
                echo "</font>" >> $fname.out
              fi
            done < strace.fifo 3< input | strace -o strace.fifo -e read stdbuf -o0 ./a.out &
          } >> $fname.out 2>&1

          # Check if program still running and input not done
          sleep .05
          if [ "$(pidof a.out)" ] ; then
            sleep .1
            if [ "$(pidof a.out)" ]; then
              sleep .25
              if [ "$(pidof a.out)" ]; then
                sleep .5
                if [ "$(pidof a.out)" ]; then
                  if killall -15 a.out > /dev/null 2>&1; then
                    echo "<br /><font color=red>Error: Infinite Loop please check manually</font><br />" >> $fname.out
                    rm strace.fifo
                    # echo -en "${red}INFINITE LOOP FAIL: $fname${clear}\n"
                    break
                  fi
                fi
              fi
            fi
          fi

          diff -w -B in input.txt > /dev/null
          if [ $? -eq 1 ] ; then
             test 'tail -c 1 "in"' && echo "" >> in
             count=$(wc -l < in)
             test `tail -c 1 "in"` && ((count++))
             tail -n $(expr ${count} - ${inCount}) input.txt > input
          else
             rm strace.fifo
             break
          fi
        done
        rm input
        rm in
        awk '(NR==1){print "<p>" $0} (NR%21&&NR!=1){print $0}!(NR%21){print $0} END{print "</p>"}' $fname.out > $fname.out.html
        rm $fname.out a.out

      #Error while compiling
      else
        cat - $fname.out > $fname.out.html
        rm $fname.out
        #Check for extra credit
        if [ $filetime -le $bonus ]; then
            # echo -en "[ ${green}$fname FAIL${clear} ]\n"
            bonuslist="${bonuslist} \"${fname}\","
        # else
            # echo -en "[ ${red}$fname FAIL${clear} ]\n"
        fi
      fi
      counter=$((counter+1))
      [ $counter -eq ${#assignments[@]} ] && break
    fi
  done < $prt

  #Bonus list remove comma at end
  bonuslist=${bonuslist%?}

  echo $bonuslist > bonusList


  if [ -e "strace.fifo" ]; then
    rm strace.fifo
  fi

  rm input.txt $prt
  cd ..
done
