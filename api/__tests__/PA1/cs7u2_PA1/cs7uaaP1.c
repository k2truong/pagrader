 #include <stdio.h>
 #define THIS_YEAR 2013

 main( void ) {
  char  grade;                                                /* Student's grade */
  int   birthyear;                                            /* Student's year of birth */
  double GPA;                                                 /* Add age and gpa */
  int   age;

  printf ("Please enter your grade: ");
  grade = getchar();                      /* Read single character input*/

  printf ("Birthdate: ");
  scanf ("%d", &birthyear);               /* Read integer input */
  getchar();                             /* Read <ENTER> key */


  printf ("Enter GPA: ");     /* Add gpa input */
  scanf ("%lf", &GPA);
  getchar();

  age = THIS_YEAR - birthyear;                    /* Calculate age */

  printf ("I'm %d years old. My GPA is %.3lf and my grade is %c. \n", age, GPA, grade );
  printf ("In %d I'll be %d.  ", THIS_YEAR+1, ++age );
  printf ("Will get grade of %c+. \n", grade );
  getchar();                              /* Freeze output screen */
 }

