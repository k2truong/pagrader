/*
 * Assignment 1                             pl.c:           Due July 5, 2013
 * login #:  cs5uaa
 *
 * This program reads in student's information of : birthyear,
 * GPA, and letter grade using int, double, and char data types.
 * Age is calculated from birth year.
 *
 * Type integer is used for the variables to hold the age and
 * year values. Type double is used to store the GPA.
 *
 * Type char is used for the single character letter grade.
 */
 #include <stdio.h>
 #define THIS_YEAR 2013

 main( void )
 {
      char  grade;                             /* Student's grade */
      int   birthyear;                         /* Student's year of birth */
      double GPA;                                         /* Add age and gpa */
      int   age;

      printf ("Enter your grade in the class: ");
      grade = getchar();                      /* Read single character input*/

      printf ("Enter your birthyear: ");
      scanf ("%d", &birthyear);               /* Read integer input */
      getchar();                             /* Read <ENTER> key */


      printf ("Enter your GPA (Grade Point Average): ");     /* Add gpa input */
      scanf ("%lf", &GPA);
      getchar();

      age = THIS_YEAR - birthyear;                    /* Calculate age */

      printf ("I am %d years old with a GPA of %.3lf and a class grade of %c. \n", age, GPA, grade );
      printf ("In %d I will be %d.  ", THIS_YEAR+1, ++age );
      printf ("If I study hard, I will get an outstanding grade of %c+. \n", grade );
      getchar();                              /* Freeze output screen */
 }

