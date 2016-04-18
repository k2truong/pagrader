#include <stdio.h>
#define THIS_YEAR 2013

main ( void ) {
  char  grade;                           /* Student's grade */
  int   birthyear;                       /* Student's year of birth */
  int   age;
  double gpa;                         /* Add age and gpa */
  printf ("Enter your grade: ");
  grade = getchar();                         /* Read single character input */

  printf ("Enter birthdate: ");
  scanf ("%d", &birthyear);                  /* Read integer input */
  getchar();                                  /* Read <Enter> key   */
  /* Calculate age */
  age= THIS_YEAR - birthyear;
  /* Add gpa input */
  printf ("Enter Grade Point Average: "); /* Student's gpa */
  scanf ("%lf", &gpa);                          /* Read double input */
  getchar();                                    /* Read <Enter> key */

  printf ("My GPA is %.3lf and my grade of %c.\n", gpa, grade);
  printf ("In %d I will be %d. ", THIS_YEAR+1, ++age );
  printf ("Will get grade of %c+.\n", grade );
  getchar();                                 /* Freeze output screen */
}
