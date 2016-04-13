/*
 *Assignment 1               p1.c:                Due July 5, 2013
 *login #: cs5uac
 *
 *This program reads in student's information of: birth year,
 *GPA, and letter grade using int, double, and char data types.
 *Age is calculated from birth year.
 *
 *Type integer is used for the variables to hold the age and
 *year values. Type double is used to store the GPA.
 *Type char is used for the single character letter grade.
 *
 *Symbolic constant "THIS_YEAR" is used for current year.
 */



#include <stdio.h>
#define THIS_YEAR 2013

main ( void )
 {
     char  grade;                           /* Student's grade */
     int   birthyear;                       /* Student's year of birth */
     int   age;
     double gpa;                         /* Add age and gpa */
 printf ("Enter your grade in the class: ");
 grade = getchar();                         /* Read single character input */

 printf ("Enter your birthyear: ");
 scanf ("%d", &birthyear);                  /* Read integer input */
 getchar();                                  /* Read <Enter> key   */
 /* Calculate age */
 age= THIS_YEAR - birthyear;
 /* Add gpa input */
 printf ("Enter your GPA (Grade Point Average): "); /* Student's gpa */
 scanf ("%lf", &gpa);                          /* Read double input */
 getchar();                                    /* Read <Enter> key */

 printf ("I am 20 years old with a GPA of %.3lf and a class grade of %c.\n", gpa, grade);
 printf ("In %d I will be %d. ", THIS_YEAR+1, ++age );
 printf ("If I study hard, I will get an outstanding grade of %c+.\n", grade );
  getchar();                                 /* Freeze output screen */
}
