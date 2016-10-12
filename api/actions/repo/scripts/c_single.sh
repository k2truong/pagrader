#!/bin/bash
#Script for running a single assignment (This is for testing purposes)
red="\033[1;31m"
green="\033[1;32m"
blue="\033[1;34m"
clear="\033[0m"

#Enable bash's nullglob setting so that pattern *.c will expand to empty string if no such files
shopt -s nullglob

prt=(*.prt)
if test ${#prt[@]} -ne 1; then
  echo -en "Error: Missing PA prt file: \"PA#.prt\""
  exit -1
else
  #Parse PA#.prt for output (We are looking for a line that starts with .output)
  awk -v regex="[A-z]*.output" '$0 ~ regex {seen = 1}
     seen {print}' $prt > output.txt
fi

assignment="cs5uacP2.c"

sed 's/\r$//' $assignment > ${assignment:0:6}.txt
# This is to make sure that their programs have the stdlib.h since students don't check that it
# works on the linux machines and turn in without running it
echo '#include <stdlib.h>' | cat - $assignment > temp && mv temp $assignment

# Convert C code to HTML using VIM for display
# for f in ${assignments[@]}; do
#   vim -f +"syn on" +"colorscheme ron" +"TOhtml" +"wq" +"q" code
#   mv code.html "${f%.c}.html"
# done

counter=0
#Parse PA.prt file
while read LINE
do
  [ -z "$LINE" ] && continue
  #Find PA's info in PA.prt file for bonus date
  if [[ "$LINE" =~ "${assignment:0:6}" ]]
  then
    fname="${assignment:0:6}"

    # Convert bonus date of PA to seconds
    # Get date Each line in PA.prt has the turn in date on the 6th 7th 8th column
    filetime=$(date --date="$(echo $LINE | cut -d' ' -f6,7,8)" +%s)

    #Compile and ignore warnings
    gcc -Werror ${assignment} &> $fname.out.html
    #Check if error
    if [ $? -ne 1 ]; then
      #Run program manually feeding input and printing out output in background process
      if [ -e input ]; then
        rm input
      fi

      cp input.txt temp

      inCount=$(wc -l < input.txt)
      test `tail -c 1 "input.txt"` && ((inCount++))
      count=0
      # Run until all input given
      while [ $count -lt $inCount ]
      do
        if [ -e input ]; then
          if [[ $errorCode -eq 121 ]]; then
            # For some reason the script is terminating programs when it should keep going
            echo "<p class='alert alert-danger'>Program terminated by grading script remote I/O error.\nPlease run their program manually or check their code.</p>" >> $fname.out.html
          else
            echo "<p class='alert alert-danger'>Program ended on last input... Restarting program...</p>" >> $fname.out.html
          fi
        fi

        if [ -e "strace.fifo" ]; then
          rm strace.fifo
        fi

        # This is the core of the script
        # This uses strace to help feed input
        # stdbuf -o0 helps flush input along with the output
        # perl -e "alarm 2; exec @ARGV" "./a.out" helps kills the process if it takes over 2 seconds
        inputFlag=false
        mkfifo strace.fifo
        {
          while read -d, trace; do
            if [[ $trace = *"read(0" ]] ; then
              IFS= read -rn1 answer <&3 || break
              answer=${answer:-$'\n'}
              printf "<font style='color: purple;'>$answer</font>" >> $fname.out.html
              printf "$answer" >> input
              diff -w -B input input.txt > /dev/null
              if [[ $? -eq 0 ]] ; then
                # End of input
                inputFlag=true
              fi
              printf %s "$answer"
            elif $inputFlag ; then
              killall -15 a.out > /dev/null 2>&1
            fi
          done < strace.fifo 3< temp | strace -o strace.fifo -f -e read stdbuf -o0 perl -e "alarm 2; exec @ARGV" "./a.out"
        } >> $fname.out.html 2>>error

        errorCode=$?
        #Check if the program was terminated
        if [[ $errorCode -eq 142 ]] ; then
          printf "<p class='alert alert-danger'>Program terminated because of infinite loop.\nPlease run their program manually or check their code.</p>" > $fname.out.html
          rm error # Error is from infinite loop
          break
        elif [[ $errorCode -eq 143 ]] ; then
          printf "<p class='alert alert-danger'>Program terminated because it was waiting for more input than expected.\n(Note: This could mean they have getchar() at the end of their code.\nPlease run their program manually or check their code.)</p>" >> $fname.out.html
          rm error # Error is from running out of input
          break
        elif [ -s error ] ; then
          echo "<h2 class='alert alert-danger'>Runtime Error!</h2>" >> $fname.out.html
          cat error >> $fname.out.html
          rm error # Run time error
          break
        fi

        # Remove empty error files
        if [ -e error ] ; then
          rm error
        fi

        diff -w -B input input.txt > /dev/null
        if [ $? -eq 1 ] ; then
           test 'tail -c 1 "input"' && echo "" >> input
           count=$(wc -l < input)
           test `tail -c 1 "input"` && ((count++))
           tail -n $(expr ${count} - ${inCount}) input.txt > temp
        else
           rm strace.fifo
           break
        fi
      done

      if [ -e input ] ; then
        rm input
      fi

      rm temp a.out
    else  #Error while compiling
      echo "<h2 class='alert alert-danger'>Compile Error!</h2>" | cat - $fname.out.html > temp && mv temp $fname.out.html
    fi
  fi
done < $prt

if [ -e "strace.fifo" ]; then
  rm strace.fifo
fi
